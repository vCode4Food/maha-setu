import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  IdCard, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, Info, ShieldCheck, KeyRound,
  Copy, CheckCircle2, UserCheck, Building2, Landmark, Briefcase, Users, Home,
} from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { MahaSetuBrand } from '@/components/branding/MahaSetuBrand'
import { Card, Field, inputCls } from '@/components/ui/primitives'
import { useAuth } from '@/context/AuthContext'
import { demoAccounts } from '@/data/auth'
import { maskMobile, isValidMahaId } from '@/utils/auth'
import type { Role } from '@/types'

type Phase = 'credentials' | 'verifying' | 'otp'

const ROLE_ICONS: Record<Role, typeof Users> = {
  citizen: Users, official: UserCheck, business: Briefcase, department_admin: Building2, super_admin: Landmark,
}

/** Authenticated user redirect target per role. */
function homeFor(role: Role): string {
  return { citizen: '/citizen', official: '/official', business: '/business', department_admin: '/department-admin', super_admin: '/admin' }[role]
}

export default function Login() {
  const navigate = useNavigate()
  const {
    loginWithPassword, verifyOtp, resendOtp, cancelLogin, pendingUser, challenge,
  } = useAuth()
  const [phase, setPhase] = useState<Phase>('credentials')
  const [mahaId, setMahaId] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [otp, setOtp] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [credsOpen, setCredsOpen] = useState(true)

  /* Masked mobile of the pending account for the OTP screen */
  const pendingAcct = demoAccounts.find((a) => a.mahaId === pendingMahaIdSafe(pendingUser?.mahaId))

  const submitCredentials = (e?: React.FormEvent) => {
    e?.preventDefault()
    setErr('')
    if (!isValidMahaId(mahaId)) { setErr('Enter a valid Maha ID (e.g. MS-CIT-1001).'); return }
    if (!password) { setErr('Enter your password.'); return }
    setBusy(true)
    // small delay to show the verifying state
    window.setTimeout(() => {
      const res = loginWithPassword(mahaId, password)
      setBusy(false)
      if (res.ok) setPhase('otp')
      else setErr(res.message ?? 'Login failed')
    }, 700)
  }

  const doVerify = (e?: React.FormEvent) => {
    e?.preventDefault()
    setErr('')
    const res = verifyOtp(otp)
    if (res.ok) {
      setPhase('verifying')
      window.setTimeout(() => navigate(homeFor(pendingUser?.role ?? 'citizen')), 900)
    } else {
      setErr(res.message ?? 'Verification failed')
    }
  }

  const useDemo = (id: string, pw: string) => {
    setMahaId(id)
    setPassword(pw)
    setErr('')
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left visual panel */}
      <div className="relative hidden lg:block bg-primary-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=1600&q=70&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center 30%' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-950/70 to-primary-900/40" />
        <div className="relative h-full flex flex-col justify-between p-10">
          <Logo light to="/" />
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight max-w-md">One MahaSetu ID for every government service.</h2>
            <p className="text-white/60 mt-4 max-w-md">
              Your unique Maha ID is your single sign-on across Maharashtra's departments — documents, applications,
              consents and notifications in one place.
            </p>
            <div className="mt-8 space-y-3 max-w-md">
              {['Document vault reused across services', 'Consent-based data sharing', 'One application tracking timeline'].map((t) => (
                <div key={t} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t}
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-white/40 max-w-md">
            Prototype Demo — authentication, OTP delivery and identity verification are simulated. No real Aadhaar data or production credentials are processed.
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Auth navbar — official brand + Back to Home (brand shows on mobile; the
              desktop brand lives in the left navy panel) */}
          <div className="flex items-center justify-between mb-6">
            <MahaSetuBrand variant="compact" to="/" className="lg:hidden" />
            <Link to="/" className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-700">
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>

          <Card className="p-6 sm:p-8 shadow-pop">
            {phase === 'credentials' && (
              <form onSubmit={submitCredentials}>
                <h1 className="text-2xl font-bold text-slate-900">Login to MahaSetu</h1>
                <p className="text-sm text-slate-500 mt-1.5">One MahaSetu ID. Multiple government services.</p>

                <div className="mt-6 space-y-4">
                  <Field label="Maha ID" required>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input value={mahaId} onChange={(e) => setMahaId(e.target.value.toUpperCase())} className={`${inputCls} pl-9 tracking-wide`} placeholder="MS-CIT-1001" autoComplete="username" />
                    </div>
                  </Field>

                  <Field label="Password" required>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputCls} pl-9 pr-10`}
                        placeholder="Your MahaSetu password"
                        autoComplete="current-password"
                      />
                      <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label={showPw ? 'Hide password' : 'Show password'}>
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>
                  <div className="text-right -mt-2">
                    <Link to="/forgot-password" className="text-sm text-primary-700 hover:text-primary-900 font-medium">Forgot Password?</Link>
                  </div>

                  <button type="submit" disabled={busy} className="w-full rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800 disabled:opacity-60 flex items-center justify-center gap-2">
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify & Continue <ArrowRight className="w-4 h-4" /></>}
                  </button>

                  {err && <p className="text-sm text-rose-600" role="alert">{err}</p>}

                  <div className="flex items-center justify-between text-sm pt-1">
                    <Link to="/forgot-maha-id" className="text-slate-500 hover:text-primary-700 font-medium">Forgot Maha ID?</Link>
                    <Link to="/register" className="text-primary-700 hover:text-primary-900 font-semibold">New to MahaSetu? Create Maha ID</Link>
                  </div>
                </div>

                {/* Demo credentials panel */}
                <div className="mt-7 rounded-2xl border border-sky-200 bg-sky-50/60 overflow-hidden">
                  <button type="button" onClick={() => setCredsOpen((o) => !o)} className="w-full px-4 py-3 flex items-center justify-between text-left">
                    <span className="flex items-center gap-2 text-sm font-semibold text-sky-900">
                      <Info className="w-4 h-4" /> Demo Credentials
                    </span>
                    <span className="text-xs text-sky-600">{credsOpen ? 'Hide' : 'Show'}</span>
                  </button>
                  {credsOpen && (
                    <div className="px-4 pb-4 space-y-2">
                      <p className="text-[11px] text-sky-800/80 leading-relaxed">
                        Prototype Demo Credentials — fictional accounts for demonstration. Passwords are shown only in this demo panel.
                      </p>
                      {demoAccounts.map((a) => {
                        const Icon = ROLE_ICONS[a.role]
                        return (
                          <div key={a.mahaId} className="rounded-xl bg-white border border-sky-100 px-3 py-2.5 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold text-slate-800 truncate">{a.name} <span className="text-slate-400 font-normal">· {a.role.replace('_', ' ')}</span></div>
                              <div className="text-[11px] text-slate-500 font-mono truncate">{a.mahaId} · {a.password}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => useDemo(a.mahaId, a.password)}
                              className="shrink-0 rounded-lg bg-primary-900 text-white text-[11px] font-semibold px-2.5 py-1.5 hover:bg-primary-800"
                            >
                              Use Demo Account
                            </button>
                          </div>
                        )
                      })}
                      <p className="text-[10px] text-sky-700/70 pt-1">"Use Demo Account" fills the form — you still complete OTP verification.</p>
                    </div>
                  )}
                </div>
              </form>
            )}

            {phase === 'verifying' && (
              <div className="py-10 text-center">
                <Loader2 className="w-10 h-10 text-primary-700 animate-spin mx-auto" />
                <h2 className="font-semibold text-slate-900 mt-5">Creating your session…</h2>
                <p className="text-sm text-slate-400 mt-1.5">Redirecting to your dashboard (simulated)</p>
              </div>
            )}

            {phase === 'otp' && (
              <form onSubmit={doVerify}>
                <button type="button" onClick={() => { cancelLogin(); setPhase('credentials'); setOtp(''); setErr('') }} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4">
                  <ArrowLeft className="w-4 h-4" /> Change Maha ID
                </button>
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary-700" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Verify Your Identity</h1>
                <p className="text-sm text-slate-500 mt-1.5">
                  We've simulated an OTP sent to your registered mobile number <strong>{pendingAcct?.maskedMobile ?? maskMobile('') }</strong>.
                </p>

                {/* Demo OTP indicator — fresh OTP every attempt */}
                {challenge && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 flex items-center gap-3">
                    <KeyRound className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-emerald-800/80">Demo OTP (prototype only — never shown in production)</div>
                      <div className="font-mono font-bold text-emerald-900 text-lg tracking-[0.3em]">{challenge.otp}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setOtp(challenge.otp) }}
                      className="shrink-0 rounded-lg border border-emerald-300 text-emerald-800 text-xs font-semibold px-2.5 py-1.5 hover:bg-emerald-100 inline-flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Use
                    </button>
                  </div>
                )}

                <div className="mt-5">
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full text-center text-2xl tracking-[0.6em] font-semibold rounded-xl border border-slate-300 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    inputMode="numeric" autoFocus aria-label="Enter 6 digit OTP" placeholder="••••••"
                  />
                </div>
                {err && <p className="text-sm text-rose-600 mt-3" role="alert">{err}</p>}

                <button type="submit" className="w-full mt-5 rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800">
                  Verify OTP
                </button>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{challenge && challenge.resendIn > 0 ? <>Resend available in <span className="font-semibold text-slate-600">{challenge.resendIn}s</span></> : (
                    <button type="button" onClick={() => { resendOtp(); setOtp(''); setErr('') }} className="text-primary-700 font-semibold hover:text-primary-900">Resend OTP</button>
                  )}</span>
                  <span>{challenge?.attemptsLeft} attempt{challenge?.attemptsLeft === 1 ? '' : 's'} left · expires 5 min</span>
                </div>
              </form>
            )}
          </Card>

          <div className="mt-5 text-center text-xs text-slate-400">
            Protected by a simulated identity layer · <Lock className="inline w-3 h-3" /> No real credentials involved
          </div>
        </div>
      </div>
    </div>
  )
}

/* Safe accessor used before pendingUser is typed as possibly undefined */
function pendingMahaIdSafe(id: string | undefined): string {
  return id ?? ''
}
