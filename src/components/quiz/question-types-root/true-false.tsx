"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useId } from "react"
import { Check, X } from "lucide-react"

interface TrueFalseProps {
  question: {
    id: string
    text: string
    correctAnswer: boolean
  }
  currentAnswer: boolean | null
  onAnswerSelect: (answer: boolean) => void
  showResult: boolean
}

export function TrueFalse({ question, currentAnswer, onAnswerSelect, showResult }: TrueFalseProps) {
  const instanceId = useId()

  return (
    <RadioGroup
      value={currentAnswer !== null ? currentAnswer.toString() : undefined}
      onValueChange={(value) => onAnswerSelect(value === "true")}
      className="space-y-3 mt-4"
    >
      {[
        { value: "true", label: "Đúng", icon: Check },
        { value: "false", label: "Sai", icon: X },
      ].map((option) => {
        const isSelected = currentAnswer === (option.value === "true")
        const isCorrect = showResult && question.correctAnswer === (option.value === "true")
        const isIncorrect = showResult && isSelected && question.correctAnswer !== (option.value === "true")
        const optionId = `${instanceId}-option-${question.id}-${option.value}`

        return (
          <div
            key={optionId}
            className={cn(
              "flex items-center space-x-2 rounded-md border border-gray-200 dark:border-gray-700 p-3",
              isCorrect && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
              isIncorrect && "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900",
            )}
          >
            <RadioGroupItem value={option.value} id={optionId} disabled={showResult} />
            <Label htmlFor={optionId} className="flex-grow cursor-pointer flex items-center">
              <option.icon className="mr-2 h-5 w-5" />
              {option.label}
            </Label>
            {showResult && isCorrect && (
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">Đáp án đúng</span>
            )}
            {showResult && isIncorrect && (
              <span className="text-red-600 dark:text-red-400 text-sm font-medium">Đáp án sai</span>
            )}
          </div>
        )
      })}
    </RadioGroup>
  )
}
