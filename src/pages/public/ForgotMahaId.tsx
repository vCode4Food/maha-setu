import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, IdCard, Copy, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { Card, Field, inputCls } from '@/components/ui/primitives'
import { useAuth } from '@/context/AuthContext'

export default function ForgotMahaId() {
  const { requestMahaIdRecovery, verifyMahaIdRecoveryOtp, recoveredMahaId, challenge } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [err, setErr] = useState('')
  const [stage, setStage] = useState<'identify' | 'otp' | 'done'>('identify')

  const submitIdentify = (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const res = requestMahaIdRecovery(identifier)
    if (!res.ok) { setErr(res.message ?? 'Account not found'); return }
    setStage('otp')
  }

  const submitOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const res = verifyMahaIdRecoveryOtp(otp)
    if (!res.ok) { setErr(res.message ?? 'Invalid OTP'); return }
    setStage('done')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-canvas">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo to="/" /></div>
        <Card className="p-6 sm:p-8 shadow-pop">
          {stage === 'identify' && (
            <form onSubmit={submitIdentify}>
              <h1 className="text-2xl font-bold text-slate-900">Forgot Maha ID?</h1>
              <p className="text-sm text-slate-500 mt-1.5">Verify your registered mobile or email to recover it.</p>
              <div className="mt-6 space-y-4">
                <Field label="Registered mobile or email" required>
                  <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputCls} placeholder="98XXXXXXXX or you@example.in" />
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
              <p className="text-sm text-slate-500 mt-1.5">Simulated OTP sent for verification.</p>
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

          {stage === 'done' && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto"><ShieldCheck className="w-7 h-7 text-emerald-600" /></div>
              <h1 className="text-2xl font-bold text-slate-900 mt-4">Your Maha ID has been recovered successfully.</h1>
              <p className="text-sm text-slate-500 mt-1.5">Verified via simulated OTP challenge.</p>
              <div className="mt-6 rounded-2xl border-2 border-primary-200 bg-primary-50/50 p-5">
                <div className="text-[11px] uppercase tracking-wide text-primary-700 font-semibold flex items-center justify-center gap-1.5"><IdCard className="w-3.5 h-3.5" /> Recovered Maha ID</div>
                <div className="font-mono font-bold text-2xl text-primary-900 mt-2">{recoveredMahaId}</div>
                <CopyButton value={recoveredMahaId ?? ''} />
              </div>
              <Link to="/login" className="mt-6 block w-full rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800">Continue to Login</Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { try { navigator.clipboard?.writeText(value) } catch { /* noop */ } setCopied(true); window.setTimeout(() => setCopied(false), 1600) }}
      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-primary-300 text-primary-800 text-xs font-semibold px-3 py-1.5 hover:bg-primary-100"
    >
      {copied ? <><CheckCircle2 className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Maha ID</>}
    </button>
  )
}
