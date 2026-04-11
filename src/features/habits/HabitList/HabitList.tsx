import {useHabits} from "../model/useHabits";
import {HabitItem} from "../HabitItem/HabitItem";
import {AddHabitForm} from "../AddHabitForm/AddHabitForm";
import styles from "./HabitList.module.scss";

export const HabitList = () => {
  const {habits, toggleHabit, addHabit} = useHabits();

  return (
    <div className={styles.wrapper}>
      <AddHabitForm onAdd={addHabit} />

      <div className={styles.list}>
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            title={habit.title}
            completed={habit.completed}
            onToggle={() => toggleHabit(habit.id)}
          />
        ))}
      </div>
    </div>
  );
};
