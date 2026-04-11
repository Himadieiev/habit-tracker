import {useState} from "react";

import {HabitItem} from "../HabitItem/HabitItem";
import {AddHabitForm} from "../AddHabitForm/AddHabitForm";
import styles from "./HabitList.module.scss";

type Habit = {
  id: number;
  title: string;
  completed: boolean;
};

const initialHabits: Habit[] = [
  {id: 1, title: "Drink water", completed: false},
  {id: 2, title: "Workout", completed: true},
  {id: 3, title: "Read a book", completed: false},
];

export const HabitList = () => {
  const [habits, setHabits] = useState(initialHabits);

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? {...habit, completed: !habit.completed} : habit)),
    );
  };

  const addHabit = (title: string) => {
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        completed: false,
      },
    ]);
  };

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
