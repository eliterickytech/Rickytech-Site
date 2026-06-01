import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Categories from '../pages/Categories/Categories';
import Banks from '../pages/Banks/Banks';
import Incomes from '../pages/Incomes/Incomes';
import Expenses from '../pages/Expenses/Expenses';
import Investments from '../pages/Investments/Investments';
import Projections from '../pages/Projections/Projections';
import BinanceIntegration from '../pages/Integrations/Binance/BinanceIntegration';
import OpenFinanceIntegration from '../pages/Integrations/OpenFinance/OpenFinanceIntegration';
import News from '../pages/News/News';
import Settings from '../pages/Settings/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/bancos" element={<Banks />} />
        <Route path="/receitas" element={<Incomes />} />
        <Route path="/despesas" element={<Expenses />} />
        <Route path="/investimentos" element={<Investments />} />
        <Route path="/projecoes" element={<Projections />} />
        <Route path="/integracoes/binance" element={<BinanceIntegration />} />
        <Route path="/integracoes/openfinance" element={<OpenFinanceIntegration />} />
        <Route path="/noticias" element={<News />} />
        <Route path="/configuracoes" element={<Settings />} />
      </Route>
    </Routes>
  );
}
