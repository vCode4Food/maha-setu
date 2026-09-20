import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import type { Role, User, AuthSession, OTPChallenge } from '@/types'
import { demoAccounts, accountByMahaId, loadRegistered, saveRegistered, REGISTERED_KEY, type RegisteredCitizen } from '@/data/auth'
import { demoUsers, roleMeta } from '@/data/users'
import {
  generateOtp, newSessionId, isPasswordValid, nextCitizenMahaId,
  IDLE_TIMEOUT_MS, SESSION_TTL_MS, OTP_TTL_MS, OTP_MAX_ATTEMPTS,
} from '@/utils/auth'

/*
 * Simulated authentication — frontend-only prototype.
 * OTPs are generated in the browser and displayed in the UI (demo challenge).
 * Never represent this as production authentication.
 */

interface AuthResult { ok: boolean; message?: string }

export interface AuthCtx {
  user: User | null
  session: AuthSession | null
  /** Stage 1+2 passed; awaiting OTP. */
  pendingMahaId: string | null
  pendingUser: User | null
  challenge: OTPChallenge | null
  loginWithPassword: (mahaId: string, password: string) => AuthResult
  verifyOtp: (otp: string) => AuthResult
  resendOtp: () => void
  cancelLogin: () => void
  /* registration */
  registrationMobileVerified: boolean
  requestRegistrationOtp: (mobile: string) => AuthResult
  verifyRegistrationOtp: (otp: string) => AuthResult
  completeRegistration: (data: { fullName: string; password: string; mobile: string; email: string }) => { mahaId: string }
  /* forgot password */
  resetVerified: boolean
  requestPasswordReset: (mahaId: string) => AuthResult
  verifyPasswordResetOtp: (otp: string) => AuthResult
  resetPassword: (pw: string) => AuthResult
  /* forgot maha id */
  recoveredMahaId: string | null
  requestMahaIdRecovery: (identifier: string) => AuthResult
  verifyMahaIdRecoveryOtp: (otp: string) => AuthResult
  /* session */
  logout: () => void
}

const Ctx = createContext<AuthCtx | null>(null)
const SESSION_KEY = 'mahasetu-session'

function loadSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as AuthSession
    if (Date.now() > s.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }
    return s
  } catch {
    return null
  }
}

/** Map a demo account (or freshly registered citizen) to the User shape the portals expect. */
function userForAccount(mahaId: string): User | null {
  const acct = accountByMahaId(mahaId)
  if (acct) {
    const base = demoUsers[acct.role]
    return { ...base, mahaId: acct.mahaId, name: acct.name }
  }
  const registered = loadRegistered().find((r) => r.mahaId === mahaId)
  if (registered) {
    return {
      ...demoUsers.citizen,
      id: `cit-reg-${registered.mahaId}`,
      name: registered.fullName,
      mahaId: registered.mahaId,
      aadhaarMasked: 'XXXX XXXX 0000',
    }
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(loadSession)
  const [user, setUser] = useState<User | null>(() => {
    const s = loadSession()
    return s ? userForAccount(s.mahaId) : null
  })
  const [pendingMahaId, setPendingMahaId] = useState<string | null>(null)
  const [pendingUser, setPendingUser] = useState<User | null>(null)
  const [challenge, setChallenge] = useState<OTPChallenge | null>(null)
  const [registrationMobileVerified, setRegistrationMobileVerified] = useState(false)
  const [resetVerified, setResetVerified] = useState(false)
  const [recoveredMahaId, setRecoveredMahaId] = useState<string | null>(null)
  /* Activity is a ref, not state — see the session effect below. */
  const lastActivityRef = useRef(Date.now())

  /* ---------------- session persistence ---------------- */
  useEffect(() => {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else sessionStorage.removeItem(SESSION_KEY)
  }, [session])

  const logout = useCallback(() => {
    setSession(null)
    setUser(null)
    setPendingMahaId(null)
    setPendingUser(null)
    setChallenge(null)
    setRegistrationMobileVerified(false)
    setResetVerified(false)
    setRecoveredMahaId(null)
  }, [])

  /* ---------------- idle + absolute expiry ---------------- */
  useEffect(() => {
    if (!session) return
    lastActivityRef.current = session.lastActivity ?? Date.now()
    let last = 0
    /* PERF: activity is tracked in a ref and mirrored to sessionStorage only.
       Writing it to state re-created the context value and re-rendered the
       entire app tree on every interaction (the reported "dashboard lag"). */
    const throttled = () => {
      const now = Date.now()
      if (now - last > 5000) {
        last = now
        lastActivityRef.current = now
        try {
          const raw = sessionStorage.getItem(SESSION_KEY)
          if (raw) {
            const s = JSON.parse(raw) as AuthSession
            s.lastActivity = now
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(s))
          }
        } catch { /* storage unavailable — session still works in memory */ }
      }
    }
    const events: (keyof WindowEventMap)[] = ['click', 'keydown', 'scroll']
    events.forEach((e) => window.addEventListener(e, throttled, { passive: true }))
    /* Expiry check only acts (logs out) — it never sets state on healthy ticks. */
    const interval = window.setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_TIMEOUT_MS || Date.now() > session.expiresAt) logout()
    }, 15000)
    return () => {
      events.forEach((e) => window.removeEventListener(e, throttled))
      window.clearInterval(interval)
    }
  }, [session, logout])

  /* ---------------- OTP challenges (fresh OTP every issue) ---------------- */
  const issueChallenge = useCallback((mahaId: string, purpose: OTPChallenge['purpose']): OTPChallenge => {
    const c: OTPChallenge = {
      otp: generateOtp(),
      mahaId,
      purpose,
      expiresAt: Date.now() + OTP_TTL_MS,
      attemptsLeft: OTP_MAX_ATTEMPTS,
      resendIn: 30,
    }
    setChallenge(c)
    return c
  }, [])

  const clearChallenge = useCallback(() => setChallenge(null), [])

  /* Resend countdown ticker (keyed on the challenge itself) */
  const challengeRef = useRef(challenge)
  challengeRef.current = challenge
  useEffect(() => {
    const t = window.setInterval(() => {
      const c = challengeRef.current
      if (c && c.resendIn > 0) setChallenge((cur) => (cur && cur.resendIn > 0 ? { ...cur, resendIn: cur.resendIn - 1 } : cur))
    }, 1000)
    return () => window.clearInterval(t)
  }, [])

  /* ---------------- LOGIN: Maha ID + password → OTP ---------------- */
  const loginWithPassword = useCallback((mahaId: string, password: string): AuthResult => {
    const acct = accountByMahaId(mahaId)
    const registered = loadRegistered().find((r) => r.mahaId === mahaId.trim())
    if (!acct && !registered) return { ok: false, message: 'No account found for this Maha ID. Use one of the demo credentials below.' }
    const realPassword = acct?.password ?? registered?.password
    if (password !== realPassword) return { ok: false, message: 'Incorrect password. Demo passwords are shown in the Demo Credentials panel.' }
    const id = acct?.mahaId ?? registered!.mahaId
    setPendingMahaId(id)
    setPendingUser(userForAccount(id))
    issueChallenge(id, 'login')
    return { ok: true }
  }, [issueChallenge])

  const verifyOtp = useCallback((otp: string): AuthResult => {
    if (!challenge || !pendingMahaId) return { ok: false, message: 'No login in progress. Please sign in again.' }
    if (Date.now() > challenge.expiresAt) {
      clearChallenge()
      return { ok: false, message: 'This OTP has expired. Tap Resend OTP for a new one.' }
    }
    if (challenge.otp !== otp.trim()) {
      const left = challenge.attemptsLeft - 1
      if (left <= 0) {
        clearChallenge()
        return { ok: false, message: 'Too many incorrect attempts. Please verify your credentials again.' }
      }
      setChallenge({ ...challenge, attemptsLeft: left })
      return { ok: false, message: `Incorrect OTP. ${left} attempt${left === 1 ? '' : 's'} remaining.` }
    }
    const u = pendingUser ?? userForAccount(pendingMahaId)
    if (!u) return { ok: false, message: 'Account could not be resolved.' }
    const s: AuthSession = {
      sessionId: newSessionId(),
      mahaId: pendingMahaId,
      userId: u.id,
      role: u.role,
      loginAt: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true }),
      lastActivity: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS,
    }
    setSession(s)
    setUser(u)
    setPendingMahaId(null)
    setPendingUser(null)
    clearChallenge()
    return { ok: true }
  }, [challenge, pendingMahaId, pendingUser, clearChallenge])

  const resendOtp = useCallback(() => {
    if (!pendingMahaId) return
    issueChallenge(pendingMahaId, challengeRef.current?.purpose ?? 'login')
  }, [pendingMahaId, issueChallenge])

  const cancelLogin = useCallback(() => {
    setPendingMahaId(null)
    setPendingUser(null)
    clearChallenge()
  }, [clearChallenge])

  /* ---------------- REGISTRATION ---------------- */
  const requestRegistrationOtp = useCallback((mobile: string): AuthResult => {
    if (mobile.replace(/\D/g, '').length < 10) return { ok: false, message: 'Enter a valid 10-digit mobile number.' }
    issueChallenge('registration', 'register')
    return { ok: true }
  }, [issueChallenge])

  const verifyRegistrationOtp = useCallback((otp: string): AuthResult => {
    if (!challenge || challenge.purpose !== 'register') return { ok: false, message: 'Request an OTP first.' }
    if (Date.now() > challenge.expiresAt) return { ok: false, message: 'OTP expired — request a new one.' }
    if (challenge.otp !== otp.trim()) return { ok: false, message: 'Incorrect OTP. Check the demo OTP shown on screen.' }
    setRegistrationMobileVerified(true)
    clearChallenge()
    return { ok: true }
  }, [challenge, clearChallenge])

  const completeRegistration = useCallback(({ fullName, password, mobile, email }: { fullName: string; password: string; mobile: string; email: string }) => {
    const list = loadRegistered()
    const mahaId = nextCitizenMahaId(list.map((r) => r.mahaId).concat(demoAccounts.map((a) => a.mahaId)))
    const rec: RegisteredCitizen = { mahaId, password, fullName, mobile, email }
    saveRegistered([...list, rec])
    return { mahaId }
  }, [])

  /* ---------------- FORGOT PASSWORD ---------------- */
  const requestPasswordReset = useCallback((mahaId: string): AuthResult => {
    const acct = accountByMahaId(mahaId)
    const registered = loadRegistered().find((r) => r.mahaId === mahaId.trim())
    if (!acct && !registered) return { ok: false, message: 'No account found for this Maha ID.' }
    const id = acct?.mahaId ?? registered!.mahaId
    setPendingMahaId(id)
    issueChallenge(id, 'reset-password')
    return { ok: true }
  }, [issueChallenge])

  const verifyPasswordResetOtp = useCallback((otp: string): AuthResult => {
    if (!challenge || challenge.purpose !== 'reset-password') return { ok: false, message: 'Request an OTP first.' }
    if (Date.now() > challenge.expiresAt) return { ok: false, message: 'OTP expired — request a new one.' }
    if (challenge.otp !== otp.trim()) return { ok: false, message: 'Incorrect OTP. Check the demo OTP shown on screen.' }
    setResetVerified(true)
    clearChallenge()
    return { ok: true }
  }, [challenge, clearChallenge])

  const resetPassword = useCallback((pw: string): AuthResult => {
    if (!isPasswordValid(pw)) return { ok: false, message: 'Password does not meet the requirements.' }
    if (!pendingMahaId) return { ok: false, message: 'Reset session lost — start again.' }
    const acct = accountByMahaId(pendingMahaId)
    if (acct) acct.password = pw // demo store is in-memory
    const list = loadRegistered()
    const idx = list.findIndex((r) => r.mahaId === pendingMahaId)
    if (idx >= 0) {
      list[idx] = { ...list[idx], password: pw }
      saveRegistered(list)
    }
    setPendingMahaId(null)
    setResetVerified(false)
    return { ok: true }
  }, [pendingMahaId])

  /* ---------------- FORGOT MAHA ID ---------------- */
  const requestMahaIdRecovery = useCallback((identifier: string): AuthResult => {
    const id = identifier.trim().toLowerCase()
    const digits = id.replace(/\D/g, '')
    const acct = demoAccounts.find(
      (a) => a.email.toLowerCase() === id || (digits.length >= 4 && a.maskedMobile.replace(/\D/g, '').endsWith(digits)),
    )
    const registered = loadRegistered().find(
      (r) => (r.email && r.email.toLowerCase() === id) || (digits.length >= 10 && r.mobile.replace(/\D/g, '').endsWith(digits)),
    )
    if (!acct && !registered) return { ok: false, message: 'No demo account matches that mobile or email. Try aarav.sharma@example.in' }
    const mahaId = acct?.mahaId ?? registered!.mahaId
    setPendingMahaId(mahaId)
    issueChallenge(mahaId, 'recovery-maha-id')
    return { ok: true }
  }, [issueChallenge])

  const verifyMahaIdRecoveryOtp = useCallback((otp: string): AuthResult => {
    if (!challenge || challenge.purpose !== 'recovery-maha-id') return { ok: false, message: 'Request an OTP first.' }
    if (Date.now() > challenge.expiresAt) return { ok: false, message: 'OTP expired — request a new one.' }
    if (challenge.otp !== otp.trim()) return { ok: false, message: 'Incorrect OTP. Check the demo OTP shown on screen.' }
    setRecoveredMahaId(pendingMahaId)
    clearChallenge()
    return { ok: true }
  }, [challenge, clearChallenge, pendingMahaId])

  /* PERF: a memoized value keeps every useAuth consumer stable unless real
     auth state changed (previously a fresh object re-rendered the whole tree). */
  const value = useMemo<AuthCtx>(() => ({
    user, session,
    pendingMahaId, pendingUser, challenge,
    loginWithPassword, verifyOtp, resendOtp, cancelLogin,
    registrationMobileVerified, requestRegistrationOtp, verifyRegistrationOtp, completeRegistration,
    resetVerified, requestPasswordReset, verifyPasswordResetOtp, resetPassword,
    recoveredMahaId, requestMahaIdRecovery, verifyMahaIdRecoveryOtp,
    logout,
  }), [user, session, pendingMahaId, pendingUser, challenge, registrationMobileVerified, resetVerified, recoveredMahaId, loginWithPassword, verifyOtp, resendOtp, cancelLogin, requestRegistrationOtp, verifyRegistrationOtp, completeRegistration, requestPasswordReset, verifyPasswordResetOtp, resetPassword, requestMahaIdRecovery, verifyMahaIdRecoveryOtp, logout])

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { roleMeta }
