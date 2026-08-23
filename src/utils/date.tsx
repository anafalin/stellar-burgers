// utils/date.ts
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let dayText = '';
  if (date.toDateString() === today.toDateString()) {
    dayText = 'Сегодня';
  } else if (date.toDateString() === yesterday.toDateString()) {
    dayText = 'Вчера';
  } else {
    dayText = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const timeText = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dayText} ${timeText}`;
};
