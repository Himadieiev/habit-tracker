import {useState} from "react";

import {HabitItem} from "../HabitItem/HabitItem";
import type {Habit} from "../model/types";
import styles from "./HabitList.module.scss";
import {ConfirmModal} from "@/components/ConfirmModal";

type Props = {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (habits: Habit[]) => void;
  loading: boolean;
};

export const HabitList = ({habits, onToggle, onDelete, onReorder, loading}: Props) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);

    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (!draggedId || draggedId === targetId) return;

    const newList = [...habits];

    const fromIndex = newList.findIndex((h) => h.id === draggedId);
    const toIndex = newList.findIndex((h) => h.id === targetId);

    const [moved] = newList.splice(fromIndex, 1);
    newList.splice(toIndex, 0, moved);

    const updated = newList.map((h, index) => ({
      ...h,
      order: index * 10,
    }));

    onReorder(updated);
    setDraggedId(null);
  };

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
            onDragStart={(e, id) => handleDragStart(e, id)}
            onDrop={(e, id) => handleDrop(e, id)}
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
