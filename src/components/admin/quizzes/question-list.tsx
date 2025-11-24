"use client"

import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, Edit, Trash2, Copy, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import EditQuestionDialog from "./edit-question-dialog"

interface QuestionListProps {
  questions: any[]
  onUpdate: (id: string, question: any) => void
  onRemove: (id: string) => void
}

export default function QuestionList({ questions, onUpdate, onRemove }: QuestionListProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({})
  const [editingQuestion, setEditingQuestion] = useState<any>(null)

  const toggleExpand = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleEdit = (question: any) => {
    setEditingQuestion(question)
  }

  const handleDuplicate = (question: any) => {
    const newQuestion = {
      ...question,
      id: `question-${Date.now()}`,
      title: `${question.title} (Copy)`,
    }
    onUpdate(newQuestion.id, newQuestion)
  }

  const getQuestionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      "single-choice": "Single Choice",
      "multiple-choice": "Multiple Choice",
      "true-false": "True/False",
      matching: "Matching",
      "image-matching": "Image Matching",
      "fill-blanks": "Fill in the Blanks",
    }
    return types[type] || type
  }

  const getQuestionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "single-choice": "bg-blue-100 text-blue-800",
      "multiple-choice": "bg-purple-100 text-purple-800",
      "true-false": "bg-green-100 text-green-800",
      matching: "bg-amber-100 text-amber-800",
      "image-matching": "bg-pink-100 text-pink-800",
      "fill-blanks": "bg-cyan-100 text-cyan-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const renderQuestionPreview = (question: any) => {
    switch (question.type) {
      case "single-choice":
      case "multiple-choice":
        return (
          <div className="mt-2">
            <p className="font-medium">{question.text}</p>
            <ul className="mt-2 space-y-1">
              {question.options?.map((option: any, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                      question.correctAnswers?.includes(index)
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-600 border border-gray-300",
                    )}
                  >
                    {question.correctAnswers?.includes(index) ? "✓" : ""}
                  </span>
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      case "true-false":
        return (
          <div className="mt-2">
            <p className="font-medium">{question.text}</p>
            <p className="mt-2">
              Correct answer: <span className="font-medium">{question.correctAnswer ? "True" : "False"}</span>
            </p>
          </div>
        )
      case "matching":
        return (
          <div className="mt-2">
            <p className="font-medium">{question.text}</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-sm font-medium mb-1">Items</p>
                <ul className="space-y-1">
                  {question.items?.map((item: string, index: number) => (
                    <li key={index} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Matches</p>
                <ul className="space-y-1">
                  {question.matches?.map((match: string, index: number) => (
                    <li key={index} className="text-sm">
                      {match}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )
      case "image-matching":
        return (
          <div className="mt-2">
            <p className="font-medium">{question.text}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {question.images?.length || 0} images with {question.labels?.length || 0} labels to match
            </p>
          </div>
        )
      case "fill-blanks":
        return (
          <div className="mt-2">
            <p className="font-medium">Fill in the blanks question</p>
            <p className="mt-1">{question.text?.replace(/\[\[.*?\]\]/g, "_____")}</p>
          </div>
        )
      default:
        return <p className="text-muted-foreground">Question preview not available</p>
    }
  }

  return (
    <div className="space-y-4">
      {questions.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No questions added yet</p>
        </div>
      ) : (
        questions.map((question, index) => (
          <Draggable key={question.id} draggableId={question.id} index={index}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps} className="relative">
                <Card className="border">
                  <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <div {...provided.dragHandleProps} className="cursor-grab p-1">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Question {index + 1}</span>
                          <Badge className={cn("text-xs", getQuestionTypeColor(question.type))}>
                            {getQuestionTypeLabel(question.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {question.title || question.text?.substring(0, 60) || "Untitled question"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(question)} title="Edit question">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicate(question)}
                        title="Duplicate question"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onRemove(question.id)} title="Delete question">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpand(question.id)}
                        title={expandedQuestions[question.id] ? "Collapse" : "Expand"}
                      >
                        {expandedQuestions[question.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  {expandedQuestions[question.id] && (
                    <CardContent className="p-4 pt-0 border-t">{renderQuestionPreview(question)}</CardContent>
                  )}
                </Card>
              </div>
            )}
          </Draggable>
        ))
      )}

      {editingQuestion && (
        <EditQuestionDialog
          open={!!editingQuestion}
          onClose={() => setEditingQuestion(null)}
          question={editingQuestion}
          onSave={(updatedQuestion) => {
            onUpdate(editingQuestion.id, updatedQuestion)
            setEditingQuestion(null)
          }}
        />
      )}
    </div>
  )
}
