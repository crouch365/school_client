/** Форматирует длительность в секундах в человекочитаемый вид. */
export const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—';

  const totalMinutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  if (totalMinutes === 0) return `${restSeconds} сек`;
  if (restSeconds === 0) return `${totalMinutes} мин`;
  return `${totalMinutes} мин ${restSeconds} сек`;
};

/** Форматирует дату/время в русской локали. */
export const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return '—';
  }
};

/** Человекочитаемая роль пользователя. */
export const formatRole = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'Администратор';
    case 'TEACHER':
      return 'Учитель';
    case 'STUDENT':
      return 'Ученик';
    default:
      return role;
  }
};

/** Прогресс (score/total) в процентах. */
export const formatPercent = (score: number, total: number): string => {
  if (total <= 0) return '0%';
  return `${Math.round((score / total) * 100)}%`;
};
