"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

interface FillBlanksProps {
  question: {
    id: string
    text: string
    blanks: Array<{
      id: string
      correctAnswer: string
    }>
    options: string[]
  }
  currentAnswers: Record<string, string> | null
  onAnswerSelect: (answers: Record<string, string>) => void
  showResult: boolean
}

export function FillBlanks({ question, currentAnswers, onAnswerSelect, showResult }: FillBlanksProps) {
  const [filledBlanks, setFilledBlanks] = useState<Record<string, string>>({})
  const [availableOptions, setAvailableOptions] = useState<Array<{ id: string; content: string; used: boolean }>>([])

  // Process the text to identify blanks
  const textParts = useMemo(() => {
    // Use a regex that captures the entire [blankX] pattern
    const parts = []
    const regex = /(\[blank\d+\])|([^[]+)/g
    let match

    while ((match = regex.exec(question.text)) !== null) {
      if (match[1]) {
        // This is a blank
        const blankId = match[1].replace("[", "").replace("]", "")
        parts.push({ type: "blank", id: blankId })
      } else if (match[2]) {
        // This is text
        parts.push({ type: "text", content: match[2] })
      }
    }

    return parts
  }, [question.text])

  // Initialize from currentAnswers
  useEffect(() => {
    if (currentAnswers) {
      setFilledBlanks(currentAnswers)

      // Mark used options
      setAvailableOptions((prev) =>
        prev.map((option) => ({
          ...option,
          used: Object.values(currentAnswers).some((answer) => answer === option.content),
        })),
      )
    }
  }, [currentAnswers])

  // Initialize available options
  useEffect(() => {
    const options = question.options.map((option, index) => ({
      id: `option-${index}`,
      content: option,
      used: false,
    }))
    setAvailableOptions(shuffleArray([...options]))
  }, [question.options])

  // Helper function to shuffle array
  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || showResult) return

    const { source, destination, draggableId } = result

    // If dragging from options to a blank
    if (source.droppableId === "options" && destination.droppableId.startsWith("blank-")) {
      const blankId = destination.droppableId.replace("blank-", "")
      const optionId = draggableId
      const option = availableOptions.find((opt) => opt.id === optionId)

      if (!option) return

      // Update filled blanks
      const newFilledBlanks = { ...filledBlanks, [blankId]: option.content }
      setFilledBlanks(newFilledBlanks)
      onAnswerSelect(newFilledBlanks)

      // Mark option as used
      setAvailableOptions((prev) => prev.map((opt) => (opt.id === optionId ? { ...opt, used: true } : opt)))
    }

    // If dragging from a blank back to options (removing)
    else if (source.droppableId.startsWith("blank-") && destination.droppableId === "options") {
      const blankId = source.droppableId.replace("blank-", "")
      const content = filledBlanks[blankId]

      // Remove from filled blanks
      const newFilledBlanks = { ...filledBlanks }
      delete newFilledBlanks[blankId]
      setFilledBlanks(newFilledBlanks)
      onAnswerSelect(newFilledBlanks)

      // Mark option as unused
      setAvailableOptions((prev) => prev.map((opt) => (opt.content === content ? { ...opt, used: false } : opt)))
    }

    // If reordering within options
    else if (source.droppableId === "options" && destination.droppableId === "options") {
      const reorderedItems = Array.from(availableOptions)
      const [removed] = reorderedItems.splice(source.index, 1)
      reorderedItems.splice(destination.index, 0, removed)

      setAvailableOptions(reorderedItems)
    }
  }

  const resetBlanks = () => {
    setFilledBlanks({})
    onAnswerSelect({})

    // Reset all options to unused
    setAvailableOptions((prev) => prev.map((opt) => ({ ...opt, used: false })))
  }

  const isBlankFilled = (blankId: string) => {
    return blankId in filledBlanks
  }

  const isCorrectAnswer = (blankId: string) => {
    if (!showResult) return false

    const blankInfo = question.blanks.find((b) => b.id === blankId)
    if (!blankInfo) return false

    return filledBlanks[blankId] === blankInfo.correctAnswer
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="mt-4">
        {/* Text with blanks */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 leading-relaxed">
          {textParts.map((part, index) => {
            if (part.type === "text") {
              return <span key={index}>{part.content}</span>
            } else {
              const blankId = part.id
              const isFilled = isBlankFilled(blankId || "")
              const isCorrect = showResult && isCorrectAnswer(blankId || "")
              const isIncorrect = showResult && isFilled && !isCorrect

              return (
                <Droppable key={index} droppableId={`blank-${blankId}`} isDropDisabled={showResult}>
                  {(provided, snapshot) => (
                    <span
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "inline-block min-w-24 text-center mx-1 px-2 py-1 border-2 rounded-md align-middle",
                        !isFilled && "border-dashed border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-700",
                        isFilled && !showResult && "border-primary bg-primary/10",
                        showResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20",
                        showResult && isIncorrect && "border-red-500 bg-red-50 dark:bg-red-900/20",
                        snapshot.isDraggingOver && "bg-primary/5 border-primary",
                      )}
                    >
                      {isFilled ? (
                        <Draggable draggableId={`filled-${blankId}`} index={0} isDragDisabled={showResult}>
                          {(provided, snapshot) => (
                            <span
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn("inline-block w-full", !showResult && "cursor-grab")}
                            >
                              {blankId ? filledBlanks[blankId] : ""}
                            </span>
                          )}
                        </Draggable>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">Kéo thả vào đây</span>
                      )}
                      {provided.placeholder}
                    </span>
                  )}
                </Droppable>
              )
            }
          })}
        </div>

        {/* Options */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Các lựa chọn:</h4>
          <Droppable droppableId="options" direction="horizontal" isDropDisabled={showResult}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md min-h-[60px]"
              >
                {availableOptions.map(
                  (option, index) =>
                    !option.used && (
                      <Draggable key={option.id} draggableId={option.id} index={index} isDragDisabled={showResult}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700",
                              snapshot.isDragging && "ring-2 ring-primary shadow-lg",
                              !showResult && "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-grab",
                            )}
                          >
                            {option.content}
                          </div>
                        )}
                      </Draggable>
                    ),
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {!showResult && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={resetBlanks} disabled={Object.keys(filledBlanks).length === 0}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm lại
            </Button>
          </div>
        )}

        {showResult && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h4 className="font-medium mb-2">Đáp án đúng:</h4>
            <div className="space-y-2">
              {question.blanks.map((blank) => (
                <div key={`correct-${blank.id}`} className="flex items-center">
                  <span className="font-medium">{blank.id}:</span>
                  <span className="ml-2">{blank.correctAnswer}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  )
}
