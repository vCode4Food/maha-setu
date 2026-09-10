import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, Clock, FileText } from 'lucide-react';
import type { Service } from '../../types';
import { Card, Badge, Button } from '../common';
import { useApp } from '../../context/AppContext';
import { localizeService, t } from '../../utils/i18n';
import { departments } from '../../data/departments';

function ServiceIcon({ department }: { department: Service['department'] }) {
  if (department === 'education') return <GraduationCap size={18} strokeWidth={1.6} />;
  return <Briefcase size={18} strokeWidth={1.6} />;
}

interface ServiceCardProps {
  service: Service;
  showActions?: boolean;
  variant?: 'default' | 'rich';
  relevanceReason?: string;
}

export function ServiceCard({
  service,
  showActions = true,
  variant = 'default',
  relevanceReason,
}: ServiceCardProps) {
  const { language } = useApp();
  const localized = localizeService(service, language);
  const dept = departments.find((d) => d.id === service.department);

  if (variant === 'rich') {
    return (
      <Card className="service-card service-card-rich animate-fade-in">
        <div className="service-card-rich-header">
          <span className={`service-card-icon service-card-icon-${service.department}`}>
            <ServiceIcon department={service.department} />
          </span>
          <Badge variant="default">{dept?.name ?? localized.category}</Badge>
        </div>
        <h3 className="card-title">{localized.title}</h3>
        <p className="card-description">{localized.shortDescription}</p>
        <div className="service-card-eligibility">
          <span className="service-eligibility-dot" />
          {t('service.likelyEligible', language)}
        </div>
        <div className="service-card-detail">
          <div className="service-card-detail-item">
            <Clock size={14} />
            <span>{localized.estimatedTime}</span>
          </div>
        </div>
        {showActions && (
          <div className="service-card-actions">
            <Link to={`/services/${service.id}`}>
              <Button variant="primary" size="sm">
                {t('service.viewDetails', language)}
              </Button>
            </Link>
            <Link to={`/services/${service.id}/eligibility`}>
              <Button variant="secondary" size="sm">
                {t('service.checkEligibility', language)}
              </Button>
            </Link>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="service-card animate-fade-in">
      <div className="service-card-meta">
        <Badge variant="primary">{localized.category}</Badge>
        {service.popular && <Badge variant="accent">{t('hero.popular', language)}</Badge>}
      </div>
      <h3 className="card-title">{localized.title}</h3>
      <p className="card-description">{localized.shortDescription}</p>
      {relevanceReason && (
        <p className="service-relevance">{relevanceReason}</p>
      )}
      <div className="service-card-detail">
        <div className="service-card-detail-item">
          <Clock size={14} />
          <span>{localized.estimatedTime}</span>
        </div>
        <div className="service-card-detail-item">
          <FileText size={14} />
          <span>{t('service.documentsCount', language, { count: service.documents.length })}</span>
        </div>
      </div>
      {showActions && (
        <div className="service-card-actions">
          <Link to={`/services/${service.id}/eligibility`}>
            <Button variant="secondary" size="sm">
              {t('service.checkEligibility', language)}
            </Button>
          </Link>
          <Link to={`/services/${service.id}`}>
            <Button variant="primary" size="sm">
              {t('service.viewDetails', language)}
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}

interface ServiceListProps {
  services: Service[];
  showActions?: boolean;
  variant?: 'default' | 'rich';
  relevanceMap?: Record<string, string>;
}

export function ServiceList({
  services,
  showActions = true,
  variant = 'default',
  relevanceMap,
}: ServiceListProps) {
  if (services.length === 0) return null;

  return (
    <div className={variant === 'rich' ? 'service-cards-grid' : 'grid-3'}>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          showActions={showActions}
          variant={variant}
          relevanceReason={relevanceMap?.[service.id]}
        />
      ))}
    </div>
  );
}
