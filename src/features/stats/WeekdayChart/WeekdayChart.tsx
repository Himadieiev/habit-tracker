import type {Habit} from "@/features/habits/model/types";
import styles from "./WeekdayChart.module.scss";

type WeekdayChartProps = {
  habits: Habit[];
};

export const WeekdayChart = ({habits}: WeekdayChartProps) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Weekday Performance</h3>
      <div className={styles.placeholder}>
        <p>Coming soon...</p>
      </div>
    </div>
  );
};
