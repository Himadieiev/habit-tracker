import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import classNames from "classnames";

import {habitsService} from "@/features/habits/api/habitsService";
import styles from "./HabitDetailPage.module.scss";

type Log = {
  date: string;
  completed: boolean;
};

type Habit = {
  id: string;
  title: string;
  logs: Log[];
};

export const HabitDetailPage = () => {
  const {id} = useParams();

  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);

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
      });

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

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!habit) {
    return <div className={styles.empty}>Habit not found</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{habit.title}</h1>
        <span className={styles.subtitle}>Last 90 days</span>
      </div>

      <div className={styles.grid}>
        {days.map((day) => (
          <span
            key={day.date}
            className={classNames(styles.day, {[styles.done]: day.completed})}
            title={day.date}
          />
        ))}
      </div>
    </div>
  );
};
