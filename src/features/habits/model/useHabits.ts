import {useState} from "react";

type Habit = {
  id: number;
  title: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";

const initialHabits: Habit[] = [
  {id: 1, title: "Drink water", completed: false},
  {id: 2, title: "Workout", completed: true},
  {id: 3, title: "Read a book", completed: false},
];

export const useHabits = () => {
  const [habits, setHabits] = useState(initialHabits);
  const [filter, setFilter] = useState<Filter>("all");

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

  const deleteHabit = (id: number) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const filteredHabits = habits.filter((habit) => {
    if (filter === "active") return !habit.completed;
    if (filter === "completed") return habit.completed;
    return true;
  });

  return {
    habits: filteredHabits,
    filter,
    setFilter,
    toggleHabit,
    addHabit,
    deleteHabit,
  };
};
