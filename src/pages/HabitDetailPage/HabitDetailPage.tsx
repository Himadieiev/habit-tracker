import {useEffect, useMemo, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import classNames from "classnames";

import {
  calculateBestStreak,
  calculateCurrentStreak,
  calculateStats,
} from "@/features/habits/utils/habitStats";
import {habitsService} from "@/features/habits/api/habitsService";
import type {HabitBase} from "@/features/habits/model/types";
import {ConfirmModal} from "@/components/ConfirmModal";
import styles from "./HabitDetailPage.module.scss";

export const HabitDetailPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const [habit, setHabit] = useState<HabitBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);

      const data = await habitsService.getHabitById(id);

      if (!data) {
        setLoading(false);
        return;
      }

      setHabit({
        id: data.id,
        title: data.title,
        logs: data.habit_logs ?? [],
        order: data.order,
      });

      setTitleValue(data.title);

      setLoading(false);
    })();
  }, [id]);

  const days = useMemo(() => {
    if (!habit) return [];

    const result: {date: string; completed: boolean}[] = [];

    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const date = d.toISOString().slice(0, 10);

      const log = habit.logs.find((l) => l.date === date);

      result.push({
        date,
        completed: !!log?.completed,
      });
    }

    return result;
  }, [habit]);

  const stats = useMemo(() => {
    if (!habit) {
      return {
        completedDays: 0,
        completionRate: 0,
        currentStreak: 0,
        bestStreak: 0,
      };
    }

    const totalDays = 90;

    const base = calculateStats(habit.logs, totalDays);

    return {
      ...base,
      currentStreak: calculateCurrentStreak(habit.logs),
      bestStreak: calculateBestStreak(habit.logs),
    };
  }, [habit]);

  const getProgressColor = (rate: number) => {
    if (rate < 30) return "low";
    if (rate < 70) return "medium";
    return "high";
  };

  useEffect(() => {
    if (!stats) return;

    const timeout = setTimeout(() => {
      setAnimatedWidth(stats.completionRate);
    }, 500);

    return () => clearTimeout(timeout);
  }, [stats]);

  const toggleByDate = async (date: string) => {
    if (!habit) return;

    const success = await habitsService.toggleHabitLogByDate(habit.id, date);

    if (!success) return;

    setHabit((prev) => {
      if (!prev) return prev;

      const exists = prev.logs.find((l) => l.date === date);

      let newLogs;

      if (exists) {
        newLogs = prev.logs.filter((l) => l.date !== date);
      } else {
        newLogs = [...prev.logs, {date, completed: true}];
      }

      return {
        ...prev,
        logs: newLogs,
      };
    });
  };

  const saveTitle = async () => {
    if (!habit) return;

    const trimmed = titleValue.trim();

    if (!trimmed || trimmed === habit.title) {
      setIsEditing(false);
      setTitleValue(habit.title);
      return;
    }

    setHabit((prev) => (prev ? {...prev, title: trimmed} : prev));

    const success = await habitsService.updateHabitTitle(habit.id, trimmed);

    if (!success) {
      setHabit((prev) => (prev ? {...prev, title: habit.title} : prev));
    }

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!habit) return;

    const success = await habitsService.deleteHabit(habit.id);

    if (!success) return;

    navigate("/");
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!habit) {
    return <div className={styles.empty}>Habit not found</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          {isEditing ? (
            <input
              className={styles.input}
              value={titleValue}
              autoFocus
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setTitleValue(habit.title);
                }
              }}
            />
          ) : (
            <h1 className={styles.title} onClick={() => setIsEditing(true)}>
              {habit.title}
            </h1>
          )}
          <button className={styles.deleteButton} onClick={() => setConfirmOpen(true)}>
            Delete
          </button>
        </div>

        <span className={styles.subtitle}>Last 90 days</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.completionRate}%</span>
          <span className={styles.statLabel}>Completion</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.completedDays}</span>
          <span className={styles.statLabel}>Days done</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.currentStreak}</span>
          <span className={styles.statLabel}>Current streak</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.bestStreak}</span>
          <span className={styles.statLabel}>Best streak</span>
        </div>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={classNames(
              styles.progressFill,
              styles[getProgressColor(stats.completionRate)],
            )}
            style={{width: `${animatedWidth}%`}}
          />
        </div>
      </div>

      <div className={styles.grid}>
        {days.map((day) => (
          <span
            key={day.date}
            className={classNames(styles.day, {[styles.done]: day.completed})}
            title={day.date}
            onClick={() => toggleByDate(day.date)}
          />
        ))}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete habit?"
        description="This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
