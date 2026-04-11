import classNames from "classnames";

import {Button} from "@/components/Button";
import styles from "./HabitItem.module.scss";

type HabitItemProps = {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export const HabitItem = ({title, completed, onToggle, onDelete}: HabitItemProps) => {
  return (
    <div
      className={classNames(styles.item, {
        [styles.completed]: completed,
      })}
    >
      <span className={styles.title}>{title}</span>

      <div className={styles.actions}>
        <span className={styles.status}>{completed ? "Completed" : "Active"}</span>

        <Button size="sm" variant={completed ? "secondary" : "primary"} onClick={onToggle}>
          {completed ? "Undo" : "Complete"}
        </Button>

        <Button size="sm" variant="ghost" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};
