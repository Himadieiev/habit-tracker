import {useEffect, useState} from "react";
import {toast} from "sonner";

import {useAuth} from "@/features/auth/model/useAuth";
import {habitsService} from "../api/habitsService";
import type {Filter, Habit} from "./types";

export const useHabits = () => {
  const {user} = useAuth();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    if (!user?.id) return;

    (async () => {
      setLoading(true);

      const data = await habitsService.getHabitsWithLogs(user.id);

      const today = new Date().toISOString().slice(0, 10);

      const mapped = data.map((h) => {
        const logs = h.habit_logs ?? [];

        const completedToday = logs.some((log) => log.date === today && log.completed);

        const streak = calculateStreak(logs);

        return {
          id: h.id,
          title: h.title,
          completed: !!completedToday,
          streak,
          logs,
          order: h.order ?? 0,
          createdAt: h.created_at,
        };
      });

      setHabits(mapped);
      setLoading(false);
    })();
  }, [user?.id]);

  const addHabit = async (title: string) => {
    if (!user) return;

    const newHabit = await habitsService.addHabit(title, user.id);

    if (!newHabit) return;

    setHabits((prev) => [
      ...prev,
      {
        id: newHabit.id,
        title: newHabit.title,
        completed: false,
        streak: 0,
        logs: [],
        order: newHabit.order,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const deleteHabit = async (id: string) => {
    const success = await habitsService.deleteHabit(id);

    if (!success) return;

    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHabit = async (id: string) => {
    const today = new Date().toISOString().slice(0, 10);

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;

        const exists = h.logs.some((l) => l.date === today);

        let newLogs;

        if (exists) {
          newLogs = h.logs.filter((l) => l.date !== today);
        } else {
          newLogs = [...h.logs, {date: today, completed: true}];
        }

        return {
          ...h,
          logs: newLogs,
          completed: !exists,
          streak: calculateStreak(newLogs),
        };
      }),
    );

    const success = await habitsService.toggleHabitLog(id);

    if (!success) {
      toast.error("Failed to toggle habit");
      console.error("toggle failed");
    }
  };

  const reorderHabits = async (newHabits: Habit[]) => {
    setHabits(newHabits);

    const updates = newHabits.map((h, index) => ({
      id: h.id,
      order: index * 10,
    }));

    await habitsService.updateHabitsOrder(updates);
  };

  const filteredHabits = habits.filter((habit) => {
    if (filter === "active") return !habit.completed;
    if (filter === "completed") return habit.completed;
    return true;
  });

  const importHabits = async (
    importedHabits: Array<{
      title: string;
      createdAt: string;
      logs: Array<{date: string; completed: boolean}>;
    }>,
  ) => {
    if (!user) return false;

    const count = await habitsService.importHabits(user.id, importedHabits);

    if (count > 0) {
      const data = await habitsService.getHabitsWithLogs(user.id);
      const today = new Date().toISOString().slice(0, 10);
      const mapped = data.map((h) => {
        const logs = h.habit_logs ?? [];
        const completedToday = logs.some((log) => log.date === today && log.completed);
        const streak = calculateStreak(logs);
        return {
          id: h.id,
          title: h.title,
          completed: !!completedToday,
          streak,
          logs,
          order: h.order ?? 0,
          createdAt: h.created_at,
        };
      });
      setHabits(mapped);
      return true;
    }

    return false;
  };

  const filteredBySearch = filteredHabits.filter((habit) =>
    habit.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    habits: filteredBySearch,
    allHabitsCount: habits.length,
    filteredCount: filteredHabits.length,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    toggleHabit,
    addHabit,
    deleteHabit,
    reorderHabits,
    importHabits,
    loading,
  };
};
