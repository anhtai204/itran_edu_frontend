import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useId } from "react"

interface MultipleChoiceProps {
  question: {
    id: string
    text: string
    options: string[]
    correctAnswers: number[]
  }
  currentAnswers: number[]
  onAnswerSelect: (answers: number[]) => void
  showResult: boolean
}

export function MultipleChoice({ question, currentAnswers, onAnswerSelect, showResult }: MultipleChoiceProps) {
  const instanceId = useId()

  const handleCheckboxChange = (optionIndex: number, checked: boolean) => {
    if (checked) {
      onAnswerSelect([...currentAnswers, optionIndex])
    } else {
      onAnswerSelect(currentAnswers.filter((index) => index !== optionIndex))
    }
  }

  return (
    <div className="space-y-3 mt-4">
      {question.options.map((option, index) => {
        const isSelected = currentAnswers.includes(index)
        const isCorrect = showResult && question.correctAnswers.includes(index)
        const isIncorrect = showResult && isSelected && !question.correctAnswers.includes(index)
        const optionId = `${instanceId}-option-${question.id}-${index}`

        return (
          <div
            key={optionId}
            className={cn(
              "flex items-center space-x-2 rounded-md border border-gray-200 dark:border-gray-700 p-3",
              isCorrect && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
              isIncorrect && "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900",
            )}
          >
            <Checkbox
              id={optionId}
              checked={isSelected}
              onCheckedChange={(checked) => handleCheckboxChange(index, checked as boolean)}
              disabled={showResult}
            />
            <Label htmlFor={optionId} className="flex-grow cursor-pointer">
              {option}
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
      {showResult && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {question.correctAnswers.length > 1
            ? `Câu hỏi này có ${question.correctAnswers.length} đáp án đúng.`
            : "Câu hỏi này có 1 đáp án đúng."}
        </div>
      )}
    </div>
  )
}
