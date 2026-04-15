import classNames from "classnames";

import {Button} from "@/components/Button";
import styles from "./HabitItem.module.scss";

type HabitItemProps = {
  id: string;
  title: string;
  completed: boolean;
  streak: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export const HabitItem = ({id, title, completed, streak, onToggle, onDelete}: HabitItemProps) => {
  return (
    <div
      className={classNames(styles.item, {
        [styles.completed]: completed,
      })}
    >
      <div className={styles.top}>
        <span className={styles.title}>{title}</span>
        <span className={styles.streak}>🔥 {streak} days</span>
      </div>

      <div className={styles.bottom}>
        <span className={styles.status}>{completed ? "Completed" : "Active"}</span>
        <div className={styles.actions}>
          <Button
            size="sm"
            variant={completed ? "secondary" : "primary"}
            onClick={() => onToggle(id)}
          >
            {completed ? "Undo" : "Complete"}
          </Button>

          <Button size="sm" variant="ghost" onClick={() => onDelete(id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
