import { useState, type ReactNode } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

function RecoveryShell({ children }: { children: ReactNode }) { const { language } = useApp(); return <section className="auth-page"><div className="auth-card recovery-card"><Link className="auth-back" to="/login"><ArrowLeft size={16} /> {t('auth.backToLogin', language)}</Link><BrandLogo to="/" size="sm" stacked />{children}</div></section>; }

export function ForgotPasswordPage() {
  const { language } = useApp(); const [mobile, setMobile] = useState(''); const [error, setError] = useState(''); const navigate = useNavigate();
  return <RecoveryShell><div className="auth-intro"><p className="landing-eyebrow">{t('recovery.eyebrow', language)}</p><h1>{t('recovery.forgot.title', language)}</h1><p>{t('recovery.forgot.body', language)}</p></div><label className="form-label auth-field">{t('auth.mobile.label', language)}<span className="auth-mobile-input"><b>+91</b><input value={mobile} inputMode="numeric" maxLength={10} onChange={(event) => setMobile(event.target.value.replace(/\D/g, ''))} placeholder={t('auth.mobile.placeholder', language)} /></span></label>{error && <p className="auth-error" role="alert">{error}</p>}<button className="btn btn-primary btn-block" onClick={() => /^\d{10}$/.test(mobile) ? navigate('/verify-otp', { state: { mobile } }) : setError(t('auth.mobile.error', language))}>{t('recovery.sendOtp', language)}</button></RecoveryShell>;
}

export function VerifyOtpPage() {
  const { language } = useApp(); const location = useLocation(); const navigate = useNavigate(); const [otp, setOtp] = useState(''); const [error, setError] = useState(''); const mobile = (location.state as { mobile?: string } | null)?.mobile;
  if (!mobile) return <Navigate to="/forgot-password" replace />;
  return <RecoveryShell><div className="auth-intro"><p className="landing-eyebrow">{t('recovery.eyebrow', language)}</p><h1>{t('recovery.otp.title', language)}</h1><p>{t('recovery.otp.body', language, { mobile: `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}` })}</p></div><p className="otp-demo"><ShieldCheck size={16} /> {t('recovery.otp.demo', language)}</p><input className="otp-input" value={otp} inputMode="numeric" maxLength={6} aria-label={t('recovery.otp.label', language)} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, '')); setError(''); }} placeholder="123456" />{error && <p className="auth-error" role="alert">{error}</p>}<button className="btn btn-primary btn-block" onClick={() => otp === '123456' ? navigate('/reset-password') : setError(t('recovery.otp.error', language))}>{t('recovery.verify', language)}</button></RecoveryShell>;
}

export function ResetPasswordPage() {
  const { language } = useApp(); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [success, setSuccess] = useState(false); const [error, setError] = useState('');
  return <RecoveryShell>{success ? <div className="auth-intro reset-success"><CheckCircle2 size={38} /><h1>{t('recovery.success.title', language)}</h1><p>{t('recovery.success.body', language)}</p><Link className="btn btn-primary btn-block" to="/login">{t('recovery.backLogin', language)}</Link></div> : <><div className="auth-intro"><p className="landing-eyebrow">{t('recovery.eyebrow', language)}</p><h1>{t('recovery.reset.title', language)}</h1><p>{t('recovery.reset.body', language)}</p></div><label className="form-label auth-field">{t('recovery.reset.password', language)}<input className="form-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><label className="form-label auth-field">{t('recovery.reset.confirm', language)}<input className="form-input" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label>{error && <p className="auth-error" role="alert">{error}</p>}<button className="btn btn-primary btn-block" onClick={() => password.length >= 6 && password === confirm ? setSuccess(true) : setError(t('recovery.reset.error', language))}>{t('recovery.reset.submit', language)}</button></>}</RecoveryShell>;
}
