"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useEffect, useId, useState } from "react";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer?: number;
}

interface QuizQuestionProps {
  questions: Question[];
  currentQuestion: number;
  answers: (number | null)[];
  onAnswerSelect: (optionIndex: number, index: number) => void;
  showResult: boolean;
  viewMode: "single" | "multiple";
}

export function QuizQuestion({
  questions,
  currentQuestion,
  answers,
  onAnswerSelect,
  showResult,
  viewMode,
}: QuizQuestionProps) {
  // Generate a unique ID for this question instance
  const instanceId = useId();

  if (viewMode === "single") {
    let question = questions[currentQuestion];
    let answer = answers[currentQuestion];
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="w-full mb-4 text-sm text-gray-500 dark:text-gray-400">
          <Label className="inline-block w-10/12">
            Câu hỏi {currentQuestion + 1} / {questions.length}
          </Label>

          <Label
            className={cn(
              "inline-block w-2/12 text-right",
              showResult &&
                answer == question.correctAnswer &&
                "text-green-500",
              showResult &&
                answer != null &&
                answer != question.correctAnswer &&
                "text-red-500",
              showResult && answer == null && "text-orange-200"
            )}
          >
            {cn(
              showResult && answer == question.correctAnswer && "Đúng",
              showResult &&
                answer != null &&
                answer != question.correctAnswer &&
                "Sai",
              showResult && answer == null && "Chưa trả lời"
            )}
          </Label>
        </div>
        <div className="flex items-start mb-4">
          <span className="flex items-center justify-center bg-primary/10 text-primary font-medium rounded-full w-8 h-8 mr-3 flex-shrink-0">
            {currentQuestion + 1}
          </span>
          <h3 className="text-lg font-medium">{question.text}</h3>
        </div>

        <RadioGroup
          key={question.id}
          value={answer !== null ? answer.toString() : undefined}
          onValueChange={(value) =>
            onAnswerSelect(Number.parseInt(value), currentQuestion)
          }
          className="space-y-3 mt-4"
        >
          {question.options.map((option, index) => {
            const isCorrect = showResult && index === question.correctAnswer;
            const isIncorrect =
              showResult &&
              answer === index &&
              index !== question.correctAnswer;
            const optionId = `${instanceId}-option-${question.id}-${index}`;

            return (
              <div
                key={optionId}
                className={cn(
                  "flex items-center space-x-2 rounded-md border border-gray-200 dark:border-gray-700 p-3",
                  isCorrect &&
                    "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
                  isIncorrect &&
                    "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900"
                )}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={optionId}
                  disabled={showResult}
                />
                <Label htmlFor={optionId} className="flex-grow cursor-pointer">
                  {option}
                </Label>
                {showResult && isCorrect && (
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                    Đáp án đúng
                  </span>
                )}
                {showResult && isIncorrect && (
                  <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                    Đáp án sai
                  </span>
                )}
              </div>
            );
          })}
        </RadioGroup>
      </div>
    );
  } else {
    let length;
    if (questions.length > currentQuestion + 10) {
      length = 10;
    } else {
      length = questions.length - currentQuestion;
    }
    return [...Array(length).keys()].map((i) => {
      let question = questions[currentQuestion + i];
      let answer = answers[currentQuestion + i];
      return (
        <div
          key={currentQuestion + i}
          className="bg-white dark:bg-gray-800 rounded-lg border borde r-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          <div className="w-full mb-4 text-sm text-gray-500 dark:text-gray-400">
            <Label className="inline-block w-10/12">
              Câu hỏi {currentQuestion + i + 1} / {questions.length}
            </Label>

            <Label
              className={cn(
                "inline-block w-2/12 text-right",
                showResult &&
                  answer == question.correctAnswer &&
                  "text-green-500",
                showResult &&
                  answer != null &&
                  answer != question.correctAnswer &&
                  "text-red-500",
                showResult && answer == null && "text-orange-200"
              )}
            >
              {cn(
                showResult && answer == question.correctAnswer && "Đúng",
                showResult &&
                  answer != null &&
                  answer != question.correctAnswer &&
                  "Sai",
                showResult && answer == null && "Chưa trả lời"
              )}
            </Label>
          </div>
          <div className="flex items-start mb-4">
            <span className="flex items-center justify-center bg-primary/10 text-primary font-medium rounded-full w-8 h-8 mr-3 flex-shrink-0">
              {currentQuestion + i + 1}
            </span>
            <h3 className="text-lg font-medium">{question.text}</h3>
          </div>

          <RadioGroup
            key={question.id}
            value={answer !== null ? answer.toString() : undefined}
            onValueChange={(value) =>
              onAnswerSelect(Number.parseInt(value), currentQuestion + i)
            }
            className="space-y-3 mt-4"
          >
            {question.options.map((option, index) => {
              const isCorrect = showResult && index === question.correctAnswer;
              const isIncorrect =
                showResult &&
                answer === index &&
                index !== question.correctAnswer;
              const optionId = `${instanceId}-option-${question.id}-${index}`;

              return (
                <div
                  key={optionId}
                  className={cn(
                    "flex items-center space-x-2 rounded-md border border-gray-200 dark:border-gray-700 p-3",
                    isCorrect &&
                      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
                    isIncorrect &&
                      "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900"
                  )}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={optionId}
                    disabled={showResult}
                  />
                  <Label
                    htmlFor={optionId}
                    className="flex-grow cursor-pointer"
                  >
                    {option}
                  </Label>
                  {showResult && isCorrect && (
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                      Đáp án đúng
                    </span>
                  )}
                  {showResult && isIncorrect && (
                    <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                      Đáp án sai
                    </span>
                  )}
                </div>
              );
            })}
          </RadioGroup>
        </div>
      );
    });
  }
}
