import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Loader2, CheckCircle2, Copy, IdCard, ShieldCheck, KeyRound, PartyPopper, Home,
} from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { MahaSetuBrand } from '@/components/branding/MahaSetuBrand'
import { Card, Field, inputCls } from '@/components/ui/primitives'
import { useAuth } from '@/context/AuthContext'
import { passwordChecks, passwordStrength, maskMobile } from '@/utils/auth'

type Step = 1 | 2 | 3 | 4 | 5

const STATES = ['Maharashtra']
const DISTRICTS = ['Pune', 'Mumbai City', 'Nagpur', 'Nashik', 'Thane', 'Kolhapur', 'Amravati', 'Chhatrapati Sambhajinagar']

export default function Register() {
  const navigate = useNavigate()
  const { requestRegistrationOtp, verifyRegistrationOtp, completeRegistration, challenge } = useAuth()
  const [step, setStep] = useState<Step>(1)
  const [err, setErr] = useState('')

  // Step 1
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [state_] = useState(STATES[0])
  const [district, setDistrict] = useState(DISTRICTS[0])

  // Step 2
  const [otp, setOtp] = useState('')
  const [mobileVerified, setMobileVerified] = useState(false)

  // Step 3
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [showPw, setShowPw] = useState(false)

  // Step 4
  const [createdId, setCreatedId] = useState('')
  const [copied, setCopied] = useState(false)

  const strength = passwordStrength(pw)

  const submitBasic = (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!fullName.trim() || mobile.replace(/\D/g, '').length !== 10 || !email.includes('@') || !dob) {
      setErr('Fill all fields (10-digit mobile, valid email).')
      return
    }
    const res = requestRegistrationOtp(mobile)
    if (!res.ok) { setErr(res.message ?? 'Could not send OTP'); return }
    setStep(2)
  }

  const submitOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const res = verifyRegistrationOtp(otp)
    if (!res.ok) { setErr(res.message ?? 'Invalid OTP'); return }
    setMobileVerified(true)
    setStep(3)
  }

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!passwordChecks(pw).every((c) => c.ok)) { setErr('Password does not meet all requirements.'); return }
    if (pw !== pw2) { setErr('Passwords do not match.'); return }
    const { mahaId } = completeRegistration({ fullName, password: pw, mobile, email })
    setCreatedId(mahaId)
    setStep(4)
    window.setTimeout(() => setStep(5), 2200)
  }

  const copyId = () => {
    try { navigator.clipboard?.writeText(createdId) } catch { /* noop */ }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="relative hidden lg:block bg-primary-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-950/80 to-primary-900/40" />
        <div className="relative h-full flex flex-col justify-between p-10">
          <Logo light to="/" />
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight max-w-md">Create your Maha ID.</h2>
            <p className="text-white/60 mt-4 max-w-md">One registration — every Maharashtra government service, one vault, one timeline.</p>
            <div className="mt-8 space-y-2.5 max-w-md">
              {['Register', 'Verify with OTP', 'Create password', 'Get your Maha ID', 'Access services'].map((s, i) => (
                <div key={s} className="flex items-center gap-3 text-sm text-white/80">
                  <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${step > i + 1 ? 'bg-emerald-500' : 'bg-white/10'}`}>{i + 1}</span> {s}
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-white/40">Prototype — simulated registration. Never enter real Aadhaar numbers.</div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <MahaSetuBrand variant="compact" to="/" className="lg:hidden" />
            <Link to="/" className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-700">
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>
          <Card className="p-6 sm:p-8 shadow-pop">
            {step === 1 && (
              <form onSubmit={submitBasic}>
                <h1 className="text-2xl font-bold text-slate-900">Basic information</h1>
                <p className="text-sm text-slate-500 mt-1.5">Step 1 of 4 — your citizen record (demo data only).</p>
                <div className="mt-6 space-y-4">
                  <Field label="Full name" required><input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} placeholder="e.g. Aarav Sharma" /></Field>
                  <Field label="Mobile number" required><input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} className={inputCls} placeholder="10-digit mobile" inputMode="numeric" /></Field>
                  <Field label="Email address" required><input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.in" type="email" /></Field>
                  <Field label="Date of birth" required><input value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} type="date" /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="State"><input value={state_} readOnly className={`${inputCls} bg-slate-50`} /></Field>
                    <Field label="District">
                      <select value={district} onChange={(e) => setDistrict(e.target.value)} className={inputCls}>
                        {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                      </select>
                    </Field>
                  </div>
                  {err && <p className="text-sm text-rose-600" role="alert">{err}</p>}
                  <button type="submit" className="w-full rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800 inline-flex items-center justify-center gap-2">Send OTP & continue <ArrowRight className="w-4 h-4" /></button>
                  <div className="text-sm text-center text-slate-400">Already registered? <Link to="/login" className="text-primary-700 font-semibold">Login</Link></div>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={submitOtp}>
                <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4"><ArrowLeft className="w-4 h-4" /> Back</button>
                <h1 className="text-2xl font-bold text-slate-900">Verify your mobile</h1>
                <p className="text-sm text-slate-500 mt-1.5">Simulated OTP sent to <strong>{maskMobile(mobile)}</strong>.</p>
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

            {step === 3 && (
              <form onSubmit={submitPassword}>
                {mobileVerified && <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex items-center gap-2 text-sm text-emerald-800"><ShieldCheck className="w-4 h-4" /> Mobile verified · Identity check simulated</div>}
                <h1 className="text-2xl font-bold text-slate-900">Create your password</h1>
                <p className="text-sm text-slate-500 mt-1.5">Step 3 of 4 — secure your Maha ID.</p>
                <div className="mt-6 space-y-4">
                  <Field label="Password" required>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} className={`${inputCls} pr-10`} autoComplete="new-password" />
                      <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">{showPw ? 'Hide' : 'Show'}</button>
                    </div>
                  </Field>
                  <div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full ${strength.tone} transition-all`} style={{ width: `${strength.score}%` }} /></div>
                    <div className="text-xs text-slate-400 mt-1">{strength.label}</div>
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {passwordChecks(pw).map((c) => (
                        <div key={c.label} className={`text-[11px] flex items-center gap-1 ${c.ok ? 'text-emerald-600' : 'text-slate-400'}`}><CheckCircle2 className="w-3 h-3" /> {c.label}</div>
                      ))}
                    </div>
                  </div>
                  <Field label="Confirm password" required><input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={inputCls} autoComplete="new-password" /></Field>
                  {err && <p className="text-sm text-rose-600" role="alert">{err}</p>}
                  <button type="submit" className="w-full rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800 inline-flex items-center justify-center gap-2">Create my Maha ID <KeyRound className="w-4 h-4" /></button>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="py-10 text-center">
                <Loader2 className="w-10 h-10 text-primary-700 animate-spin mx-auto" />
                <h2 className="font-semibold text-slate-900 mt-5">Provisioning your Maha ID…</h2>
              </div>
            )}

            {step === 5 && (
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto"><PartyPopper className="w-7 h-7 text-emerald-600" /></div>
                <h1 className="text-2xl font-bold text-slate-900 mt-4">Your Maha ID has been created successfully.</h1>
                <p className="text-sm text-slate-500 mt-1.5">Welcome, {fullName}. Keep this ID safe — it is your single key to every service.</p>
                <div className="mt-6 rounded-2xl border-2 border-primary-200 bg-primary-50/50 p-5">
                  <div className="text-[11px] uppercase tracking-wide text-primary-700 font-semibold flex items-center justify-center gap-1.5"><IdCard className="w-3.5 h-3.5" /> Your Maha ID</div>
                  <div className="font-mono font-bold text-2xl text-primary-900 mt-2 tracking-wide">{createdId}</div>
                  <button onClick={copyId} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-primary-300 text-primary-800 text-xs font-semibold px-3 py-1.5 hover:bg-primary-100">
                    {copied ? <><CheckCircle2 className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Maha ID</>}
                  </button>
                </div>
                <div className="mt-5 rounded-xl bg-canvas border border-slate-200 p-4 text-left text-sm text-slate-600 space-y-1.5">
                  <div className="font-semibold text-slate-800">Registration summary</div>
                  <div>Name: {fullName}</div>
                  <div>Mobile: {maskMobile(mobile)}</div>
                  <div className="inline-flex items-center gap-1.5 text-emerald-700"><ShieldCheck className="w-4 h-4" /> Mock verification: Passed</div>
                </div>
                <button onClick={() => navigate('/login')} className="mt-6 w-full rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800">Continue to Login</button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
