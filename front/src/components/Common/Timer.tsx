import React, { useEffect, useState } from "react";

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  label?: string;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, label }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="pt-1 pe-5 font-bold text-lg">
      {label && <span>{label}: </span>}
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;
