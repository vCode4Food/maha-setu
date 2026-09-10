import { useEffect, useRef, useState } from 'react';
import { Languages } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { languageLabels } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import type { Language } from '../../types';

export function LanguageSwitcher() {
  const { language, setLanguage } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const options: Language[] = ['en', 'mr', 'hi'];

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        type="button"
        className="header-icon-btn lang-switcher-btn"
        aria-label={t('language.select', language)}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Languages size={18} strokeWidth={1.75} aria-hidden="true" />
        <span className="lang-switcher-code">{language.toUpperCase()}</span>
      </button>
      {open && (
        <ul className="lang-switcher-menu" role="listbox" aria-label={t('language.list', language)}>
          {options.map((lang) => (
            <li key={lang}>
              <button
                type="button"
                role="option"
                aria-selected={language === lang}
                className={`lang-switcher-option ${language === lang ? 'active' : ''}`}
                onClick={() => {
                  setLanguage(lang);
                  setOpen(false);
                }}
              >
                {languageLabels[lang]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
