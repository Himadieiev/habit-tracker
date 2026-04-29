import type {WeekdayData} from "./types";

import styles from "./WeekdayChart.module.scss";

type TooltipPayload = {
  payload: WeekdayData;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
};

export const WeekdayChartTooltip = ({active, payload}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDay}>{data.day}</p>
      <p className={styles.tooltipRate}>Completion: {Math.round(data.rate)}%</p>
    </div>
  );
};
