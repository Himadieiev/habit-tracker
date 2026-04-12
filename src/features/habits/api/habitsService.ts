const STORAGE_KEY = "habits";

export type Habit = {
  id: number;
  title: string;
  completed: boolean;
};

export const habitsService = {
  getAll(): Habit[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveAll(habits: Habit[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  },
};
