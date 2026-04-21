import type {Log} from "@/features/habits/model/types";

const normalizeDate = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export const calculateCurrentStreak = (logs: Log[]) => {
  const completed = logs
    .filter((l) => l.completed)
    .map((l) => l.date)
    .sort((a, b) => b.localeCompare(a));

  let streak = 0;
  let current = normalizeDate(new Date());

  for (const dateStr of completed) {
    const d = normalizeDate(new Date(dateStr));

    const diff = (current.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 0 || diff === 1) {
      streak++;
      current = d;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateBestStreak = (logs: Log[]) => {
  const completed = logs
    .filter((l) => l.completed)
    .map((l) => l.date)
    .sort((a, b) => a.localeCompare(b));

  let best = 0;
  let current = 0;

  for (let i = 0; i < completed.length; i++) {
    if (i === 0) {
      current = 1;
      best = 1;
      continue;
    }

    const prev = normalizeDate(new Date(completed[i - 1]));
    const curr = normalizeDate(new Date(completed[i]));

    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      current++;
    } else {
      current = 1;
    }

    if (current > best) {
      best = current;
    }
  }

  return best;
};

export const calculateStats = (logs: Log[], totalDays: number) => {
  const completedDays = logs.filter((l) => l.completed).length;

  const completionRate = Math.round((completedDays / totalDays) * 100);

  return {
    completedDays,
    completionRate,
  };
};
