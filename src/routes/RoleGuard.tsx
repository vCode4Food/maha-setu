import { Link, Outlet, useLocation } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';
import { dashboardPathForRole } from '../data/personas';
import { t } from '../utils/i18n';

export function RoleGuard({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const { authUser, language } = useApp();
  const location = useLocation();
  if (authUser && allowedRoles.includes(authUser.role)) return <Outlet />;
  return <div className="access-denied container"><LockKeyhole size={34} /><h1>{t('rbac.restricted.title', language)}</h1><p>{t('rbac.restricted.body', language)}</p>{authUser && <Link className="btn btn-primary" to={dashboardPathForRole(authUser.role)}>{t('rbac.restricted.return', language)}</Link>}<span className="sr-only">{location.pathname}</span></div>;
}
