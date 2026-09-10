import { useApp } from '../../context/AppContext';
import { ApplicationCard } from '../../components/applications/ApplicationCard';
import { EmptyState } from '../../components/common';
import { t } from '../../utils/i18n';

export function ApplicationsPage() {
  const { applications, language } = useApp();

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{t('applications.title', language)}</h1>
        <p className="page-subtitle">
          {t('applications.subtitle', language)}
        </p>
      </div>

      {applications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('applications.empty', language)}
          description={t('applications.emptyBody', language)}
          action={{ label: t('search.title', language), to: '/search' }}
        />
      )}
    </div>
  );
}
