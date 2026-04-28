import type {Habit} from "@/features/habits/model/types";
import styles from "./HabitsStatsTable.module.scss";

type HabitsStatsTableProps = {
  habits: Habit[];
};

export const HabitsStatsTable = ({habits}: HabitsStatsTableProps) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Habits Details</h3>
      <div className={styles.placeholder}>
        <p>Coming soon...</p>
      </div>
    </div>
  );
};
