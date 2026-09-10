import { Link } from 'react-router-dom';
import { GovernmentUpdates } from '../../components/home/GovernmentUpdates';
import { newsItems } from '../../data/news';
import { useApp } from '../../context/AppContext';
import { localizeNews, t, localeByLanguage } from '../../utils/i18n';

export function UpdatesPage() {
  const { language } = useApp();
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{t('updates.title', language)}</h1>
        <p className="page-subtitle">{t('updates.disclaimer', language)}</p>
      </div>
      <GovernmentUpdates />
      <div className="updates-full-list">
        {newsItems.map((item) => {
          const localized = localizeNews(item, language);
          return (
          <article key={item.id} className="update-list-item">
            <span className="update-category">{localized.category}</span>
            <div>
              <h2 className="update-title">{localized.title}</h2>
              <p className="update-excerpt">{localized.shortDescription}</p>
              <p className="update-source">
                {localized.source} · {new Date(item.date).toLocaleDateString(localeByLanguage[language], { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </article>
          );
        })}
      </div>
      <p className="page-subtitle" style={{ marginTop: 'var(--space-8)' }}>
        {t('updates.findService', language)} <Link to="/search">{t('updates.search', language)}</Link>
      </p>
    </div>
  );
}
