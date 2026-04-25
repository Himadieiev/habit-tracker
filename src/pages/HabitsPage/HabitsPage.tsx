import {useAuth} from "@/features/auth/model/useAuth";
import {useHabits} from "@/features/habits/model/useHabits";
import {AddHabitForm} from "@/features/habits/AddHabitForm/AddHabitForm";
import {HabitFilters} from "@/features/habits/HabitFilters/HabitFilters";
import {HabitList} from "@/features/habits/HabitList/HabitList";
import {Button} from "@/components/Button";
import {supabase} from "@/lib/supabaseClient";
import styles from "./HabitsPage.module.scss";

export const HabitsPage = () => {
  const {habits, filter, setFilter, toggleHabit, addHabit, deleteHabit, reorderHabits, loading} =
    useHabits();
  const {user} = useAuth();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Habits</h1>

        <div className={styles.userBlock}>
          <span className={styles.userEmail}>{user?.email}</span>
          <Button variant="secondary" size="sm" onClick={() => supabase.auth.signOut()}>
            Logout
          </Button>
        </div>
      </div>

      <AddHabitForm onAdd={addHabit} />

      <HabitFilters value={filter} onChange={setFilter} />

      <HabitList
        habits={habits}
        onToggle={toggleHabit}
        onDelete={deleteHabit}
        onReorder={reorderHabits}
        loading={loading}
      />
    </div>
  );
};
