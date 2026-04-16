export type Habit = {
  id: string;
  title: string;
  completed: boolean;
  streak: number;
  logs: {
    date: string;
    completed: boolean;
  }[];
};
