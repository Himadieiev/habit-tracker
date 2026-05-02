export type Log = {
  date: string;
  completed: boolean;
};

export type HabitBase = {
  id: string;
  title: string;
  logs: Log[];
  order: number;
  createdAt: string;
};

export type Habit = HabitBase & {
  completed: boolean;
  streak: number;
};

export type Filter = "all" | "active" | "completed";
