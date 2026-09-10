import { CircleHelp, BookOpen, Phone } from 'lucide-react';
import { Card } from '../../components/common';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

export function HelpPage() {
  const { language } = useApp();
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{t('help.title', language)}</h1>
        <p className="page-subtitle">{t('help.subtitle', language)}</p>
      </div>

      <div className="help-grid">
        <Card className="help-card">
          <div className="help-icon"><CircleHelp size={22} /></div>
          <h3 className="card-title">{t('help.faq', language)}</h3>
          <p className="card-description">{t('help.faqBody', language)}</p>
        </Card>
        <Card className="help-card">
          <div className="help-icon"><Phone size={22} /></div>
          <h3 className="card-title">{t('help.contact', language)}</h3>
          <p className="card-description">{t('help.contactBody', language)}</p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-secondary)', marginTop: 'var(--space-3)' }}>
            1800-XXX-XXXX (Toll free)
          </p>
        </Card>
        <Card className="help-card">
          <div className="help-icon"><BookOpen size={22} /></div>
          <h3 className="card-title">{t('help.guide', language)}</h3>
          <p className="card-description">{t('help.guideBody', language)}</p>
        </Card>
      </div>

      <Card style={{ marginTop: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-5)', color: 'var(--color-primary)' }}>
          {t('help.faqTitle', language)}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {['one', 'two', 'three', 'four'].map((id) => (
            <div key={id}>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                {t(`faq.${id}.q`, language)}
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {t(`faq.${id}.a`, language)}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function AboutPage() {
  const { language } = useApp();
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{t('about.title', language)}</h1>
        <p className="page-subtitle">{t('hero.title', language)}</p>
      </div>

      <Card style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>
          {t('about.vision', language)}
        </h2>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
          {t('about.body', language)}
        </p>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          {t('about.guidance', language)}
        </p>
      </Card>

      <div className="grid-2">
        <Card>
          <h3 className="card-title">{t('about.card1.title', language)}</h3>
          <p className="card-description">
            {t('about.card1.body', language)}
          </p>
        </Card>
        <Card>
          <h3 className="card-title">{t('about.card2.title', language)}</h3>
          <p className="card-description">
            {t('about.card2.body', language)}
          </p>
        </Card>
        <Card>
          <h3 className="card-title">{t('about.card3.title', language)}</h3>
          <p className="card-description">
            {t('about.card3.body', language)}
          </p>
        </Card>
        <Card>
          <h3 className="card-title">{t('about.card4.title', language)}</h3>
          <p className="card-description">
            {t('about.card4.body', language)}
          </p>
        </Card>
      </div>
    </div>
  );
}
