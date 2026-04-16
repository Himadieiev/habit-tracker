import {HabitItem} from "../HabitItem/HabitItem";
import type {Habit} from "../model/types";
import styles from "./HabitList.module.scss";

type Props = {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
};

export const HabitList = ({habits, onToggle, onDelete, loading}: Props) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (habits.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No habits yet</p>
        <span className={styles.emptyText}>Start by adding your first habit</span>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          id={habit.id}
          title={habit.title}
          completed={habit.completed}
          onToggle={onToggle}
          onDelete={onDelete}
          streak={habit.streak}
          logs={habit.logs}
        />
      ))}
    </div>
  );
};
