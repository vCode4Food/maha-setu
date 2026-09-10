import { useParams, Link, Navigate } from 'react-router-dom';
import { ClipboardCheck, CircleCheck } from 'lucide-react';
import { getServiceById } from '../../services/dataService';
import { Card, Badge, Button, InfoBox } from '../../components/common';
import { useApp } from '../../context/AppContext';
import { localizeService, t } from '../../utils/i18n';

export function ServiceDetailsPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { language } = useApp();
  const rawService = serviceId ? getServiceById(serviceId) : undefined;
  const service = rawService ? localizeService(rawService, language) : undefined;

  if (!service) {
    return <Navigate to="/search" replace />;
  }

  return (
    <div className="container">
      <div className="service-detail-grid">
        <div className="service-detail-main">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <Badge variant="primary">{service.category}</Badge>
          </div>
          <h1>{service.title}</h1>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {service.description}
          </p>

          <div className="service-detail-section">
            <h2>{t('service.whoCanApply', language)}</h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {service.whoCanApply}
            </p>
          </div>

          <div className="service-detail-section">
            <h2>{t('service.eligibility', language)}</h2>
            <ul className="service-detail-list">
              {service.eligibility.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="service-detail-section">
            <h2>{t('service.benefits', language)}</h2>
            <ul className="service-detail-list">
              {service.benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="service-detail-section">
            <h2>{t('service.documentsRequired', language)}</h2>
            <ul className="service-detail-list">
              {service.documents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="service-detail-section">
            <h2>{t('service.applicationProcess', language)}</h2>
            <ul className="service-detail-list">
              {service.process.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {service.importantInfo && (
            <InfoBox variant="info">
              <strong>{t('service.important', language)}</strong> {service.importantInfo}
            </InfoBox>
          )}
        </div>

        <aside className="service-detail-sidebar">
          <Card>
            <div className="service-meta-item">
              <span className="service-meta-label">{t('service.estimatedTime', language)}</span>
              <span className="service-meta-value">{service.estimatedTime}</span>
            </div>
            <div className="service-meta-item">
              <span className="service-meta-label">{t('service.documentsRequired', language)}</span>
              <span className="service-meta-value">{t('service.documentsCount', language, { count: service.documents.length })}</span>
            </div>
            <div className="service-meta-item">
              <span className="service-meta-label">{t('service.category', language)}</span>
              <span className="service-meta-value">{service.category}</span>
            </div>

            <div className="service-detail-cta">
              <Link to={`/services/${service.id}/eligibility`}>
                <Button variant="primary" block size="lg">
                  <CircleCheck size={16} /> {t('service.checkEligibility', language)}
                </Button>
              </Link>
              <Link to={`/services/${service.id}/apply`}>
                <Button variant="secondary" block size="lg">
                  <ClipboardCheck size={16} /> {t('service.startApplication', language)}
                </Button>
              </Link>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
