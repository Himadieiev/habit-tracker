import {useEffect, useState} from "react";

import {habitsService, type Habit} from "../api/habitsService";

type Filter = "all" | "active" | "completed";

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>(() => habitsService.getAll());
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    habitsService.saveAll(habits);
  }, [habits]);

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? {...habit, completed: !habit.completed} : habit)),
    );
  };

  const addHabit = (title: string) => {
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        completed: false,
      },
    ]);
  };

  const deleteHabit = (id: number) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const filteredHabits = habits.filter((habit) => {
    if (filter === "active") return !habit.completed;
    if (filter === "completed") return habit.completed;
    return true;
  });

  return {
    habits: filteredHabits,
    filter,
    setFilter,
    toggleHabit,
    addHabit,
    deleteHabit,
  };
};
