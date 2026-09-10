import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { ThemeToggle } from '../theme/ThemeToggle';
import { NotificationPanel } from './NotificationPanel';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';
import { BrandLogo } from '../common/BrandLogo';

interface HeaderProps {
  activePath?: string;
  onMenuToggle?: () => void;
}

export function Header({ activePath = '/', onMenuToggle }: HeaderProps) {
  const { profile, language, unreadCount } = useApp();
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

  const navLinks = [
    { to: '/', label: t('nav.home', language) },
    { to: '/search', label: t('nav.search', language) },
    { to: '/applications', label: t('nav.applications', language) },
    { to: '/documents', label: t('nav.documents', language) },
  ];

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <header className="header">
      <div className="header-inner">
        <BrandLogo size="sm" />

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
            aria-label={t('nav.profile', language)}
            onClick={() => navigate('/profile')}
          >
            <User size={16} strokeWidth={1.75} aria-hidden="true" />
            <span className="header-avatar-initials">{initials}</span>
          </button>

          <ThemeToggle />

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
  const { language } = useApp();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand-block">
          <BrandLogo to="/" size="sm" />
          <p className="footer-tagline">{t('brand.tagline', language)}</p>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <span className="footer-col-title">{t('footer.quick', language)}</span>
            <Link to="/search" className="footer-link">{t('nav.services', language)}</Link>
            <Link to="/education" className="footer-link">{t('nav.education', language)}</Link>
            <Link to="/employability" className="footer-link">{t('nav.employability', language)}</Link>
            <Link to="/applications" className="footer-link">{t('nav.applications', language)}</Link>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">{t('footer.citizen', language)}</span>
            <Link to="/documents" className="footer-link">{t('nav.documents', language)}</Link>
            <Link to="/updates" className="footer-link">{t('updates.title', language)}</Link>
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
