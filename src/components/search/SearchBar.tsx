import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

const rotatingPromptKeys = ['search.examples.scholarship', 'search.examples.job', 'search.examples.skill', 'search.examples.eligibility'];

interface SearchBarProps {
  initialQuery?: string;
  autoFocus?: boolean;
  large?: boolean;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  initialQuery = '',
  autoFocus = false,
  large = false,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [promptIndex, setPromptIndex] = useState(0);
  const [promptVisible, setPromptVisible] = useState(true);
  const navigate = useNavigate();
  const { language } = useApp();

  useEffect(() => {
    if (!large || query) return;
    const interval = setInterval(() => {
      setPromptVisible(false);
      setTimeout(() => {
        setPromptIndex((i) => (i + 1) % rotatingPromptKeys.length);
        setPromptVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, [large, query]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      if (onSearch) {
        onSearch(q);
      } else {
        navigate(`/search?q=${encodeURIComponent(q)}`);
      }
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const showRotating = large && !query;

  return (
    <div className={large ? 'hero-search' : ''}>
      <form onSubmit={handleSubmit} className="search-box" role="search">
        <Search className="search-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
        <input
          type="search"
          className={`search-input ${showRotating ? 'has-rotating' : ''}`}
          placeholder={showRotating ? '' : t('hero.searchPlaceholder', language)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          aria-label={t('hero.searchPlaceholder', language)}
        />
        {showRotating && (
          <span
            className="search-rotating-hint"
            style={{ opacity: promptVisible ? 1 : 0 }}
            aria-hidden="true"
          >
            {t(rotatingPromptKeys[promptIndex], language)}
          </span>
        )}
      </form>
      {large && (
        <div className="search-suggestions">
          <span className="search-suggestions-label">
            {t('hero.popular', language)}:
          </span>
          {['search.examples.scholarship', 'search.examples.job', 'search.examples.skill', 'search.examples.eligibility'].map((key) => (
            <button
              key={key}
              type="button"
              className="search-suggestion"
              onClick={() => handleSuggestion(t(key, language))}
            >
              {t(key, language)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
