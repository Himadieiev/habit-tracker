import type {Habit} from "@/features/habits/model/types";
import styles from "./ActivityHeatmap.module.scss";

type ActivityHeatmapProps = {
  habits: Habit[];
};

export const ActivityHeatmap = ({habits}: ActivityHeatmapProps) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Activity Heatmap</h3>
      <div className={styles.placeholder}>
        <p>Coming soon...</p>
      </div>
    </div>
  );
};
