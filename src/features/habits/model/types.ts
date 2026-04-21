export type Log = {
  date: string;
  completed: boolean;
};

export type HabitBase = {
  id: string;
  title: string;
  logs: Log[];
};

export type Habit = HabitBase & {
  completed: boolean;
  streak: number;
};
