import type {Habit} from "@/features/habits/model/types";
import styles from "./StatsCards.module.scss";

type StatsCardsProps = {
  habits: Habit[];
};

export const StatsCards = ({habits}: StatsCardsProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardValue}>0</div>
        <div className={styles.cardLabel}>Total Habits</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardValue}>0%</div>
        <div className={styles.cardLabel}>Completion Rate</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardValue}>0</div>
        <div className={styles.cardLabel}>Total Streak</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardValue}>0</div>
        <div className={styles.cardLabel}>Best Streak</div>
      </div>
    </div>
  );
};
