export type Log = {
  date: string;
  completed: boolean;
};

export type HabitBase = {
  id: string;
  title: string;
  logs: Log[];
  order: number;
};

export type Habit = HabitBase & {
  completed: boolean;
  streak: number;
};
