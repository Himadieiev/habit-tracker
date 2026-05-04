import {useEffect, useMemo, useState, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import classNames from "classnames";

import {
  calculateBestStreak,
  calculateCurrentStreak,
  calculateStats,
} from "@/features/habits/utils/habitStats";
import {habitsService} from "@/features/habits/api/habitsService";
import type {HabitBase, Log} from "@/features/habits/model/types";
import {ConfirmModal} from "@/components/ConfirmModal";
import {CountUpAnimation} from "@/components/CountUpAnimation/CountUpAnimation";
import styles from "./HabitDetailPage.module.scss";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const HabitDetailPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const [habit, setHabit] = useState<HabitBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);

      const data = await habitsService.getHabitById(id);

      if (!data) {
        setLoading(false);
        return;
      }

      setHabit({
        id: data.id,
        title: data.title,
        logs: data.habit_logs ?? [],
        order: data.order,
        createdAt: data.created_at,
      });

      setTitleValue(data.title);

      setLoading(false);
    })();
  }, [id]);

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}.${month}`;
  }, []);

  const activeDaysCount = (() => {
    if (!habit?.createdAt) return 30;

    const created = new Date(habit.createdAt);
    created.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - created.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return Math.min(30, diffDays);
  })();

  const days = useMemo(() => {
    if (!habit) return [];

    const createdDate = habit.createdAt ? new Date(habit.createdAt) : null;
    if (createdDate) createdDate.setHours(0, 0, 0, 0);

    const result: {date: string; completed: boolean; isActive: boolean}[] = [];
    const totalDays = 30;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + 1);

    const startDayOfWeek = startDate.getDay();
    const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const calendarStart = new Date(startDate);
    calendarStart.setDate(startDate.getDate() - startOffset);

    const currentDate = new Date(calendarStart);

    while (currentDate <= today) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const date = `${year}-${month}-${day}`;

      const isActive = createdDate ? currentDate >= createdDate : true;
      const log = isActive ? habit.logs.find((l) => l.date === date) : null;

      result.push({
        date,
        completed: !!log?.completed,
        isActive,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }, [habit]);

  const stats = useMemo(() => {
    if (!habit) {
      return {
        completedDays: 0,
        completionRate: 0,
        currentStreak: 0,
        bestStreak: 0,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - activeDaysCount + 1);
    startDate.setHours(0, 0, 0, 0);

    const filteredLogs = habit.logs.filter((log) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate >= startDate && logDate <= today;
    });

    const base = calculateStats(filteredLogs, activeDaysCount);

    return {
      ...base,
      currentStreak: calculateCurrentStreak(filteredLogs),
      bestStreak: calculateBestStreak(filteredLogs),
    };
  }, [habit, activeDaysCount]);

  const getProgressColor = (rate: number) => {
    if (rate < 30) return "low";
    if (rate < 70) return "medium";
    return "high";
  };

  useEffect(() => {
    if (!stats) return;

    const timeout = setTimeout(() => {
      setAnimatedWidth(stats.completionRate);
    }, 500);

    return () => clearTimeout(timeout);
  }, [stats]);

  const toggleByDate = async (date: string, isActive: boolean) => {
    if (!habit || !isActive) return;

    const success = await habitsService.toggleHabitLogByDate(habit.id, date);

    if (!success) return;

    setHabit((prev) => {
      if (!prev) return prev;

      const exists = prev.logs.find((l) => l.date === date);

      let newLogs: Log[];

      if (exists) {
        newLogs = prev.logs.filter((l) => l.date !== date);
      } else {
        newLogs = [...prev.logs, {date, completed: true}];
      }

      return {
        ...prev,
        logs: newLogs,
      };
    });
  };

  const saveTitle = async () => {
    if (!habit) return;

    const trimmed = titleValue.trim();

    if (!trimmed || trimmed === habit.title) {
      setIsEditing(false);
      setTitleValue(habit.title);
      return;
    }

    setHabit((prev) => (prev ? {...prev, title: trimmed} : prev));

    const success = await habitsService.updateHabitTitle(habit.id, trimmed);

    if (!success) {
      setHabit((prev) => (prev ? {...prev, title: habit.title} : prev));
    }

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!habit) return;

    setIsDeleting(true);
    const success = await habitsService.deleteHabit(habit.id);
    setIsDeleting(false);

    if (!success) return;

    navigate("/");
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.skeleton}></div>
        <div className={styles.skeleton}></div>
        <div className={styles.skeleton}></div>
      </div>
    );
  }

  if (!habit) {
    return <div className={styles.empty}>Habit not found</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backButton} onClick={() => navigate(-1)} aria-label="Go back">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {isEditing ? (
            <input
              className={styles.input}
              value={titleValue}
              autoFocus
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setTitleValue(habit.title);
                }
              }}
            />
          ) : (
            <h1 className={styles.title} onClick={() => setIsEditing(true)}>
              {habit.title}
            </h1>
          )}
          <button className={styles.deleteButton} onClick={() => setConfirmOpen(true)}>
            Delete
          </button>
        </div>

        <span className={styles.subtitle}>Last {activeDaysCount} days</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <CountUpAnimation
            end={stats.completionRate}
            delay={0}
            suffix="%"
            className={styles.statValue}
          />
          <div className={styles.statLabel}>Completion</div>
        </div>

        <div className={styles.stat}>
          <CountUpAnimation end={stats.completedDays} delay={100} className={styles.statValue} />
          <div className={styles.statLabel}>Days done</div>
        </div>

        <div className={styles.stat}>
          <CountUpAnimation end={stats.currentStreak} delay={200} className={styles.statValue} />
          <div className={styles.statLabel}>Current streak</div>
        </div>

        <div className={styles.stat}>
          <CountUpAnimation end={stats.bestStreak} delay={300} className={styles.statValue} />
          <div className={styles.statLabel}>Best streak</div>
        </div>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Completion rate</span>
          <span className={styles.progressPercent}>{stats.completionRate}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={classNames(
              styles.progressFill,
              styles[getProgressColor(stats.completionRate)],
            )}
            style={{width: `${animatedWidth}%`}}
          />
        </div>
      </div>

      <div className={styles.calendar}>
        <div className={styles.weekdays}>
          {WEEKDAYS.map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {days.map((day) => (
            <button
              key={day.date}
              className={classNames(styles.day, {
                [styles.done]: day.completed,
                [styles.inactive]: !day.isActive,
              })}
              onClick={() => toggleByDate(day.date, day.isActive)}
              aria-label={
                day.isActive
                  ? `Mark ${day.date} as ${day.completed ? "incomplete" : "complete"}`
                  : `Not started yet`
              }
              disabled={!day.isActive}
            >
              {day.isActive ? <span className={styles.dayDate}>{formatDate(day.date)}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <figure className={styles.legend} aria-label="Calendar legend">
        <div className={styles.legendItem}>
          <div className={classNames(styles.legendBox, styles.legendBoxDone)}></div>
          <span className={styles.legendText}>Completed</span>
        </div>
        <div className={styles.legendItem}>
          <div className={classNames(styles.legendBox, styles.legendBoxActive)}></div>
          <span className={styles.legendText}>Active</span>
        </div>
        <div className={styles.legendItem}>
          <div className={classNames(styles.legendBox, styles.legendBoxInactive)}></div>
          <span className={styles.legendText}>Inactive</span>
        </div>
      </figure>

      <ConfirmModal
        open={confirmOpen}
        title="Delete habit?"
        description="This action cannot be undone."
        isLoading={isDeleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
