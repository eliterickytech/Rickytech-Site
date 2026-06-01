import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../hooks/useTheme';

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useAppTheme();

  const switchLang = () => {
    const next = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR';
    i18n.changeLanguage(next);
    localStorage.setItem('fc.lang', next);
  };

  return (
    <header className="header">
      <button type="button" className="header__toggle" onClick={onToggleSidebar} aria-label="toggle menu">
        ☰
      </button>

      <div className="header__brand">{t('app.name')}</div>

      <div className="header__search">
        <input type="text" placeholder={t('actions.search') + '...'} />
      </div>

      <div className="header__actions">
        <button type="button" className="header__btn" onClick={switchLang} title="Idioma">
          {i18n.language === 'pt-BR' ? 'PT' : 'EN'}
        </button>
        <button type="button" className="header__btn" onClick={toggleTheme} title="Tema">
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
        <div className="header__profile">
          <span className="header__avatar">R</span>
          <span className="header__name">Ricardo</span>
        </div>
      </div>
    </header>
  );
}
