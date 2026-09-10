import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import { useRef } from 'react';
import { newsItems } from '../../data/news';
import { useApp } from '../../context/AppContext';
import { localizeNews, t, localeByLanguage } from '../../utils/i18n';

export function GovernmentUpdates({ compact = false }: { compact?: boolean }) {
  const { language } = useApp();
  const scroller = useRef<HTMLDivElement>(null);
  const items = compact ? newsItems.slice(0, 6) : newsItems;

  const scroll = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <section className="updates-section" aria-labelledby="updates-heading">
      <div className="section-header">
        <div>
          <h2 id="updates-heading" className="section-title">
            {t('updates.title', language)}
          </h2>
          <p className="section-subtitle">{t('updates.disclaimer', language)}</p>
        </div>
        <div className="updates-controls">
          <button type="button" className="icon-btn" onClick={() => scroll(-1)} aria-label={t('updates.previous', language)}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="icon-btn" onClick={() => scroll(1)} aria-label={t('updates.next', language)}>
            <ChevronRight size={18} />
          </button>
          <Link to="/updates" className="section-link">
            {t('updates.viewAll', language)}
          </Link>
        </div>
      </div>

      <div className="updates-scroller" ref={scroller}>
        {items.map((item) => {
          const localized = localizeNews(item, language);
          return (
          <article key={item.id} className="update-card">
            <div className="update-card-image-wrap">
              <img src={item.image} alt={t(item.imageAlt, language)} className="update-card-image" loading="lazy" />
              <span className={`update-category update-category-${localized.category.replace(/\s+/g, '-').toLowerCase()}`}>
                {localized.category}
              </span>
            </div>
            <div className="update-card-body">
              <time className="update-date" dateTime={item.date}>
                {new Date(item.date).toLocaleDateString(localeByLanguage[language], { day: 'numeric', month: 'short', year: 'numeric' })}
              </time>
              <h3 className="update-title">{localized.title}</h3>
              <p className="update-excerpt">{localized.shortDescription}</p>
              <span className="update-source">{localized.source}</span>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}

export function UpdatesPageHeaderIcon() {
  return <Newspaper size={22} aria-hidden="true" />;
}
