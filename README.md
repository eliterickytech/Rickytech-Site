# Finance Control - Frontend

Frontend do **Finance Control**, construído em **React + TypeScript + Vite**,
seguindo à risca o template **Color Admin** do SeanThemes
([https://seantheme.com/color-admin/](https://seantheme.com/color-admin/)).

## Stack

- React 18 + TypeScript + Vite
- React Router v6
- Redux Toolkit
- React Hook Form + Yup
- Bootstrap 5 + React-Bootstrap (base do Color Admin)
- ApexCharts / Chart.js (gráficos do dashboard)
- i18next (PT-BR / EN-US)

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

O dev server sobe em `http://localhost:3000` e faz proxy de `/api`
para `https://localhost:5001` (backend .NET 10).

## Color Admin

O template oficial ainda **não** está incluído neste commit
(é entregue zipado pelo SeanThemes / ThemeForest após a compra).
No Sprint 9, os arquivos `.scss`, `.html` e imagens serão copiados para
`src/theme/color-admin/` e o entrypoint `src/assets/scss/app.scss` será
atualizado para importá-los.

## Estrutura de pastas

```
src/
├── assets/           # css, scss, imagens, fontes
├── components/       # layout (Sidebar/Header/Footer), common, widgets, charts
├── pages/            # uma pasta por feature
├── routes/           # AppRoutes
├── services/api/     # cliente HTTP (axios)
├── hooks/            # hooks reutilizáveis
├── store/            # Redux Toolkit slices
├── theme/color-admin # tema visual (Sprint 9)
├── locales/          # i18n
└── utils/
```
