import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MenuItem {
  key: string;
  labelKey: string;
  icon: string;
  to?: string;
  children?: MenuItem[];
}

const menu: MenuItem[] = [
  { key: 'dashboard', labelKey: 'menu.dashboard', icon: '📊', to: '/dashboard' },
  {
    key: 'registers', labelKey: 'menu.registers', icon: '📁',
    children: [
      { key: 'categories', labelKey: 'menu.categories', icon: '🏷', to: '/categorias' },
      { key: 'banks', labelKey: 'menu.banks', icon: '🏦', to: '/bancos' },
    ],
  },
  {
    key: 'movements', labelKey: 'menu.movements', icon: '↔',
    children: [
      { key: 'incomes', labelKey: 'menu.incomes', icon: '⬆', to: '/receitas' },
      { key: 'expenses', labelKey: 'menu.expenses', icon: '⬇', to: '/despesas' },
    ],
  },
  { key: 'investments', labelKey: 'menu.investments', icon: '📈', to: '/investimentos' },
  { key: 'projections', labelKey: 'menu.projections', icon: '🔮', to: '/projecoes' },
  {
    key: 'integrations', labelKey: 'menu.integrations', icon: '🔌',
    children: [
      { key: 'binance', labelKey: 'menu.binance', icon: '₿', to: '/integracoes/binance' },
      { key: 'openFinance', labelKey: 'menu.openFinance', icon: '🏛', to: '/integracoes/openfinance' },
    ],
  },
  { key: 'news', labelKey: 'menu.news', icon: '📰', to: '/noticias' },
  { key: 'settings', labelKey: 'menu.settings', icon: '⚙', to: '/configuracoes' },
];

export default function Sidebar({ open }: { open: boolean }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setExpanded((s) => ({ ...s, [key]: !s[key] }));

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : 'sidebar--closed'}`}>
      <div className="sidebar__brand">
        <span className="sidebar__brand-logo">💰</span>
        <span className="sidebar__brand-name">{t('app.name')}</span>
      </div>

      <nav className="sidebar__menu">
        {menu.map((item) => (
          <div key={item.key} className="sidebar__item">
            {item.to ? (
              <NavLink to={item.to} className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}>
                <span className="sidebar__icon">{item.icon}</span>
                <span className="sidebar__label">{t(item.labelKey)}</span>
              </NavLink>
            ) : (
              <>
                <button type="button" className="sidebar__link sidebar__link--parent" onClick={() => toggle(item.key)}>
                  <span className="sidebar__icon">{item.icon}</span>
                  <span className="sidebar__label">{t(item.labelKey)}</span>
                  <span className="sidebar__caret">{expanded[item.key] ? '−' : '+'}</span>
                </button>
                {expanded[item.key] && (
                  <div className="sidebar__submenu">
                    {item.children?.map((child) => (
                      <NavLink key={child.key} to={child.to ?? '#'}
                        className={({ isActive }) => `sidebar__link sidebar__link--child ${isActive ? 'is-active' : ''}`}>
                        <span className="sidebar__icon">{child.icon}</span>
                        <span className="sidebar__label">{t(child.labelKey)}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
