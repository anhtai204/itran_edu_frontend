"use client";

import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  percentageScore: number;
  isPassed: boolean;
  timeTaken: number;
  onReview: () => void;
}

export function QuizResult({
  score,
  totalQuestions,
  percentageScore,
  isPassed,
  timeTaken,
  onReview,
}: QuizResultProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          You have completed the quiz. Here are your results:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Score</h3>
          <p className="text-3xl font-bold text-primary">
            {score} / {totalQuestions}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {percentageScore.toFixed(2)}% correct
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Time Taken</h3>
          <p className="text-3xl font-bold text-primary">
            {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total time spent
          </p>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className={`inline-block px-4 py-2 rounded-full ${
          isPassed 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          <p className="font-medium">
            {isPassed ? 'Congratulations! You passed!' : 'You did not pass this time.'}
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={onReview} className="w-full md:w-auto">
          Review Answers
        </Button>
      </div>
    </div>
  );
}
