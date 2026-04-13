import {useEffect, useState} from "react";

import {useAuth} from "@/features/auth/model/useAuth";
import {habitsService} from "../api/habitsService";
import type {Habit} from "./types";

type Filter = "all" | "active" | "completed";

export const useHabits = () => {
  const {user} = useAuth();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
      setLoading(true);

      const data = await habitsService.getHabitsWithLogs(user.id);

      const today = new Date().toISOString().slice(0, 10);

      const mapped = data.map((h) => {
        const completedToday = h.habit_logs?.some((log) => log.date === today && log.completed);

        return {
          id: h.id,
          title: h.title,
          completed: !!completedToday,
        };
      });

      setHabits(mapped);
      setLoading(false);
    })();
  }, [user]);

  const addHabit = async (title: string) => {
    if (!user) return;

    const newHabit = await habitsService.addHabit(title, user.id);

    if (!newHabit) return;

    setHabits((prev) => [
      {
        id: newHabit.id,
        title: newHabit.title,
        completed: false,
      },
      ...prev,
    ]);
  };

  const deleteHabit = async (id: string) => {
    const success = await habitsService.deleteHabit(id);

    if (!success) return;

    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHabit = async (id: string) => {
    const success = await habitsService.toggleHabitLog(id);

    if (!success) return;

    setHabits((prev) => prev.map((h) => (h.id === id ? {...h, completed: !h.completed} : h)));
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
    loading,
  };
};
