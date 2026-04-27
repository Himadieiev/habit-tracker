import {useState} from "react";

import {Button} from "@/components/Button/Button";
import styles from "./AddHabitForm.module.scss";

type Props = {
  onAdd: (title: string) => void;
};

export const AddHabitForm = ({onAdd}: Props) => {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const handleClear = () => {
    setValue("");
  };

  return (
    <div className={styles.form}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New habit..."
        />
        {value.length > 0 && (
          <button className={styles.clearButton} onClick={handleClear} type="button">
            ✕
          </button>
        )}
      </div>

      <Button onClick={handleAdd}>Add habit</Button>
    </div>
  );
};
