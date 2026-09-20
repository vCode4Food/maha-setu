import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { Card, Field, inputCls } from '@/components/ui/primitives'
import { useAuth } from '@/context/AuthContext'
import { passwordChecks, passwordStrength, isValidMahaId } from '@/utils/auth'

export default function ForgotPassword() {
  const { requestPasswordReset, verifyPasswordResetOtp, resetPassword, resetVerified, challenge } = useAuth()
  const [mahaId, setMahaId] = useState('')
  const [otp, setOtp] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [err, setErr] = useState('')
  const [stage, setStage] = useState<'identify' | 'otp' | 'reset' | 'done'>('identify')
  const strength = passwordStrength(pw)

  const submitIdentify = (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!isValidMahaId(mahaId)) { setErr('Enter a valid Maha ID (e.g. MS-CIT-1001).'); return }
    const res = requestPasswordReset(mahaId)
    if (!res.ok) { setErr(res.message ?? 'Account not found'); return }
    setStage('otp')
  }

  const submitOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const res = verifyPasswordResetOtp(otp)
    if (!res.ok) { setErr(res.message ?? 'Invalid OTP'); return }
    setStage('reset')
  }

  const submitReset = (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!passwordChecks(pw).every((c) => c.ok)) { setErr('Password does not meet all requirements.'); return }
    if (pw !== pw2) { setErr('Passwords do not match.'); return }
    const res = resetPassword(pw)
    if (!res.ok) { setErr(res.message ?? 'Could not reset password'); return }
    setStage('done')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-canvas">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo to="/" /></div>
        <Card className="p-6 sm:p-8 shadow-pop">
          {stage === 'identify' && (
            <form onSubmit={submitIdentify}>
              <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
              <p className="text-sm text-slate-500 mt-1.5">Enter your Maha ID to receive a verification OTP.</p>
              <div className="mt-6 space-y-4">
                <Field label="Maha ID" required>
                  <input value={mahaId} onChange={(e) => setMahaId(e.target.value.toUpperCase())} className={inputCls} placeholder="MS-CIT-1001" />
                </Field>
                {err && <p className="text-sm text-rose-600" role="alert">{err}</p>}
                <button type="submit" className="w-full rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800">Send verification OTP</button>
                <div className="text-sm text-center"><Link to="/login" className="text-slate-400 hover:text-primary-700">Back to login</Link></div>
              </div>
            </form>
          )}

          {stage === 'otp' && (
            <form onSubmit={submitOtp}>
              <button type="button" onClick={() => setStage('identify')} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4"><ArrowLeft className="w-4 h-4" /> Back</button>
              <h1 className="text-2xl font-bold text-slate-900">Verify your identity</h1>
              <p className="text-sm text-slate-500 mt-1.5">Simulated OTP sent for <span className="font-mono">{mahaId}</span>.</p>
              {challenge && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                  <div className="text-[11px] text-emerald-800/80">Demo OTP (prototype only)</div>
                  <div className="font-mono font-bold text-emerald-900 text-lg tracking-[0.3em]">{challenge.otp}</div>
                </div>
              )}
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="mt-5 w-full text-center text-2xl tracking-[0.6em] font-semibold rounded-xl border border-slate-300 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                inputMode="numeric" autoFocus aria-label="Enter 6 digit OTP" placeholder="••••••"
              />
              {err && <p className="text-sm text-rose-600 mt-3" role="alert">{err}</p>}
              <button type="submit" className="w-full mt-5 rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800">Verify OTP</button>
            </form>
          )}

          {stage === 'reset' && resetVerified && (
            <form onSubmit={submitReset}>
              <h1 className="text-2xl font-bold text-slate-900">Create a new password</h1>
              <p className="text-sm text-slate-500 mt-1.5">Your new password will replace the old one for this demo account.</p>
              <div className="mt-6 space-y-4">
                <Field label="New password" required><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} autoComplete="new-password" /></Field>
                <div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full ${strength.tone} transition-all`} style={{ width: `${strength.score}%` }} /></div>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {passwordChecks(pw).map((c) => (
                      <div key={c.label} className={`text-[11px] flex items-center gap-1 ${c.ok ? 'text-emerald-600' : 'text-slate-400'}`}><CheckCircle2 className="w-3 h-3" /> {c.label}</div>
                    ))}
                  </div>
                </div>
                <Field label="Confirm new password" required><input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={inputCls} autoComplete="new-password" /></Field>
                {err && <p className="text-sm text-rose-600" role="alert">{err}</p>}
                <button type="submit" className="w-full rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800">Update password & return to login</button>
              </div>
            </form>
          )}

          {stage === 'done' && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto"><ShieldCheck className="w-7 h-7 text-emerald-600" /></div>
              <h1 className="text-2xl font-bold text-slate-900 mt-4">Password updated</h1>
              <p className="text-sm text-slate-500 mt-1.5">Your new password is active for this demo account. Use it to log in.</p>
              <Link to="/login" className="mt-6 block w-full rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800"><Lock className="inline w-4 h-4 mr-1.5 -mt-0.5" />Continue to Login</Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
