import {useState} from "react";

import {HabitItem} from "../HabitItem/HabitItem";
import type {Habit} from "../model/types";
import styles from "./HabitList.module.scss";
import {ConfirmModal} from "@/components/ConfirmModal";

type Props = {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
};

export const HabitList = ({habits, onToggle, onDelete, loading}: Props) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
    <>
      <div className={styles.list}>
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            id={habit.id}
            title={habit.title}
            completed={habit.completed}
            onToggle={onToggle}
            onDelete={(id) => setDeleteId(id)}
            streak={habit.streak}
            logs={habit.logs}
          />
        ))}
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete habit?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleteId) {
            onDelete(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
};
