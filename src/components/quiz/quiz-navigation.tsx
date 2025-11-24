"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface QuizNavigationProps {
  currentQuestion: number
  totalQuestions: number
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  allQuestionsAnswered: boolean
  showResult: boolean
}

export function QuizNavigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  allQuestionsAnswered,
  showResult,
}: QuizNavigationProps) {
  const isLastQuestion = currentQuestion === totalQuestions - 1

  return (
    <div className="flex justify-between items-center mt-6">
      <Button
        onClick={onPrevious}
        variant="outline"
        disabled={currentQuestion === 0}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Câu trước
      </Button>

      {isLastQuestion ? (
        <Button onClick={onSubmit} disabled={!allQuestionsAnswered || showResult} className="flex items-center gap-1">
          Nộp bài
        </Button>
      ) : (
        <Button onClick={onNext} className="flex items-center gap-1">
          Câu tiếp
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
