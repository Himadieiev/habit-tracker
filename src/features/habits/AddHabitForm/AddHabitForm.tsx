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

  return (
    <div className={styles.form}>
      <input
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="New habit..."
      />

      <Button onClick={handleAdd}>Add</Button>
    </div>
  );
};
