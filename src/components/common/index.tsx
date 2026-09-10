import { Link } from 'react-router-dom';
import type { CSSProperties, ReactNode, ButtonHTMLAttributes } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'accent';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
}

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const { language } = useApp();
  return (
    <span className={`badge status-${status}`}>
      {label || t(`status.${status}`, language)}
    </span>
  );
}

interface CardProps {
  children: ReactNode;
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export function Card({ children, interactive = false, className = '', style, onClick }: CardProps) {
  return (
    <div
      className={`card ${interactive ? 'card-interactive' : ''} ${className}`}
      style={style}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick?.();
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; to: string };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{description}</p>
      {action && (
        <Link to={action.to}>
          <Button variant="primary">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}

interface InfoBoxProps {
  variant?: 'info' | 'success' | 'warning';
  children: ReactNode;
}

export function InfoBox({ variant = 'info', children }: InfoBoxProps) {
  return <div className={`info-box info-box-${variant}`}>{children}</div>;
}

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  const { language } = useApp();
  return (
    <div className="progress-steps" role="list" aria-label={t('applications.progress', language)}>
      {steps.map((step, index) => (
        <div key={step} style={{ display: 'contents' }}>
          <div
            className={`progress-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            role="listitem"
          >
            <div className="progress-step-circle">
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className="progress-step-label">{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`progress-step-line ${index < currentStep ? 'completed' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}

interface StatCardProps {
  value: number | string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
