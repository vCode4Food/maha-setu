import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

const links = [
  { href: '/#services', key: 'landing.nav.services' },
  { href: '/#explore', key: 'landing.nav.explore' },
  { href: '/#news', key: 'landing.nav.news' },
  { href: '/about', key: 'nav.about' },
];

export function PublicHeader() {
  const { language, isAuthenticated } = useApp();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="public-header">
      <div className="public-header-inner">
        <BrandLogo to="/" size="sm" />
        <nav className="public-nav" aria-label={t('landing.nav.label', language)}>
          <Link to="/">{t('nav.home', language)}</Link>
          {links.map((link) => <a href={link.href} key={link.href}>{t(link.key, language)}</a>)}
        </nav>
        <div className="public-actions">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated ? (
            <Link className="btn btn-primary btn-sm" to="/dashboard">{t('landing.dashboard', language)}</Link>
          ) : (
            <>
              <Link className="public-login-link" to="/login">{t('nav.login', language)}</Link>
              <Link className="btn btn-primary btn-sm public-cta" to="/login">{t('landing.getStarted', language)}</Link>
            </>
          )}
          <button type="button" className="public-menu-toggle" aria-label={t(open ? 'common.closeMenu' : 'common.openMenu', language)} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="public-mobile-menu">
          <nav aria-label={t('landing.nav.label', language)}>
            <Link to="/" onClick={() => setOpen(false)}>{t('nav.home', language)}</Link>
            {links.map((link) => <a href={link.href} key={link.href} onClick={() => setOpen(false)}>{t(link.key, language)}</a>)}
            <Link to={isAuthenticated ? '/dashboard' : '/login'} onClick={() => setOpen(false)}>{t(isAuthenticated ? 'landing.dashboard' : 'landing.getStarted', language)}</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  const { language } = useApp();
  return (
    <footer className="public-footer">
      <div className="container public-footer-grid">
        <div>
          <BrandLogo to="/" size="sm" />
          <p>{t('landing.footer.tagline', language)}</p>
          <span className="public-prototype-label">{t('landing.prototype', language)}</span>
        </div>
        <div>
          <h2>{t('footer.quick', language)}</h2>
          <a href="/#services">{t('landing.nav.services', language)}</a>
          <a href="/#explore">{t('landing.nav.explore', language)}</a>
          <a href="/#news">{t('landing.nav.news', language)}</a>
          <Link to="/about">{t('nav.about', language)}</Link>
        </div>
        <div>
          <h2>{t('landing.footer.account', language)}</h2>
          <Link to="/login">{t('auth.mahaId', language)}</Link>
          <Link to="/login">{t('auth.aadhaar', language)}</Link>
          <Link to="/help">{t('nav.help', language)}</Link>
        </div>
        <div>
          <h2>{t('footer.legal', language)}</h2>
          <Link to="/help">{t('footer.privacy', language)}</Link>
          <Link to="/help">{t('footer.terms', language)}</Link>
          <Link to="/help">{t('footer.accessibility', language)}</Link>
        </div>
      </div>
      <div className="public-footer-bottom">{t('footer.copyright', language)}</div>
    </footer>
  );
}
