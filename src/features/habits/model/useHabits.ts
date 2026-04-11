import {useState} from "react";

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

export const useHabits = () => {
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

  return {
    habits,
    toggleHabit,
    addHabit,
  };
};
