import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import Footer from './Footer/Footer';

/**
 * Layout principal inspirado no template Color Admin (SeanThemes):
 *   - Sidebar fixa à esquerda (dark)
 *   - Header dark com search/perfil/idioma/tema
 *   - Conteúdo central com padding e breadcrumb
 *   - Footer slim
 */
export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app" data-sidebar-open={sidebarOpen}>
      <Header onToggleSidebar={() => setSidebarOpen((o) => !o)} />
      <Sidebar open={sidebarOpen} />

      <main className="content">
        <div className="content-inner">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}
