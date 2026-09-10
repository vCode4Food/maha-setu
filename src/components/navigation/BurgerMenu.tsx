import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, User, LifeBuoy, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

interface BurgerMenuProps {
  open: boolean;
  onToggle: () => void;
}

export function BurgerMenu({ open, onToggle }: BurgerMenuProps) {
  const { language } = useApp();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onToggle();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onToggle]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`burger-fab ${open ? 'burger-fab-open' : ''}`}
        onClick={onToggle}
        aria-label={open ? t('common.closeMenu', language) : t('common.openMenu', language)}
        aria-expanded={open}
      >
        <span className="burger-fab-icon">
          <span className="burger-line burger-line-1" />
          <span className="burger-line burger-line-2" />
          <span className="burger-line burger-line-3" />
        </span>
      </button>

      <div
        className={`burger-backdrop ${open ? 'is-open' : ''}`}
        onClick={onToggle}
        aria-hidden="true"
      />
      <nav className={`burger-panel ${open ? 'is-open' : ''}`} aria-label={t('nav.services', language)} aria-hidden={!open}>
        <div className="burger-panel-inner">
          <div className="burger-panel-section">
            <span className="burger-panel-label">{t('nav.services', language)}</span>
            <Link to="/education" className="burger-panel-link burger-stagger-1" onClick={onToggle}>
              <span className="burger-link-icon burger-icon-education">
                <GraduationCap size={20} strokeWidth={1.6} />
              </span>
              <span>{t('nav.education', language)}</span>
            </Link>
            <Link to="/employability" className="burger-panel-link burger-stagger-2" onClick={onToggle}>
              <span className="burger-link-icon burger-icon-employability">
                <Briefcase size={20} strokeWidth={1.6} />
              </span>
              <span>{t('nav.employability', language)}</span>
            </Link>
          </div>

          <div className="burger-panel-divider" />

          <div className="burger-panel-section">
            <Link to="/profile" className="burger-panel-link burger-stagger-3" onClick={onToggle}>
              <span className="burger-link-icon"><User size={18} strokeWidth={1.6} /></span>
              <span>{t('nav.profile', language)}</span>
            </Link>
            <Link to="/help" className="burger-panel-link burger-stagger-4" onClick={onToggle}>
              <span className="burger-link-icon"><LifeBuoy size={18} strokeWidth={1.6} /></span>
              <span>{t('nav.help', language)}</span>
            </Link>
            <Link to="/about" className="burger-panel-link burger-stagger-5" onClick={onToggle}>
              <span className="burger-link-icon"><Info size={18} strokeWidth={1.6} /></span>
              <span>{t('nav.about', language)}</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
