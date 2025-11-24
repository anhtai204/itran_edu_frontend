"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, RefreshCw, X } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

interface MatchingProps {
  question: {
    id: string
    text: string
    items: Array<{
      id: string
      left: string
      right: string
    }>
  }
  currentAnswers: Record<string, string> | null
  onAnswerSelect: (answers: Record<string, string>) => void
  showResult: boolean
  correctAnswers?: Record<string, string>
}

export function Matching({ question, currentAnswers, onAnswerSelect, showResult, correctAnswers }: MatchingProps) {
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [leftItems, setLeftItems] = useState<Array<{ id: string; content: string }>>([])
  const [rightItems, setRightItems] = useState<Array<{ id: string; content: string; matched?: boolean }>>([])
  const [matchedPairs, setMatchedPairs] = useState<Array<{ leftId: string; rightId: string }>>([])

  // Initialize from currentAnswers
  useEffect(() => {
    if (currentAnswers) {
      setMatches(currentAnswers)

      // Update matched pairs based on currentAnswers
      const pairs = Object.entries(currentAnswers).map(([leftId, rightId]) => ({
        leftId,
        rightId,
      }))
      setMatchedPairs(pairs)

      // Mark matched items
      setRightItems((prev) =>
        prev.map((item) => ({
          ...item,
          matched: Object.values(currentAnswers).includes(item.id),
        })),
      )
    }
  }, [currentAnswers])

  // Initialize items
  useEffect(() => {
    // Set up left items
    setLeftItems(
      question.items.map((item) => ({
        id: item.id,
        content: item.left,
      })),
    )

    // Set up right items and shuffle them
    const rightItemsData = question.items.map((item) => ({
      id: item.id,
      content: item.right,
      matched: false,
    }))
    setRightItems(shuffleArray([...rightItemsData]))
  }, [question.items])

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

    // If dragging from right to left (matching)
    if (source.droppableId === "right-items" && destination.droppableId.startsWith("left-drop-")) {
      const leftId = destination.droppableId.replace("left-drop-", "")
      const rightId = draggableId

      // Update matches
      const newMatches = { ...matches, [leftId]: rightId }
      setMatches(newMatches)
      onAnswerSelect(newMatches)

      // Update matched pairs
      const newMatchedPairs = [...matchedPairs.filter((pair) => pair.leftId !== leftId), { leftId, rightId }]
      setMatchedPairs(newMatchedPairs)

      // Mark right item as matched
      setRightItems((prev) => prev.map((item) => (item.id === rightId ? { ...item, matched: true } : item)))
    }
    // If reordering within the right column
    else if (source.droppableId === "right-items" && destination.droppableId === "right-items") {
      const reorderedItems = Array.from(rightItems)
      const [removed] = reorderedItems.splice(source.index, 1)
      reorderedItems.splice(destination.index, 0, removed)

      setRightItems(reorderedItems)
    }
    // If dragging from a matched position back to right column (unmatching)
    else if (source.droppableId.startsWith("left-drop-") && destination.droppableId === "right-items") {
      const leftId = source.droppableId.replace("left-drop-", "")
      const rightId = draggableId.replace("matched-", "")

      // Remove from matches
      const newMatches = { ...matches }
      delete newMatches[leftId]
      setMatches(newMatches)
      onAnswerSelect(newMatches)

      // Update matched pairs
      const newMatchedPairs = matchedPairs.filter((pair) => pair.leftId !== leftId)
      setMatchedPairs(newMatchedPairs)

      // Mark right item as unmatched
      setRightItems((prev) => prev.map((item) => (item.id === rightId ? { ...item, matched: false } : item)))
    }
  }

  const resetMatches = () => {
    setMatches({})
    setMatchedPairs([])
    onAnswerSelect({})

    // Reset matched status
    setRightItems((prev) => prev.map((item) => ({ ...item, matched: false })))
  }

  const isCorrectMatch = (leftId: string) => {
    if (!showResult || !correctAnswers) return false

    const rightId = matches[leftId]
    const correctRightId = correctAnswers[leftId]

    return rightId === correctRightId
  }

  const getMatchedRightItem = (leftId: string) => {
    const rightId = matches[leftId]
    return rightItems.find((item) => item.id === rightId)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="mt-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
          {/* Left column */}
          <div className="w-full md:w-1/2 space-y-3">
            {leftItems.map((leftItem) => {
              const isMatched = leftItem.id in matches
              const matchedRightItem = getMatchedRightItem(leftItem.id)
              const isCorrect = showResult && isCorrectMatch(leftItem.id)

              return (
                <div key={`left-${leftItem.id}`} className="relative">
                  <div
                    className={cn(
                      "p-3 rounded-md border border-gray-200 dark:border-gray-700 transition-colors",
                      isMatched && !showResult && "bg-primary/10 border-primary/30",
                      showResult &&
                        isCorrect &&
                        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
                      showResult &&
                        isMatched &&
                        !isCorrect &&
                        "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900",
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span>{leftItem.content}</span>
                      {isMatched && (
                        <div className="flex items-center">
                          <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                          <span>{matchedRightItem?.content}</span>
                          {showResult &&
                            (isCorrect ? (
                              <Check className="h-4 w-4 ml-2 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 ml-2 text-red-500" />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {!isMatched && !showResult && (
                    <Droppable droppableId={`left-drop-${leftItem.id}`} direction="horizontal">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "absolute inset-0 rounded-md border-2 border-dashed",
                            snapshot.isDraggingOver ? "border-primary bg-primary/5" : "border-transparent",
                          )}
                        >
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}

                  {isMatched && !showResult && (
                    <Droppable droppableId={`left-drop-${leftItem.id}`} direction="horizontal">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="absolute inset-0 opacity-0"
                        >
                          <Draggable draggableId={`matched-${matches[leftItem.id]}`} index={0}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="absolute inset-0 opacity-0"
                              />
                            )}
                          </Draggable>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right column */}
          <div className="w-full md:w-1/2">
            <Droppable droppableId="right-items">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 min-h-[200px]"
                >
                  {rightItems.map(
                    (item, index) =>
                      !item.matched && (
                        <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={showResult}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "p-3 rounded-md border border-gray-200 dark:border-gray-700 transition-colors",
                                snapshot.isDragging && "ring-2 ring-primary shadow-lg",
                                !showResult && "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-grab",
                              )}
                            >
                              {item.content}
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
        </div>

        {!showResult && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={resetMatches} disabled={Object.keys(matches).length === 0}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm lại
            </Button>
          </div>
        )}

        {showResult && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h4 className="font-medium mb-2">Đáp án đúng:</h4>
            <div className="space-y-2">
              {question.items.map((item) => {
                const correctRightItem = question.items.find((i) => i.id === correctAnswers?.[item.id])

                return (
                  <div key={`correct-${item.id}`} className="flex items-center">
                    <span className="font-medium">{item.left}</span>
                    <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span>{correctRightItem?.right || "?"}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  )
}
