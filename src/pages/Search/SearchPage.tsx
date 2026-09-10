import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Briefcase, GraduationCap, HelpCircle, Newspaper, Search as SearchIcon } from 'lucide-react';
import { SearchBar } from '../../components/search/SearchBar';
import { EmptyState } from '../../components/common';
import { searchAll, type UnifiedSearchKind } from '../../services/dataService';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

const kindIcon: Record<UnifiedSearchKind, typeof SearchIcon> = {
  service: SearchIcon,
  department: GraduationCap,
  update: Newspaper,
  help: HelpCircle,
};

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { language } = useApp();

  const results = useMemo(() => searchAll(query, language), [query, language]);

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{t('search.title', language)}</h1>
        <p className="page-subtitle">
          {t('search.subtitle', language)}
        </p>
      </div>

      <div className="search-page-bar">
        <SearchBar initialQuery={query} autoFocus large />
      </div>

      {query ? (
        results.length > 0 ? (
          <>
            <p className="search-results-count animate-fade-in">
              {t('search.resultCount', language, { count: results.length, plural: results.length !== 1 ? 's' : '', query })}
            </p>
            <div className="search-results-list">
              {results.map((item) => {
                const Icon = item.kind === 'department' && item.id === 'employability' ? Briefcase : kindIcon[item.kind];
                return (
                  <Link key={`${item.kind}-${item.id}`} to={item.to} className="search-result-row">
                    <span className="search-result-icon">
                      <Icon size={18} strokeWidth={1.7} />
                    </span>
                    <span>
                      <span className="search-result-kind">{t(`search.kind.${item.kind}`, language)}</span>
                      <strong className="card-title" style={{ display: 'block', marginBottom: 4 }}>{item.title}</strong>
                      <span className="card-description">{item.description}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <EmptyState
            title={t('search.noResults', language)}
            description={t('search.try', language)}
            action={{ label: t('search.browseEducation', language), to: '/education' }}
          />
        )
      ) : (
        <div className="search-empty-hints">
          <p className="page-subtitle">{t('search.start', language)}</p>
          <div className="search-example-list">
            {['search.examples.scholarship', 'search.examples.job', 'search.examples.skill', 'nav.help'].map((example) => (
              <Link
                key={example}
                to={`/search?q=${encodeURIComponent(t(example, language))}`}
                className="search-example-chip"
              >
                {t(example, language)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
