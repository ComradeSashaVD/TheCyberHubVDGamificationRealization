---
name: Gamification MVP rollout
overview: "Поэтапно внедрить систему геймификации в этом репозитории через Next.js Route Handlers: сначала MVP (XP/уровни/базовые достижения/leaderboard), затем расширение до полного ТЗ и админ-управления."
todos:
  - id: contracts-and-types
    content: Спроектировать единые типы/enum/контракты API для XP, уровней, достижений и leaderboard
    status: completed
  - id: db-migrations-mvp
    content: Подготовить SQL-миграции и индексы для user_gamification, xp_history, achievements, user_achievements, leaderboard_snapshots
    status: completed
  - id: api-routes-mvp
    content: Реализовать Next Route Handlers для /gamification/me, /xp, /achievements, /leaderboard, /history, /streak с Zod и auth
    status: completed
  - id: ui-profile-leaderboard
    content: Добавить компоненты LevelProgress/StreakIndicator/GamificationTab и доработать страницы profile/user/leaderboard
    status: completed
  - id: integrations-modules
    content: Подключить начисление XP в CTF, forum, blog, mentorship потоках и настроить toast-уведомления
    status: completed
  - id: tests-hardening
    content: Добавить unit/integration/e2e тесты и выполнить оптимизацию/защиту от накрутки XP
    status: completed
  - id: phase2-full-scope
    content: "Расширить до полного ТЗ: 30+ достижений, админ-раздел геймификации, очереди перерасчета, аналитика"
    status: completed
isProject: false
---

# План внедрения геймификации (MVP -> Full)

## Контекст текущего проекта
- Фронтенд уже использует централизованный API-клиент в [E:/Job/Unik/TheCyberHub/src/lib/api.ts](E:/Job/Unik/TheCyberHub/src/lib/api.ts) и React Query-обёртки в [E:/Job/Unik/TheCyberHub/src/hooks/useApi.ts](E:/Job/Unik/TheCyberHub/src/hooks/useApi.ts).
- Есть частично готовые элементы геймификации: [E:/Job/Unik/TheCyberHub/src/components/ui/AchievementBadge.tsx](E:/Job/Unik/TheCyberHub/src/components/ui/AchievementBadge.tsx), [E:/Job/Unik/TheCyberHub/src/components/StreakWidget.tsx](E:/Job/Unik/TheCyberHub/src/components/StreakWidget.tsx), [E:/Job/Unik/TheCyberHub/src/hooks/queries/useLeaderboard.ts](E:/Job/Unik/TheCyberHub/src/hooks/queries/useLeaderboard.ts), [E:/Job/Unik/TheCyberHub/src/app/leaderboard/page.tsx](E:/Job/Unik/TheCyberHub/src/app/leaderboard/page.tsx).
- В `src/app/api` сейчас нет `route.ts`, поэтому серверная часть будет создана с нуля внутри Next App Router.

## Фаза 1: MVP (первый релиз)

### 1) Нормализация доменной модели и контрактов
- Добавить типы и константы:
  - [E:/Job/Unik/TheCyberHub/src/types/gamification.ts](E:/Job/Unik/TheCyberHub/src/types/gamification.ts)
  - [E:/Job/Unik/TheCyberHub/src/lib/gamification/constants.ts](E:/Job/Unik/TheCyberHub/src/lib/gamification/constants.ts)
  - [E:/Job/Unik/TheCyberHub/src/lib/gamification/xpCalculator.ts](E:/Job/Unik/TheCyberHub/src/lib/gamification/xpCalculator.ts)
- Зафиксировать единый формат ответов API (`{ success, data, error }`) и единые enum-источники XP.
- Выравнять endpoint-нейминг в [E:/Job/Unik/TheCyberHub/src/lib/constants/api-endpoints.ts](E:/Job/Unik/TheCyberHub/src/lib/constants/api-endpoints.ts), чтобы убрать дубли (`leaderboard`, `streak`, `daily-challenge`).

### 2) База данных и миграции (минимально необходимое)
- Создать SQL-миграции для таблиц MVP:
  - `user_gamification` (xp, level, streak, streak_last_updated)
  - `xp_history`
  - `achievements`
  - `user_achievements`
  - `leaderboard_snapshots`
- Добавить индексы на `user_id`, `created_at`, поля сортировки leaderboard.
- Подготовить seed базовых достижений (10-12 штук для MVP) из будущих 30+.

### 3) Route Handlers (MVP набор)
- Реализовать в `src/app/api/gamification/*`:
  - `/xp` (начисление XP + пересчёт уровня)
  - `/me` (текущие XP/уровень/streak)
  - `/achievements` (список достижений и прогресс)
  - `/leaderboard` (фильтры + пагинация)
  - `/history` (лента начислений XP)
  - `/streak` (обновление серии входов)
- Использовать Zod-схемы в стиле [E:/Job/Unik/TheCyberHub/src/lib/validations.ts](E:/Job/Unik/TheCyberHub/src/lib/validations.ts).
- Добавить серверные проверки auth/role (не только UI-гейтинг), опираясь на паттерны из [E:/Job/Unik/TheCyberHub/src/context/AuthContext.tsx](E:/Job/Unik/TheCyberHub/src/context/AuthContext.tsx).

### 4) Интеграция MVP с существующим UI
- Профиль:
  - расширить [E:/Job/Unik/TheCyberHub/src/app/profile/page.tsx](E:/Job/Unik/TheCyberHub/src/app/profile/page.tsx)
  - расширить [E:/Job/Unik/TheCyberHub/src/app/user/[username]/page.tsx](E:/Job/Unik/TheCyberHub/src/app/user/[username]/page.tsx)
  - добавить компоненты: `LevelProgress`, `StreakIndicator`, `GamificationTab`.
- Leaderboard:
  - доработать [E:/Job/Unik/TheCyberHub/src/app/leaderboard/page.tsx](E:/Job/Unik/TheCyberHub/src/app/leaderboard/page.tsx)
  - добавить `LeaderboardTable` с фильтрами (overall/ctf/forum/events + all-time/month/week), топ-100 + пагинация + позиция текущего пользователя.
- Toast/feedback:
  - использовать [E:/Job/Unik/TheCyberHub/src/context/ToastContext.tsx](E:/Job/Unik/TheCyberHub/src/context/ToastContext.tsx)
  - добавить `XpToast` и `LevelUpModal` с respect для reduce-motion/accessibility.

### 5) Интеграционные триггеры MVP
- CTF: начисление XP после успешного submit в [E:/Job/Unik/TheCyberHub/src/app/ctf/[slug]/page.tsx](E:/Job/Unik/TheCyberHub/src/app/ctf/[slug]/page.tsx).
- Форум: начисление за тему/решение в [E:/Job/Unik/TheCyberHub/src/app/forums/new/page.tsx](E:/Job/Unik/TheCyberHub/src/app/forums/new/page.tsx) и [E:/Job/Unik/TheCyberHub/src/app/forums/[id]/page.tsx](E:/Job/Unik/TheCyberHub/src/app/forums/[id]/page.tsx).
- Блог: начисление за публикацию/лайки через [E:/Job/Unik/TheCyberHub/src/components/blog/BlogActions.tsx](E:/Job/Unik/TheCyberHub/src/components/blog/BlogActions.tsx).
- Менторство: начисление при completion через [E:/Job/Unik/TheCyberHub/src/lib/mentorship/api.ts](E:/Job/Unik/TheCyberHub/src/lib/mentorship/api.ts).

## Фаза 2: Расширение до полного ТЗ
- Довести каталог достижений до 30+ (категории, редкости, многоуровневые цепочки).
- Добавить бонусные правила (first CTF of day, 5 подряд, daily login multiplier).
- Ввести middleware/службу проверки достижений после событий + очередь для массовых перерасчётов.
- Расширить `/admin` разделом геймификации: CRUD достижений, ручные корректировки XP, множители XP, аналитика.
- Добавить графики активности 30 дней и расширенную статистику профиля.

## Нефункциональные требования (встроить в обе фазы)
- Производительность: кэш + snapshot leaderboard; SLA загрузки leaderboard до 500ms.
- Безопасность: server-side валидация, rate limiting, защита от накрутки, строгий RBAC для admin-функций.
- Качество: unit-тесты для `xpCalculator`/achievement rules, интеграционные тесты API, e2e сценарии level-up/achievement unlock/leaderboard filters.

## Порядок внедрения (рекомендуемый)
1. Контракты/типы/константы + миграции.
2. MVP Route Handlers + валидация + auth.
3. UI профиля и leaderboard.
4. Интеграция триггеров CTF/форум/блог/менторство.
5. Тесты и стабилизация.
6. Расширение до full scope (админка, 30+ достижений, очереди, аналитика).