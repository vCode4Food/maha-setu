import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, UserRound, Building2, Crown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { demoPersonas, dashboardPathForRole } from '../../data/personas';
import { t } from '../../utils/i18n';
import type { AuthMethod } from '../../types';

const icons = { USER: UserRound, DEPARTMENT_OFFICER: Building2, ADMIN: Crown };

export function PersonaSelectionPage() {
  const { language, isAuthenticated, authUser, login } = useApp();
  const location = useLocation(); const navigate = useNavigate();
  const state = location.state as { method?: AuthMethod; from?: string } | null;
  if (isAuthenticated && authUser) return <Navigate to={dashboardPathForRole(authUser.role)} replace />;
  if (!state?.method) return <Navigate to="/login" replace />;
  return <section className="persona-page container"><Link className="auth-back" to="/login"><ArrowLeft size={16} /> {t('auth.backToLogin', language)}</Link><div className="persona-heading"><span><ShieldCheck size={20} /></span><p className="landing-eyebrow">{t('persona.eyebrow', language)}</p><h1>{t('persona.title', language)}</h1><p>{t('persona.body', language)}</p></div><div className="persona-grid">{demoPersonas.map((persona) => { const Icon = icons[persona.role]; return <article className="persona-card" key={persona.id}><span className="persona-icon"><Icon size={25} /></span><span className="persona-role">{t(persona.titleKey, language)}</span><h2>{persona.name}</h2><p className="persona-meta">{persona.department ?? persona.district}</p><ul>{persona.accessKeys.map((key) => <li key={key}>{t(key, language)}</li>)}</ul><button className="btn btn-primary btn-block" onClick={() => { login(persona.id, state.method!); navigate(state.from || dashboardPathForRole(persona.role), { replace: true }); }}>{t('persona.continue', language)}</button></article>; })}</div></section>;
}
