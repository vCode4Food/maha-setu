/* Simulated auth utilities — frontend-only. Never use for production auth. */

export const IDLE_TIMEOUT_MS = 20 * 60 * 1000 // 20 minutes idle expiry
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8-hour absolute session
export const OTP_TTL_MS = 5 * 60 * 1000 // OTP valid 5 minutes
export const OTP_MAX_ATTEMPTS = 3

/** Cryptographically random 6-digit OTP where supported. */
export function generateOtp(): string {
  const buf = new Uint32Array(1)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buf)
    return String(buf[0] % 1000000).padStart(6, '0')
  }
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function newSessionId(): string {
  const buf = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(buf)
  else for (let i = 0; i < 16; i++) buf[i] = Math.floor(Math.random() * 256)
  return Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export interface PasswordCheck { ok: boolean; label: string }

export function passwordChecks(pw: string): PasswordCheck[] {
  return [
    { ok: pw.length >= 8, label: 'At least 8 characters' },
    { ok: /[A-Z]/.test(pw), label: 'One uppercase letter' },
    { ok: /[a-z]/.test(pw), label: 'One lowercase letter' },
    { ok: /\d/.test(pw), label: 'One number' },
    { ok: /[^A-Za-z0-9]/.test(pw), label: 'One special character' },
  ]
}

export function isPasswordValid(pw: string): boolean {
  return passwordChecks(pw).every((c) => c.ok)
}

export function passwordStrength(pw: string): { score: number; label: string; tone: string } {
  const passed = passwordChecks(pw).filter((c) => c.ok).length
  if (!pw) return { score: 0, label: 'Enter a password', tone: 'bg-slate-200' }
  if (passed <= 2) return { score: 33, label: 'Weak', tone: 'bg-rose-500' }
  if (passed <= 4) return { score: 66, label: 'Good', tone: 'bg-amber-500' }
  return { score: 100, label: 'Strong', tone: 'bg-emerald-500' }
}

/** "98XXXXXX42" style masking from a full 10-digit mobile. */
export function maskMobile(mobile: string): string {
  const digits = mobile.replace(/\D/g, '').slice(-10)
  if (digits.length !== 10) return '+91 98XXXXXX42'
  return `+91 ${digits.slice(0, 2)}XXXXXX${digits.slice(8)}`
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split('@')
  if (!name || !domain) return 'demo@example.com'
  return `${name.slice(0, 2)}${'x'.repeat(Math.max(2, name.length - 2))}@${domain}`
}

export function isValidMahaId(id: string): boolean {
  return /^MS-[A-Z]{3}-\d{4}(-\d{5})?$/.test(id.trim())
}

/** Generate the next citizen Maha ID: MS-CIT-2026-10024 */
export function nextCitizenMahaId(existing: string[]): string {
  const nums = existing
    .map((id) => /MS-CIT-\d{4}-(\d{5})/.exec(id)?.[1])
    .filter(Boolean)
    .map(Number)
  const next = (nums.length ? Math.max(...nums) : 10023) + 1
  return `MS-CIT-2026-${next}`
}
