"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface QuizTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isPaused: boolean;
  setTimeGLeft: (time: number) => void;
}

export function QuizTimer({
  duration,
  onTimeUp,
  isPaused,
  setTimeGLeft,
}: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  useEffect(() => {
    if (isPaused) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setTimeGLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, isPaused]);

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Determine color based on time left
  const getTimerColor = () => {
    const percentLeft = (timeLeft / duration) * 100;
    if (percentLeft > 50) return "text-green-600 dark:text-green-400";
    if (percentLeft > 25) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };
  
  return (
    <div className={cn("flex items-center font-mono text-lg", getTimerColor())}>
      <Clock className="h-5 w-5 mr-2" />
      <span>{formattedTime}</span>
    </div>
  );
}
