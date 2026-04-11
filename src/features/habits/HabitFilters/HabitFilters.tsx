import {Button} from "@/components/Button/Button";
import styles from "./HabitFilters.module.scss";

type Filter = "all" | "active" | "completed";

type Props = {
  value: Filter;
  onChange: (filter: Filter) => void;
};

export const HabitFilters = ({value, onChange}: Props) => {
  return (
    <div className={styles.filters}>
      <Button
        size="sm"
        variant={value === "all" ? "primary" : "ghost"}
        onClick={() => onChange("all")}
      >
        All
      </Button>

      <Button
        size="sm"
        variant={value === "active" ? "primary" : "ghost"}
        onClick={() => onChange("active")}
      >
        Active
      </Button>

      <Button
        size="sm"
        variant={value === "completed" ? "primary" : "ghost"}
        onClick={() => onChange("completed")}
      >
        Completed
      </Button>
    </div>
  );
};
