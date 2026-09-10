import { Link } from 'react-router-dom';
import type { Application } from '../../types';
import { Card, StatusBadge } from '../common';
import { formatDate, getServiceById } from '../../services/dataService';
import { useApp } from '../../context/AppContext';
import { localizeApplication, t } from '../../utils/i18n';

const progressLabels = ['progress.submitted', 'progress.verified', 'progress.review', 'progress.decision'];

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { language } = useApp();
  const localized = localizeApplication(application, language, getServiceById(application.serviceId));
  const completedSteps = localized.timeline.filter((s) => s.completed).length;
  const currentIndex = localized.timeline.findIndex((s) => s.current);

  return (
    <Link to={`/applications/${application.id}`} style={{ textDecoration: 'none' }}>
      <Card interactive className="application-card-enhanced animate-fade-in">
        <div className="application-card-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
        </div>

        <div>
          <h3 className="card-title">{localized.serviceTitle}</h3>
          <p className="application-card-ref">{t('applications.ref', language, { reference: application.referenceNumber })}</p>
          {application.submittedAt && (
            <p className="card-description" style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-size-xs)' }}>
              {t('applications.submittedDate', language, { date: formatDate(application.submittedAt, language) })}
            </p>
          )}

          <div className="application-progress-bar">
            {localized.timeline.map((step) => (
              <div
                key={step.id}
                className={`application-progress-step ${step.completed ? 'done' : ''} ${step.current ? 'current' : ''}`}
                title={step.label}
              />
            ))}
          </div>
          <div className="application-progress-labels">
            {progressLabels.slice(0, application.timeline.length).map((label, i) => (
              <span key={i} style={{ fontWeight: i === currentIndex ? 600 : 400, color: i <= completedSteps - 1 ? 'var(--color-success)' : undefined }}>
                {t(label, language)}
              </span>
            ))}
          </div>
        </div>

        <StatusBadge status={application.status} />
      </Card>
    </Link>
  );
}

interface ApplicationTimelineProps {
  application: Application;
}

export function ApplicationTimeline({ application }: ApplicationTimelineProps) {
  const { language } = useApp();
  const localized = localizeApplication(application, language, getServiceById(application.serviceId));
  return (
    <div className="timeline" role="list" aria-label={t('applications.timelineLabel', language)}>
      {localized.timeline.map((step) => (
        <div
          key={step.id}
          className={`timeline-item ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
          role="listitem"
        >
          <div className="timeline-dot">
            {step.completed && '✓'}
          </div>
          <div className="timeline-label">{step.label}</div>
          {step.description && (
            <div className="timeline-description">{step.description}</div>
          )}
          {step.date && <div className="timeline-date">{step.date}</div>}
        </div>
      ))}
    </div>
  );
}
