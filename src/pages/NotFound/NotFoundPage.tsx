import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { Button } from '../../components/common';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

export function NotFoundPage() {
  const { language } = useApp();
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <BrandLogo to="/" size="md" stacked />
        <div className="not-found-visual" aria-hidden="true">
          <svg viewBox="0 0 280 140" className="not-found-svg">
            <path d="M20 88 C70 88, 90 52, 140 70" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
            <path d="M148 74 C190 92, 220 88, 260 88" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" opacity="0.5" />
            <circle cx="70" cy="70" r="8" fill="#0F6F73" />
            <circle cx="140" cy="70" r="10" fill="#0B2745" />
            <circle cx="210" cy="86" r="8" fill="#D79A22" />
            <path d="M128 54 L152 86" stroke="#b91c1c" strokeWidth="3" opacity="0.7" />
            <path d="M152 54 L128 86" stroke="#b91c1c" strokeWidth="3" opacity="0.7" />
          </svg>
        </div>
        <h1 className="page-title">{t('notFound.title', language)}</h1>
        <p className="page-subtitle">
          {t('notFound.body', language)}
        </p>
        <div className="not-found-actions">
          <Link to="/">
            <Button variant="primary">
              <ArrowLeft size={16} /> {t('notFound.home', language)}
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="secondary">
              <Compass size={16} /> {t('hero.explore', language)}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
