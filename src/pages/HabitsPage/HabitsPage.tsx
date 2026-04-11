import {HabitList} from "@/features/habits/HabitList/HabitList";
import styles from "./HabitsPage.module.scss";

export const HabitsPage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Habits</h1>

      <HabitList />
    </div>
  );
};
