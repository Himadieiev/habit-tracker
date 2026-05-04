import {useEffect, useState, useRef} from "react";

import type {CountUpAnimationProps} from "./types";

export const CountUpAnimation = ({
  end,
  duration = 300,
  delay = 0,
  suffix = "",
  className,
}: CountUpAnimationProps) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setTimeout(() => {
            setHasStarted(true);
          }, delay);
        }
      },
      {threshold: 0.5, rootMargin: "0px"},
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [delay, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return (
    <div ref={elementRef} className={className}>
      {count}
      {suffix}
    </div>
  );
};
