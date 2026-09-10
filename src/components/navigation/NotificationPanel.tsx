import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { localizeNotification, t } from '../../utils/i18n';
import { formatDate } from '../../services/dataService';

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, language, readNotification, readAllNotifications } = useApp();

  const handleClick = (id: string) => {
    readNotification(id);
  };

  return (
    <div className="notification-panel" role="dialog" aria-label={t('nav.notifications', language)}>
      <div className="notification-panel-header">
        <span className="notification-panel-title">{t('nav.notifications', language)}</span>
        <button className="btn btn-ghost btn-sm" onClick={readAllNotifications}>
          {t('notifications.markAllRead', language)}
        </button>
      </div>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
            <p className="empty-state-text">{t('notifications.empty', language)}</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const localized = localizeNotification(notif, language);
            return (
            <Link
              key={notif.id}
              to={notif.link || '#'}
              className={`notification-item ${!notif.read ? 'unread' : ''}`}
              onClick={() => {
                handleClick(notif.id);
                onClose();
              }}
            >
              <div className="notification-item-title">{localized.title}</div>
              <div className="notification-item-message">{localized.message}</div>
              <div className="notification-item-time">{formatDate(notif.createdAt, language)}</div>
            </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
