import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

interface BrandLogoProps {
  to?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  stacked?: boolean;
}

export function BrandLogo({ to = '/', size = 'md', showText = true, stacked = false }: BrandLogoProps) {
  const { language } = useApp();
  const px = size === 'sm' ? 36 : size === 'lg' ? 72 : 44;
  const content = (
    <span className={`brand-logo ${stacked ? 'brand-logo-stacked' : ''}`}>
      <img
        src="/mahasetu-logo.jpg"
        alt={showText ? '' : t('nav.home', language)}
        width={px}
        height={px}
        className="brand-logo-mark"
      />
      {showText && (
        <span className="brand-logo-text">
          <span className="brand-logo-name">MahaSetu</span>
          <span className="brand-logo-tagline">{t('brand.tagline', language)}</span>
        </span>
      )}
    </span>
  );

  if (to) {
    return (
      <Link to={to} className="header-logo" aria-label={`MahaSetu ${t('nav.home', language)}`}>
        {content}
      </Link>
    );
  }

  return content;
}
