"use client";

import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface QuizSidebarProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: number[];
  correctAnswers?: boolean[];
  allQuestionsAnswered: boolean;
  showResults: boolean;
  viewMode: "single" | "multiple";
  onSubmit: () => void;
  onQuestionSelect: (index: number) => void;
}

export function QuizSidebar({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  correctAnswers = [],
  allQuestionsAnswered,
  showResults,
  viewMode,
  onSubmit,
  onQuestionSelect,
}: QuizSidebarProps) {
  // Generate an array of question indices
  let currentShow = currentQuestion - (currentQuestion % 10);
  const questionIndices = Array.from({ length: totalQuestions }, (_, i) => i);

  return (
    <div className={viewMode === "multiple" ? "fixed" : "relative"}>
      <div className="max-h-fit bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 h-full">
        <div className="mb-4">
          <h3 className="font-medium text-lg mb-2">Danh sách câu hỏi</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Đã trả lời: {answeredQuestions.length}/{totalQuestions}
          </div>
        </div>

        <ScrollArea className="max-h-96 overflow-x-auto">
          <div className="grid grid-cols-5 gap-2 pr-4 p-1">
            {questionIndices.map((index) => {
              const isAnswered = answeredQuestions.includes(index);
              const isCurrent = index === currentQuestion;
              const isCorrect = showResults && correctAnswers[index] === true;
              const isIncorrect = showResults && correctAnswers[index] === false;
              const notSelected = !isAnswered && !isCurrent;

              const isAnsweredCorrect = isAnswered && isCorrect;
              const isAnsweredIncorrect = isAnswered && isIncorrect;

              // console.log('>>>isAnswered', isAnswered);
              // console.log('>>>isCurrent', isCurrent);
              // console.log('>>>correctAnswers[index]', correctAnswers[index]);

              console.log('>>>isCorrect', isCorrect);

              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onQuestionSelect(
                      index
                      // viewMode === "single" ? index : index - (index % 10)
                    )
                  }
                  className={cn(
                    viewMode === "single" &&
                      cn(
                        "relative h-10 font-medium transition-colors",
                        isCurrent &&
                          "ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-gray-900",
                        isAnswered &&
                          !showResults &&
                          "bg-primary/10 border-primary/30 bg-violet-500 border-indigo-500 dark:bg-indigo-200 dark:border-indigo-200",
                        showResults &&
                          isCorrect &&
                          "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
                        showResults &&
                          isIncorrect &&
                          "bg-red-200 dark:bg-red-900/20 border-red-500 dark:border-red-900",
                        showResults &&
                          notSelected &&
                          "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900",
                        showResults &&
                          isCurrent &&
                          "bg-primary/10 border-primary/30 bg-violet-500 border-indigo-500 dark:bg-indigo-200 dark:border-indigo-200"
                      ),
                    viewMode === "multiple" &&
                      cn(
                        "relative h-10 font-medium transition-colors",
                        isAnswered &&
                          !showResults &&
                          "bg-primary/10 border-primary/30 bg-violet-500 border-indigo-500 dark:bg-indigo-200 dark:border-indigo-200",
                        showResults &&
                          isCorrect &&
                          "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
                        showResults &&
                          isIncorrect &&
                          "bg-red-200 dark:bg-red-900/20 border-red-500 dark:border-red-900",
                        showResults &&
                          notSelected &&
                          "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900"
                      )
                  )}
                  aria-label={`Câu hỏi ${index + 1}`}
                >
                  {index + 1}
                  {/* {isAnswered && !showResults && (
                  <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )} */}
                  {showResults && (
                    <span
                      className={cn(
                        "absolute -top-1 -right-1 rounded-full w-4 h-4 flex items-center justify-center",
                        isAnswered
                          ? isCorrect
                            ? "bg-green-500"
                            : "bg-red-500"
                          : null
                      )}
                    >
                      {isAnswered ? (
                        isCorrect ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-white" />
                        )
                      ) : null}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        {!showResults && (
          <AlertDialog>
            <AlertDialogTrigger className="w-full h-10 text-white mt-4 rounded-md bg-primary/10 border-primary/30 bg-violet-500 border-indigo-500 dark:bg-indigo-200 dark:border-indigo-200">
              Nộp bài
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có muốn nộp bài?</AlertDialogTitle>
                <AlertDialogDescription>
                  {allQuestionsAnswered
                    ? "Bạn đã trả lời hết câu hỏi. Bạn có chắc chắn muốn nộp bài không?"
                    : "Bạn chưa trả lời hết câu hỏi. Bạn có chắc chắn muốn nộp bài không?"}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={onSubmit}>
                  Nộp bài
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {/* <Button
        // onClick={onSubmit}
        className="w-full mt-4"
      >
        Nộp bài
      </Button> */}
      </div>
    </div>
  );
}
