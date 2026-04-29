export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
} as const;

export const formatDate = (date: Date): string =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

export const getDayIndex = (date: Date): number => {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
};

export const getBarColor = (value: number): string => {
  if (value >= THRESHOLDS.HIGH) return "var(--color-success)";
  if (value >= THRESHOLDS.MEDIUM) return "var(--color-warning)";
  return "var(--color-danger)";
};

export const getChartHeight = (): number => {
  if (window.innerWidth <= 480.98) return 200;
  if (window.innerWidth <= 767.98) return 250;
  return 270;
};
