import {useEffect, useMemo, useRef} from "react";

import type {Habit} from "@/features/habits/model/types";
import styles from "./ActivityHeatmap.module.scss";

type ActivityHeatmapProps = {
  habits: Habit[];
};

type DayData = {
  date: string;
  count: number;
  intensity: number;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SHOW_LABELS = [true, false, true, false, true, false, true];

const INTENSITY_CLASSES: Record<number, string> = {
  0: styles.intensity0,
  1: styles.intensity1,
  2: styles.intensity2,
  3: styles.intensity3,
};

const getIntensityClass = (intensity: number) => INTENSITY_CLASSES[intensity] || styles.intensity0;

export const ActivityHeatmap = ({habits}: ActivityHeatmapProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const heatmapData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);

    const dayMap = new Map<string, number>();

    habits.forEach((habit) => {
      habit.logs.forEach((log) => {
        if (log.completed) {
          const count = dayMap.get(log.date) || 0;
          dayMap.set(log.date, count + 1);
        }
      });
    });

    const weeks: DayData[][] = [];
    const currentDate = new Date(startDate);

    const startDayOfWeek = currentDate.getDay();
    const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    currentDate.setDate(currentDate.getDate() - startOffset);

    while (currentDate <= today) {
      const week: DayData[] = [];

      for (let i = 0; i < 7; i++) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        const count = dayMap.get(dateStr) || 0;

        let intensity = 0;
        if (count === 1) intensity = 1;
        else if (count === 2) intensity = 2;
        else if (count >= 3) intensity = 3;

        week.push({
          date: dateStr,
          count,
          intensity,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(week);
    }

    return {weeks};
  }, [habits]);

  useEffect(() => {
    if (wrapperRef.current && heatmapData.weeks.length > 0) {
      wrapperRef.current.scrollLeft = wrapperRef.current.scrollWidth;
    }
  }, [heatmapData.weeks.length]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Activity Heatmap</h3>
      <p className={styles.subtitle}>Last 12 months</p>

      <div className={styles.heatmapWrapper} ref={wrapperRef}>
        <div className={styles.calendar}>
          <div className={styles.weekdays}>
            {WEEKDAYS.map((day, idx) => (
              <div
                key={day}
                className={styles.weekday}
                style={{visibility: SHOW_LABELS[idx] ? "visible" : "hidden"}}
              >
                {day}
              </div>
            ))}
          </div>

          <div className={styles.weeks}>
            {heatmapData.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.week}>
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={`${styles.day} ${getIntensityClass(day.intensity)}`}
                    title={`${day.date}: ${day.count} habit${day.count !== 1 ? "s" : ""} completed`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendText}>Less</span>
        <div className={`${styles.legendBox} ${styles.intensity0}`}></div>
        <div className={`${styles.legendBox} ${styles.intensity1}`}></div>
        <div className={`${styles.legendBox} ${styles.intensity2}`}></div>
        <div className={`${styles.legendBox} ${styles.intensity3}`}></div>
        <span className={styles.legendText}>More</span>
      </div>
    </div>
  );
};
