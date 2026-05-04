import {useMemo} from "react";

import type {Habit} from "@/features/habits/model/types";
import {calculateBestStreak} from "@/features/habits/utils/habitStats";
import {CountUpAnimation} from "@/components/CountUpAnimation/CountUpAnimation";
import styles from "./StatsCards.module.scss";

type StatsCardsProps = {
  habits: Habit[];
};

export const StatsCards = ({habits}: StatsCardsProps) => {
  const stats = useMemo(() => {
    const totalHabits = habits.length;

    let totalCompletionRateSum = 0;
    let totalCompletedDays = 0;
    let bestStreakOverall = 0;

    habits.forEach((habit) => {
      const completedDays = habit.logs.filter((l) => l.completed).length;
      totalCompletedDays += completedDays;

      const createdDate = new Date(habit.createdAt);
      createdDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - createdDate.getTime();
      const daysSinceCreation = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const completionRate = (completedDays / daysSinceCreation) * 100;
      totalCompletionRateSum += completionRate;

      const bestStreak = calculateBestStreak(habit.logs);
      if (bestStreak > bestStreakOverall) {
        bestStreakOverall = bestStreak;
      }
    });

    const averageCompletionRate =
      totalHabits > 0 ? Math.round(totalCompletionRateSum / totalHabits) : 0;

    return {
      totalHabits,
      averageCompletionRate,
      totalCompletedDays,
      bestStreak: bestStreakOverall,
    };
  }, [habits]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <CountUpAnimation end={stats.totalHabits} delay={0} className={styles.cardValue} />
        <div className={styles.cardLabel}>Total Habits</div>
      </div>
      <div className={styles.card}>
        <CountUpAnimation
          end={stats.averageCompletionRate}
          delay={100}
          suffix="%"
          className={styles.cardValue}
        />
        <div className={styles.cardLabel}>Avg Completion</div>
      </div>
      <div className={styles.card}>
        <CountUpAnimation end={stats.totalCompletedDays} delay={200} className={styles.cardValue} />
        <div className={styles.cardLabel}>Total Days Done</div>
      </div>
      <div className={styles.card}>
        <CountUpAnimation end={stats.bestStreak} delay={300} className={styles.cardValue} />
        <div className={styles.cardLabel}>Best Streak</div>
      </div>
    </div>
  );
};
