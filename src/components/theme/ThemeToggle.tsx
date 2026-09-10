import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useApp();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={t(theme === 'light' ? 'theme.dark' : 'theme.light', language)}
      title={t(theme === 'light' ? 'theme.dark' : 'theme.light', language)}
    >
      {theme === 'light' ? <Moon size={18} strokeWidth={1.75} /> : <Sun size={18} strokeWidth={1.75} />}
    </button>
  );
}
