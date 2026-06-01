import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useTheme';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useAppTheme();

  const switchLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('fc.lang', lng);
  };

  return (
    <div>
      <h2>{t('menu.settings')}</h2>

      <div className="panel">
        <div className="panel__header">Aparência</div>
        <p>Tema atual: <strong>{theme}</strong></p>
        <button className="btn btn--primary" onClick={toggleTheme}>Alternar tema</button>
      </div>

      <div className="panel">
        <div className="panel__header">Idioma</div>
        <button className={`btn ${i18n.language === 'pt-BR' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => switchLang('pt-BR')}>PT-BR</button>
        {' '}
        <button className={`btn ${i18n.language === 'en-US' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => switchLang('en-US')}>EN-US</button>
      </div>

      <div className="panel">
        <div className="panel__header">Sobre</div>
        <p>Finance Control v1.0 - Rickytech 2026</p>
        <p>Backend: .NET 10 + Clean Architecture + CQRS</p>
        <p>Frontend: React 18 + TypeScript + Vite (layout Color Admin)</p>
      </div>
    </div>
  );
}
