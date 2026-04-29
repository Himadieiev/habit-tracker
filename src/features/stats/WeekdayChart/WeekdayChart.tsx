import {useEffect, useMemo, useState} from "react";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

import type {Habit} from "@/features/habits/model/types";
import type {WeekdayData} from "./types";
import {WEEKDAYS, formatDate, getDayIndex, getBarColor, getChartHeight} from "./helpers";
import {WeekdayChartTooltip} from "./WeekdayChartTooltip";
import styles from "./WeekdayChart.module.scss";

type WeekdayChartProps = {
  habits: Habit[];
};

export const WeekdayChart = ({habits}: WeekdayChartProps) => {
  const [chartHeight, setChartHeight] = useState(getChartHeight);

  useEffect(() => {
    const handleResize = () => setChartHeight(getChartHeight());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const weekdayStats = useMemo(() => {
    const stats: WeekdayData[] = WEEKDAYS.map((day) => ({
      day,
      rate: 0,
      completed: 0,
      total: 0,
    }));

    habits.forEach((habit) => {
      const createdDate = new Date(habit.createdAt);
      createdDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const totalDays =
        Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const habitStats = Array(7)
        .fill(null)
        .map(() => ({completed: 0, total: 0}));

      for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(createdDate);
        currentDate.setDate(createdDate.getDate() + i);

        const dayIndex = getDayIndex(currentDate);
        const dateStr = formatDate(currentDate);

        habitStats[dayIndex].total++;

        const isCompleted = habit.logs.some((log) => log.date === dateStr && log.completed);
        if (isCompleted) {
          habitStats[dayIndex].completed++;
        }
      }

      habitStats.forEach((hs, dayIndex) => {
        if (hs.total > 0) {
          stats[dayIndex].completed += (hs.completed / hs.total) * 100;
          stats[dayIndex].total++;
        }
      });
    });

    return stats.map((stat) => ({
      ...stat,
      rate: stat.total > 0 ? stat.completed / stat.total : 0,
    }));
  }, [habits]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Weekday Performance</h3>
      <p className={styles.subtitle}>Completion rate by day of week</p>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={weekdayStats} margin={{top: 10, right: 10, left: -20, bottom: 10}}>
            <CartesianGrid strokeDasharray="3 3" className={styles.grid} />
            <XAxis dataKey="day" fontSize={12} tickLine={false} />
            <YAxis
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip content={<WeekdayChartTooltip />} cursor={false} />
            <Bar
              dataKey="rate"
              animationDuration={0}
              isAnimationActive={false}
              activeBar={false}
              fill="none"
              shape={({x, y, width, height, value}) => {
                const color = getBarColor(Number(value));
                return (
                  <rect x={x} y={y} width={width} height={height} style={{fill: color}} rx={3} />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.low}`}></div>
          <span className={styles.legendText}>Needs Work (0-39%)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.medium}`}></div>
          <span className={styles.legendText}>Good (40-69%)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.high}`}></div>
          <span className={styles.legendText}>Excellent (70%+)</span>
        </div>
      </div>
    </div>
  );
};
