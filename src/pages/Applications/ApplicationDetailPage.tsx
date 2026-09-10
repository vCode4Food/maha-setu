import { useParams, Link, Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ApplicationTimeline } from '../../components/applications/ApplicationCard';
import { Card, StatusBadge, Button } from '../../components/common';
import { formatDate, getServiceById } from '../../services/dataService';
import { localizeApplication, t } from '../../utils/i18n';

export function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { applications, language } = useApp();
  const application = applicationId
    ? applications.find((a) => a.id === applicationId)
    : undefined;

  if (!application) {
    return <Navigate to="/applications" replace />;
  }
  const localized = localizeApplication(application, language, getServiceById(application.serviceId));

  return (
    <div className="container">
      <div className="page-header">
        <Link to="/applications" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)', display: 'inline-block' }}>
          ← {t('applications.back', language)}
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div>
            <h1 className="page-title">{localized.serviceTitle}</h1>
            <p className="page-subtitle">{t('applications.reference', language, { reference: application.referenceNumber })}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </div>

      <div className="service-detail-grid">
        <Card>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-6)', color: 'var(--color-primary)' }}>
            {t('applications.timeline', language)}
          </h2>
          <ApplicationTimeline application={localized} />
        </Card>

        <aside>
          <Card>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>
              {t('applications.details', language)}
            </h3>
            <div className="service-meta-item">
              <span className="service-meta-label">{t('applications.status', language)}</span>
              <span className="service-meta-value">
                <StatusBadge status={application.status} />
              </span>
            </div>
            {application.submittedAt && (
              <div className="service-meta-item">
                <span className="service-meta-label">{t('applications.submitted', language)}</span>
                <span className="service-meta-value">{formatDate(application.submittedAt, language)}</span>
              </div>
            )}
            <div className="service-meta-item">
              <span className="service-meta-label">{t('applications.lastUpdated', language)}</span>
              <span className="service-meta-value">{formatDate(application.updatedAt, language)}</span>
            </div>
            <div className="service-meta-item">
              <span className="service-meta-label">{t('applications.referenceLabel', language)}</span>
              <span className="service-meta-value">{application.referenceNumber}</span>
            </div>

            {application.progress !== undefined && (
              <div style={{ marginTop: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)' }}>
                  <span>{t('applications.progress', language)}</span>
                  <span>{application.progress}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--color-border-light)', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${application.progress}%`,
                      background: 'var(--color-secondary)',
                      borderRadius: 3,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginTop: 'var(--space-6)' }}>
              <Link to="/help">
                <Button variant="secondary" block>
                  {t('applications.needHelp', language)}
                </Button>
              </Link>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
