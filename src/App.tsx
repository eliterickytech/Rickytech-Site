import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAppTheme } from './hooks/useTheme';
import './i18n';

export default function App() {
  const { theme } = useAppTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <AppRoutes />;
}
