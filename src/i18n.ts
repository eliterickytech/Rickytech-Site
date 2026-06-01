import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from './locales/pt-BR/common.json';
import enUS from './locales/en-US/common.json';

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { common: ptBR },
    'en-US': { common: enUS },
  },
  lng: localStorage.getItem('fc.lang') || 'pt-BR',
  fallbackLng: 'pt-BR',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18n;
