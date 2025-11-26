// src/lib/date-utils.js
export const formatChatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeFormatter = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });

  const dateFormatter = new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  const fullDateFormatter = new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  const time = timeFormatter.format(date);

  if (isToday) {
    return {
      primary: time,
      secondary: 'Today',
      full: `Today at ${time}`,
      type: 'today',
    };
  } else if (isYesterday) {
    return {
      primary: time,
      secondary: 'Yesterday',
      full: `Yesterday at ${time}`,
      type: 'yesterday',
    };
  } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    // Within last week
    const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
    return {
      primary: time,
      secondary: dayName,
      full: `${dayName} at ${time}`,
      type: 'week',
    };
  } else if (now.getFullYear() === date.getFullYear()) {
    // Same year
    return {
      primary: dateFormatter.format(date),
      secondary: time,
      full: `${dateFormatter.format(date)} at ${time}`,
      type: 'year',
    };
  } else {
    // Different year
    return {
      primary: fullDateFormatter.format(date),
      secondary: time,
      full: `${fullDateFormatter.format(date)} at ${time}`,
      type: 'old',
    };
  }
};

export const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(date);
};
