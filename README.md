# School LMS — Frontend (client)

SPA школьной LMS-платформы. React 18 + TypeScript (strict) + Vite + Redux Toolkit (RTK Query) + React Hook Form + Zod + CSS Modules.

## Стек

| Слой | Технология |
|---|---|
| Сборка | Vite 7 |
| UI | React 18, React Router DOM v7 |
| Состояние/API | Redux Toolkit, RTK Query (кеширование, мутации, теги) |
| Формы | React Hook Form + Zod (схемы-зеркала бэкенда) |
| Стили | CSS Modules + Design Tokens (`src/app/styles/tokens/*`) |
| Тесты | Jest + React Testing Library |

## Архитектура

Строгий Feature-Sliced Design (`app / pages / widgets / features / entities / shared`).

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173 (proxy /api -> :5001)
npm test           # Jest + RTL
npm run test:watch # watch-режим
npm run lint       # ESLint
npm run build      # tsc -b && vite build
```

## Мок-режим (MSW)

Фронтенд умеет работать без бэкенда. В dev (import.meta.env.DEV) моки
включаются автоматически, если сервер недоступен. В production авто-переход
на моки невозможен: при недоступном бэкенде отображается обычный error-стейт
RTK Query (`error.status === 'FETCH_ERROR'`).

| `VITE_USE_MOCKS` | Поведение |
|---|---|
| не задано (auto) | health-check `/api/auth/check`; сервер недоступен → моки (только в dev) |
| `true` | моки всегда |
| `off` | только реальный сервер (по умолчанию, см. `.env.example`) |

```bash
cp .env.example .env   # затем при желании: VITE_USE_MOCKS=true npm run dev
VITE_USE_MOCKS=true npm run dev
```

При активных моках в левом нижнем углу появляется dev-тулбар
«🧪 Mock API» — мгновенное переключение ролей ADMIN / TEACHER / STUDENT
(без пароля). Демо-данные и хендлеры лежат в `src/mocks/`.

## Доступы (дефолт из `server/admin.json`)

- Админ: `qwe.edfffff@school.local` / `PjhNSSVhplOyvm6`

## RBAC и доступ

- `RequireAuth` — без токена редирект на `/login`.
- `RequireRole` — при чужой роли показывается модалка «❌ Нет доступа» (без редиректа).
- Глобальный перехватчик в `shared/api/baseApi.ts`: 401 → logout,
  403 → модалка «Нет доступа к данному ресурсу».

## Endpoint, ожидаемый на бэкенде

`GET /api/results/test/:testId` — попытки по тесту для таблицы результатов учителя
(см. комментарий в `src/entities/attempt/api/attemptApi.ts`).
