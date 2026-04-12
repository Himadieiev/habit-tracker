import {useHabits} from "@/features/habits/model/useHabits";
import {AddHabitForm} from "@/features/habits/AddHabitForm/AddHabitForm";
import {HabitFilters} from "@/features/habits/HabitFilters/HabitFilters";
import {HabitList} from "@/features/habits/HabitList/HabitList";
import {Button} from "@/components/Button";
import {supabase} from "@/lib/supabaseClient";
import styles from "./HabitsPage.module.scss";

export const HabitsPage = () => {
  const {habits, filter, setFilter, toggleHabit, addHabit, deleteHabit} = useHabits();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Habits</h1>

      <AddHabitForm onAdd={addHabit} />

      <HabitFilters value={filter} onChange={setFilter} />

      <HabitList habits={habits} onToggle={toggleHabit} onDelete={deleteHabit} />

      <Button variant="secondary" size="sm" onClick={() => supabase.auth.signOut()}>
        Logout
      </Button>
    </div>
  );
};
