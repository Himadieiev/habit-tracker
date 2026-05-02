import {useState, useEffect, useRef} from "react";
import {toast} from "sonner";

import {useAuth} from "@/features/auth/model/useAuth";
import {useHabits} from "@/features/habits/model/useHabits";
import {AddHabitForm} from "@/features/habits/AddHabitForm/AddHabitForm";
import {HabitFilters} from "@/features/habits/HabitFilters/HabitFilters";
import {HabitList} from "@/features/habits/HabitList/HabitList";
import {supabase} from "@/lib/supabaseClient";
import {Avatar} from "@/components/Avatar/Avatar";
import styles from "./HabitsPage.module.scss";

export const HabitsPage = () => {
  const {
    habits,
    allHabitsCount,
    filteredCount,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    toggleHabit,
    addHabit,
    deleteHabit,
    reorderHabits,
    loading,
  } = useHabits();
  const {user} = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClose = () => {
      setIsMenuOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const handleScroll = () => {
      handleClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsMenuOpen(false);
    } catch (error) {
      toast.error("Failed to sign out");
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.greeting}>
          <span className={styles.greetingText}>{getGreeting()},</span>
          <span className={styles.userName}>{firstName} 👋</span>
        </div>

        <div className={styles.userBlock} ref={menuRef}>
          <Avatar email={user?.email || ""} onClick={() => setIsMenuOpen(!isMenuOpen)} />

          {isMenuOpen && (
            <div className={styles.menu}>
              <div className={styles.menuEmail}>{user?.email}</div>
              <button className={styles.menuLogout} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <AddHabitForm onAdd={addHabit} />

      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search habits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className={styles.searchClear}>
            ✕
          </button>
        )}
      </div>

      <HabitFilters value={filter} onChange={setFilter} />
      <HabitList
        habits={habits}
        filter={filter}
        allHabitsCount={allHabitsCount}
        filteredCount={filteredCount}
        onToggle={toggleHabit}
        onDelete={deleteHabit}
        onReorder={reorderHabits}
        loading={loading}
      />
    </div>
  );
};
