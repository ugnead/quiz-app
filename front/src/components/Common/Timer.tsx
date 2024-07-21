import React, { useEffect, useRef, useState } from "react";

interface TestTimerProps {
  duration: number;
  onTimeUp: () => void;
  label?: string;
}

const TestTimer: React.FC<TestTimerProps> = ({ duration, onTimeUp, label = "Time left" }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [duration, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return <div className="pt-1 pe-5 font-bold text-lg ">{label}: {formatTime(timeLeft)}</div>;
};

export default TestTimer;
