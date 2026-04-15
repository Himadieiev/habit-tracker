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

  const calculateStreak = (logs: {date: string; completed: boolean}[]) => {
    const sorted = [...logs]
      .filter((l) => l.completed)
      .sort((a, b) => b.date.localeCompare(a.date));

    let streak = 0;
    let currentDate = new Date();

    for (const log of sorted) {
      const logDate = new Date(log.date);

      const diff =
        (currentDate.setHours(0, 0, 0, 0) - logDate.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24);

      if (diff === 0 || diff === 1) {
        streak++;
        currentDate = logDate;
      } else {
        break;
      }
    }

    return streak;
  };

  useEffect(() => {
    if (!user) return;

    (async () => {
      setLoading(true);

      const data = await habitsService.getHabitsWithLogs(user.id);

      const today = new Date().toISOString().slice(0, 10);

      const mapped = data.map((h) => {
        const completedToday = h.habit_logs?.some((log) => log.date === today && log.completed);

        const streak = calculateStreak(h.habit_logs ?? []);

        return {
          id: h.id,
          title: h.title,
          completed: !!completedToday,
          streak,
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
        streak: 0,
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
