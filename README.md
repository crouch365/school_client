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

Фронтенд умеет работать без бэкенда — включится автоматически, если сервер недоступен.

| `VITE_USE_MOCKS` | Поведение |
|---|---|
| не задано (auto) | health-check `/api/auth/check`; сервер недоступен → включаются моки |
| `true` | моки всегда |
| `off` | только реальный сервер |

```bash
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
