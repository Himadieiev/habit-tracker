import {useHabits} from "@/features/habits/model/useHabits";
import {StatsCards} from "@/features/stats/StatsCards/StatsCards";
import {ActivityHeatmap} from "@/features/stats/ActivityHeatmap/ActivityHeatmap";
import {WeekdayChart} from "@/features/stats/WeekdayChart/WeekdayChart";
import {HabitsStatsTable} from "@/features/stats/HabitsStatsTable/HabitsStatsTable";
import styles from "./StatsPage.module.scss";

export const StatsPage = () => {
  const {habits, loading} = useHabits();

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeleton}></div>
        <div className={styles.skeleton}></div>
        <div className={styles.skeleton}></div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Statistics</h1>
        <p className={styles.subtitle}>Track your progress and insights</p>
      </div>

      <StatsCards habits={habits} />

      <div className={styles.grid}>
        <ActivityHeatmap habits={habits} />
        <WeekdayChart habits={habits} />
      </div>

      <HabitsStatsTable habits={habits} />
    </div>
  );
};
