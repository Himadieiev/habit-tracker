import {useState, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import classNames from "classnames";

import type {Habit} from "@/features/habits/model/types";
import {calculateCurrentStreak, calculateBestStreak} from "@/features/habits/utils/habitStats";
import styles from "./HabitsStatsTable.module.scss";

type HabitsStatsTableProps = {
  habits: Habit[];
};

type SortField = "title" | "completion" | "done" | "totalDays" | "currentStreak" | "bestStreak";
type SortOrder = "asc" | "desc";

const getDaysSinceCreation = (habit: Habit): number => {
  const createdDate = new Date(habit.createdAt);
  createdDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

const getCompletionRate = (habit: Habit): number => {
  const completedDays = habit.logs.filter((l) => l.completed).length;
  const daysSinceCreation = getDaysSinceCreation(habit);
  return daysSinceCreation > 0 ? (completedDays / daysSinceCreation) * 100 : 0;
};

export const HabitsStatsTable = ({habits}: HabitsStatsTableProps) => {
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const navigate = useNavigate();

  const handleRowClick = (habitId: string) => {
    navigate(`/habit/${habitId}`);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "↑↓";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const sortedHabits = useMemo(() => {
    const habitsWithStats = habits.map((habit) => ({
      ...habit,
      completionRate: getCompletionRate(habit),
      daysSinceCreation: getDaysSinceCreation(habit),
      completedDays: habit.logs.filter((l) => l.completed).length,
      currentStreak: calculateCurrentStreak(habit.logs),
      bestStreak: calculateBestStreak(habit.logs),
    }));

    return [...habitsWithStats].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "completion":
          aValue = a.completionRate;
          bValue = b.completionRate;
          break;
        case "done":
          aValue = a.completedDays;
          bValue = b.completedDays;
          break;
        case "totalDays":
          aValue = a.daysSinceCreation;
          bValue = b.daysSinceCreation;
          break;
        case "currentStreak":
          aValue = a.currentStreak;
          bValue = b.currentStreak;
          break;
        case "bestStreak":
          aValue = a.bestStreak;
          bValue = b.bestStreak;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }

      return sortOrder === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [habits, sortField, sortOrder]);

  const getCompletionColor = (rate: number) => {
    if (rate >= 70) return styles.high;
    if (rate >= 40) return styles.medium;
    return styles.low;
  };

  if (habits.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Habits Details</h3>
        <div className={styles.empty}>
          <p>No habits yet</p>
          <span>Create your first habit to see statistics</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Habits Details</h3>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th rowSpan={2} onClick={() => handleSort("title")} className={styles.sortable}>
                Habit <span className={styles.sortIcon}>{getSortIcon("title")}</span>
              </th>
              <th rowSpan={2} onClick={() => handleSort("completion")} className={styles.sortable}>
                Completion <span className={styles.sortIcon}>{getSortIcon("completion")}</span>
              </th>
              <th colSpan={2} className={classNames(styles.groupHeader, styles.centered)}>
                Days
              </th>
              <th colSpan={2} className={classNames(styles.groupHeader, styles.centered)}>
                Streak
              </th>
            </tr>
            <tr>
              <th onClick={() => handleSort("done")} className={styles.sortable}>
                Done <span className={styles.sortIcon}>{getSortIcon("done")}</span>
              </th>
              <th onClick={() => handleSort("totalDays")} className={styles.sortable}>
                Total <span className={styles.sortIcon}>{getSortIcon("totalDays")}</span>
              </th>
              <th onClick={() => handleSort("currentStreak")} className={styles.sortable}>
                Current <span className={styles.sortIcon}>{getSortIcon("currentStreak")}</span>
              </th>
              <th onClick={() => handleSort("bestStreak")} className={styles.sortable}>
                Best <span className={styles.sortIcon}>{getSortIcon("bestStreak")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedHabits.map((habit) => {
              const completionColor = getCompletionColor(habit.completionRate);

              return (
                <tr
                  key={habit.id}
                  onClick={() => handleRowClick(habit.id)}
                  className={styles.clickableRow}
                >
                  <td className={styles.habitTitle}>{habit.title}</td>
                  <td className={completionColor}>{Math.round(habit.completionRate)}%</td>
                  <td>{habit.completedDays}</td>
                  <td>{habit.daysSinceCreation}</td>
                  <td>{habit.currentStreak}</td>
                  <td>{habit.bestStreak}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.cards}>
        {sortedHabits.map((habit) => {
          const completionColor = getCompletionColor(habit.completionRate);

          return (
            <div key={habit.id} className={styles.card} onClick={() => handleRowClick(habit.id)}>
              <div className={styles.cardTitle}>{habit.title}</div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Completion</span>
                <span className={`${styles.cardValue} ${completionColor}`}>
                  {Math.round(habit.completionRate)}%
                </span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Days done</span>
                <span className={styles.cardValue}>{habit.completedDays}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Total days</span>
                <span className={styles.cardValue}>{habit.daysSinceCreation}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Current streak</span>
                <span className={styles.cardValue}>{habit.currentStreak}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Best streak</span>
                <span className={styles.cardValue}>{habit.bestStreak}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
