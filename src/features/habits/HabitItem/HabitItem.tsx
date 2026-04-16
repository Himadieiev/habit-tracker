import classNames from "classnames";

import {Button} from "@/components/Button";
import styles from "./HabitItem.module.scss";

type HabitItemProps = {
  id: string;
  title: string;
  completed: boolean;
  streak: number;
  logs: {
    date: string;
    completed: boolean;
  }[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export const HabitItem = ({
  id,
  title,
  completed,
  streak,
  logs,
  onToggle,
  onDelete,
}: HabitItemProps) => {
  const getLastDays = (logs: {date: string; completed: boolean}[]) => {
    const days: {date: string; completed: boolean}[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const date = d.toISOString().slice(0, 10);

      const log = logs.find((l) => l.date === date);

      days.push({
        date,
        completed: !!log?.completed,
      });
    }

    return days;
  };

  const history = getLastDays(logs);
  const today = new Date().toISOString().slice(0, 10);

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

      <div className={styles.history}>
        {history.map((day) => (
          <span
            key={day.date}
            className={classNames(styles.day, {
              [styles.done]: day.completed,
              [styles.today]: day.date === today,
            })}
          />
        ))}
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
