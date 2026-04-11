import {HabitItem} from "../HabitItem/HabitItem";
import styles from "./HabitList.module.scss";

type Habit = {
  id: number;
  title: string;
  completed: boolean;
};

type Props = {
  habits: Habit[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export const HabitList = ({habits, onToggle, onDelete}: Props) => {
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
          title={habit.title}
          completed={habit.completed}
          onToggle={() => onToggle(habit.id)}
          onDelete={() => onDelete(habit.id)}
        />
      ))}
    </div>
  );
};
