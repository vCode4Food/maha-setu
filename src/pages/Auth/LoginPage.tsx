import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Fingerprint, ShieldCheck, UserRound } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import type { AuthMethod } from '../../types';

export function LoginPage() {
  const { language, isAuthenticated, authUser } = useApp();
  const [method, setMethod] = useState<AuthMethod | null>(null);
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  if (isAuthenticated && authUser) return <Navigate to={authUser.role === 'USER' ? '/dashboard' : authUser.role === 'ADMIN' ? '/admin' : '/department'} replace />;

  const continueToPersonas = () => {
    if (!method) return;
    if (method === 'MAHA_ID' && !/^\d{10}$/.test(mobile)) { setError(t('auth.mobile.error', language)); return; }
    navigate('/role-selection', { state: { method, from: (location.state as { from?: { pathname?: string } } | null)?.from?.pathname } });
  };
  return <section className="auth-page"><div className="auth-card"><Link className="auth-back" to="/"><ArrowLeft size={16} /> {t('auth.back', language)}</Link><BrandLogo to="/" size="md" stacked /><div className="auth-intro"><p className="landing-eyebrow">{t('auth.eyebrow', language)}</p><h1>{t('auth.title', language)}</h1><p>{t('auth.body', language)}</p></div><div className="auth-options"><button type="button" className={`auth-option ${method === 'MAHA_ID' ? 'selected' : ''}`} onClick={() => { setMethod('MAHA_ID'); setError(''); }}><UserRound size={22} /><span><strong>{t('auth.mahaId', language)}</strong><small>{t('auth.mahaId.body', language)}</small></span></button><button type="button" className={`auth-option ${method === 'AADHAAR' ? 'selected' : ''}`} onClick={() => { setMethod('AADHAAR'); setError(''); }}><Fingerprint size={23} /><span><strong>{t('auth.aadhaar', language)}</strong><small>{t('auth.aadhaar.body', language)}</small></span></button></div>{method && <div className="auth-demo-panel"><div><ShieldCheck size={19} /><strong>{t('auth.demo.title', language)}</strong></div>{method === 'MAHA_ID' ? <label className="form-label auth-field">{t('auth.mobile.label', language)}<span className="auth-mobile-input"><b>+91</b><input value={mobile} inputMode="numeric" maxLength={10} onChange={(event) => setMobile(event.target.value.replace(/\D/g, ''))} placeholder={t('auth.mobile.placeholder', language)} aria-invalid={Boolean(error)} /></span></label> : <p>{t('auth.aadhaar.notice', language)}</p>}{error && <p className="auth-error" role="alert">{error}</p>}<button type="button" className="btn btn-primary btn-block" onClick={continueToPersonas}>{t('auth.continueDemo', language)}</button></div>}<Link className="auth-forgot" to="/forgot-password">{t('auth.forgot', language)}</Link><p className="auth-safety-note">{t('auth.safety', language)}</p></div></section>;
}
