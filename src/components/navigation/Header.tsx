import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Bell, Menu, User } from 'lucide-react';
=======
import { Bell, LogOut, Menu, User } from 'lucide-react';
>>>>>>> 824b4f9 (Landing + RBAC)
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { ThemeToggle } from '../theme/ThemeToggle';
import { NotificationPanel } from './NotificationPanel';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';
import { BrandLogo } from '../common/BrandLogo';
<<<<<<< HEAD
=======
import { dashboardPathForRole } from '../../data/personas';
>>>>>>> 824b4f9 (Landing + RBAC)

interface HeaderProps {
  activePath?: string;
  onMenuToggle?: () => void;
}

export function Header({ activePath = '/', onMenuToggle }: HeaderProps) {
<<<<<<< HEAD
  const { profile, language, unreadCount } = useApp();
=======
  const { profile, language, unreadCount, authUser } = useApp();
>>>>>>> 824b4f9 (Landing + RBAC)
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return activePath === '/';
    return activePath === path || activePath.startsWith(`${path}/`);
  };

<<<<<<< HEAD
  const navLinks = [
    { to: '/', label: t('nav.home', language) },
=======
  const citizenLinks = [
    { to: '/dashboard', label: t('nav.home', language) },
>>>>>>> 824b4f9 (Landing + RBAC)
    { to: '/search', label: t('nav.search', language) },
    { to: '/applications', label: t('nav.applications', language) },
    { to: '/documents', label: t('nav.documents', language) },
  ];
<<<<<<< HEAD

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;
=======
  const officerLinks = [
    { to: '/department', label: t('rbac.nav.overview', language) },
    { to: '/department#requests', label: t('rbac.nav.requests', language) },
    { to: '/department#reports', label: t('rbac.nav.reports', language) },
  ];
  const adminLinks = [
    { to: '/admin', label: t('rbac.nav.platform', language) },
    { to: '/admin#users', label: t('rbac.nav.users', language) },
    { to: '/admin#departments', label: t('rbac.nav.departments', language) },
  ];
  const navLinks = authUser?.role === 'DEPARTMENT_OFFICER' ? officerLinks : authUser?.role === 'ADMIN' ? adminLinks : citizenLinks;

  const initials = authUser ? authUser.name.split(' ').map((part) => part[0]).slice(0, 2).join('') : `${profile.firstName[0]}${profile.lastName[0]}`;
  const dashboardPath = authUser ? dashboardPathForRole(authUser.role) : '/dashboard';
>>>>>>> 824b4f9 (Landing + RBAC)

  return (
    <header className="header">
      <div className="header-inner">
<<<<<<< HEAD
        <BrandLogo size="sm" />
=======
        <BrandLogo to={dashboardPath} size="sm" />
>>>>>>> 824b4f9 (Landing + RBAC)

        <nav className="header-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`header-nav-link ${isActive(link.to) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />

          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              className="header-icon-btn"
              aria-label={t('nav.notifications', language)}
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <Bell size={18} strokeWidth={1.75} />
              {unreadCount > 0 && (
                <span className="header-badge">{unreadCount}</span>
              )}
            </button>
            {notifOpen && (
              <NotificationPanel onClose={() => setNotifOpen(false)} />
            )}
          </div>

          <button
            className="header-avatar"
<<<<<<< HEAD
            aria-label={t('nav.profile', language)}
            onClick={() => navigate('/profile')}
=======
            aria-label={authUser?.name ?? t('nav.profile', language)}
            onClick={() => navigate(authUser?.role === 'USER' ? '/profile' : dashboardPath)}
>>>>>>> 824b4f9 (Landing + RBAC)
          >
            <User size={16} strokeWidth={1.75} aria-hidden="true" />
            <span className="header-avatar-initials">{initials}</span>
          </button>

          <ThemeToggle />

<<<<<<< HEAD
=======
          <button
            type="button"
            className="header-icon-btn header-logout-btn"
            aria-label={t('nav.logout', language)}
            title={t('nav.logout', language)}
            onClick={() => {
              // A hard route change prevents the protected-route redirect from
              // racing the state update, while leaving all demo content intact.
              localStorage.removeItem('mahasetu_mock_authenticated');
              localStorage.removeItem('mahasetu_mock_session');
              window.location.replace('/');
            }}
          >
            <LogOut size={17} strokeWidth={1.75} />
          </button>

>>>>>>> 824b4f9 (Landing + RBAC)
          {onMenuToggle && (
            <button
              type="button"
              className="header-icon-btn header-menu-btn"
              aria-label={t('common.openMenu', language)}
              onClick={onMenuToggle}
            >
              <Menu size={18} strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
<<<<<<< HEAD
  const { language } = useApp();
=======
  const { language, authUser } = useApp();
  const isCitizen = authUser?.role === 'USER';
  const dashboardPath = authUser ? dashboardPathForRole(authUser.role) : '/dashboard';
>>>>>>> 824b4f9 (Landing + RBAC)
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand-block">
<<<<<<< HEAD
          <BrandLogo to="/" size="sm" />
=======
          <BrandLogo to={dashboardPath} size="sm" />
>>>>>>> 824b4f9 (Landing + RBAC)
          <p className="footer-tagline">{t('brand.tagline', language)}</p>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <span className="footer-col-title">{t('footer.quick', language)}</span>
<<<<<<< HEAD
            <Link to="/search" className="footer-link">{t('nav.services', language)}</Link>
            <Link to="/education" className="footer-link">{t('nav.education', language)}</Link>
            <Link to="/employability" className="footer-link">{t('nav.employability', language)}</Link>
            <Link to="/applications" className="footer-link">{t('nav.applications', language)}</Link>
=======
            <Link to={dashboardPath} className="footer-link">{isCitizen ? t('nav.home', language) : t('rbac.nav.overview', language)}</Link>
            {isCitizen ? <><Link to="/search" className="footer-link">{t('nav.services', language)}</Link><Link to="/applications" className="footer-link">{t('nav.applications', language)}</Link></> : <><Link to={dashboardPath} className="footer-link">{t('rbac.nav.requests', language)}</Link><Link to={dashboardPath} className="footer-link">{t('rbac.nav.reports', language)}</Link></>}
>>>>>>> 824b4f9 (Landing + RBAC)
          </div>

          <div className="footer-col">
            <span className="footer-col-title">{t('footer.citizen', language)}</span>
<<<<<<< HEAD
            <Link to="/documents" className="footer-link">{t('nav.documents', language)}</Link>
            <Link to="/updates" className="footer-link">{t('updates.title', language)}</Link>
=======
            {isCitizen && <Link to="/documents" className="footer-link">{t('nav.documents', language)}</Link>}
            <Link to={isCitizen ? '/updates' : dashboardPath} className="footer-link">{isCitizen ? t('updates.title', language) : t('landing.prototype', language)}</Link>
>>>>>>> 824b4f9 (Landing + RBAC)
            <Link to="/help" className="footer-link">{t('nav.help', language)}</Link>
            <Link to="/about" className="footer-link">{t('nav.about', language)}</Link>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">{t('footer.legal', language)}</span>
            <Link to="/help" className="footer-link">{t('footer.accessibility', language)}</Link>
            <Link to="/help" className="footer-link">{t('footer.privacy', language)}</Link>
            <Link to="/help" className="footer-link">{t('footer.terms', language)}</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>{t('footer.copyright', language)}</span>
      </div>
    </footer>
  );
}
