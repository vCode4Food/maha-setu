import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Bell,
  LogOut,
  Menu,
  User,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { ThemeToggle } from '../theme/ThemeToggle';
import { NotificationPanel } from './NotificationPanel';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';
import { BrandLogo } from '../common/BrandLogo';
import { dashboardPathForRole } from '../../data/personas';

interface HeaderProps {
  activePath?: string;
  onMenuToggle?: () => void;
}

export function Header({
  activePath = '/',
  onMenuToggle,
}: HeaderProps) {
  const { profile, language, unreadCount, authUser } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return activePath === '/';
    }

    return (
      activePath === path ||
      activePath.startsWith(`${path}/`)
    );
  };

  const citizenLinks = [
    {
      to: '/dashboard',
      label: t('nav.home', language),
    },
    {
      to: '/search',
      label: t('nav.search', language),
    },
    {
      to: '/applications',
      label: t('nav.applications', language),
    },
    {
      to: '/documents',
      label: t('nav.documents', language),
    },
  ];

  const officerLinks = [
    {
      to: '/department',
      label: t('rbac.nav.overview', language),
    },
    {
      to: '/department#requests',
      label: t('rbac.nav.requests', language),
    },
    {
      to: '/department#reports',
      label: t('rbac.nav.reports', language),
    },
  ];

  const adminLinks = [
    {
      to: '/admin',
      label: t('rbac.nav.platform', language),
    },
    {
      to: '/admin#users',
      label: t('rbac.nav.users', language),
    },
    {
      to: '/admin#departments',
      label: t('rbac.nav.departments', language),
    },
  ];

  const navLinks =
    authUser?.role === 'DEPARTMENT_OFFICER'
      ? officerLinks
      : authUser?.role === 'ADMIN'
        ? adminLinks
        : citizenLinks;

  const initials = authUser
    ? authUser.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
    : `${profile.firstName[0]}${profile.lastName[0]}`;

  const dashboardPath = authUser
    ? dashboardPathForRole(authUser.role)
    : '/dashboard';

  const handleProfileClick = () => {
    if (authUser?.role === 'USER') {
      navigate('/profile');
    } else {
      navigate(dashboardPath);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mahasetu_mock_authenticated');
    localStorage.removeItem('mahasetu_mock_session');
    window.location.replace('/');
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* Brand */}
        <BrandLogo to={dashboardPath} size="sm" />

        {/* Navigation */}
        <nav
          className="header-nav"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`header-nav-link ${
                isActive(link.to) ? 'active' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <LanguageSwitcher />

          {/* Notifications */}
          <div
            ref={notifRef}
            style={{ position: 'relative' }}
          >
            <button
              type="button"
              className="header-icon-btn"
              aria-label={t(
                'nav.notifications',
                language
              )}
              onClick={() =>
                setNotifOpen((open) => !open)
              }
            >
              <Bell
                size={18}
                strokeWidth={1.75}
              />

              {unreadCount > 0 && (
                <span className="header-badge">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <NotificationPanel
                onClose={() => setNotifOpen(false)}
              />
            )}
          </div>

          {/* Profile / Dashboard */}
          <button
            type="button"
            className="header-avatar"
            aria-label={
              authUser?.name ??
              t('nav.profile', language)
            }
            onClick={handleProfileClick}
          >
            <User
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
            />

            <span className="header-avatar-initials">
              {initials}
            </span>
          </button>

          <ThemeToggle />

          {/* Logout */}
          <button
            type="button"
            className="header-icon-btn header-logout-btn"
            aria-label={t('nav.logout', language)}
            title={t('nav.logout', language)}
            onClick={handleLogout}
          >
            <LogOut
              size={17}
              strokeWidth={1.75}
            />
          </button>

          {/* Mobile Menu */}
          {onMenuToggle && (
            <button
              type="button"
              className="header-icon-btn header-menu-btn"
              aria-label={t(
                'common.openMenu',
                language
              )}
              onClick={onMenuToggle}
            >
              <Menu
                size={18}
                strokeWidth={1.75}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { language, authUser } = useApp();

  const isCitizen = authUser?.role === 'USER';

  const dashboardPath = authUser
    ? dashboardPathForRole(authUser.role)
    : '/dashboard';

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Footer Brand */}
        <div className="footer-brand-block">
          <BrandLogo to="/" size="sm" />

          <p className="footer-tagline">
            {t('brand.tagline', language)}
          </p>
        </div>

        <div className="footer-columns">
          {/* Quick Links */}
          <div className="footer-col">
            <span className="footer-col-title">
              {t('footer.quick', language)}
            </span>

            {isCitizen ? (
              <>
                <Link
                  to="/search"
                  className="footer-link"
                >
                  {t('nav.services', language)}
                </Link>

                <Link
                  to="/education"
                  className="footer-link"
                >
                  {t('nav.education', language)}
                </Link>

                <Link
                  to="/employability"
                  className="footer-link"
                >
                  {t('nav.employability', language)}
                </Link>

                <Link
                  to="/applications"
                  className="footer-link"
                >
                  {t('nav.applications', language)}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={dashboardPath}
                  className="footer-link"
                >
                  {t(
                    'rbac.nav.overview',
                    language
                  )}
                </Link>

                <Link
                  to={dashboardPath}
                  className="footer-link"
                >
                  {t(
                    'rbac.nav.requests',
                    language
                  )}
                </Link>

                <Link
                  to={dashboardPath}
                  className="footer-link"
                >
                  {t(
                    'rbac.nav.reports',
                    language
                  )}
                </Link>
              </>
            )}
          </div>

          {/* Citizen / Support */}
          <div className="footer-col">
            <span className="footer-col-title">
              {t('footer.citizen', language)}
            </span>

            {isCitizen && (
              <>
                <Link
                  to="/documents"
                  className="footer-link"
                >
                  {t('nav.documents', language)}
                </Link>

                <Link
                  to="/updates"
                  className="footer-link"
                >
                  {t('updates.title', language)}
                </Link>
              </>
            )}

            <Link
              to="/help"
              className="footer-link"
            >
              {t('nav.help', language)}
            </Link>

            <Link
              to="/about"
              className="footer-link"
            >
              {t('nav.about', language)}
            </Link>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <span className="footer-col-title">
              {t('footer.legal', language)}
            </span>

            <Link
              to="/help"
              className="footer-link"
            >
              {t(
                'footer.accessibility',
                language
              )}
            </Link>

            <Link
              to="/help"
              className="footer-link"
            >
              {t('footer.privacy', language)}
            </Link>

            <Link
              to="/help"
              className="footer-link"
            >
              {t('footer.terms', language)}
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          {t('footer.copyright', language)}
        </span>
      </div>
    </footer>
  );
}