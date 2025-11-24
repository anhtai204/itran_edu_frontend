"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"

interface MultipleChoiceFormProps {
  initialData?: any
  onSubmit: (data: any) => void
}

export default function MultipleChoiceForm({ initialData, onSubmit }: MultipleChoiceFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [text, setText] = useState(initialData?.text || "")
  const [options, setOptions] = useState<string[]>(initialData?.options || ["", "", "", ""])
  const [correctAnswers, setCorrectAnswers] = useState<number[]>(initialData?.correctAnswers || [])

  const handleAddOption = () => {
    setOptions([...options, ""])
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)

    // Update correct answers if needed
    setCorrectAnswers(correctAnswers.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleCheckboxChange = (index: number, checked: boolean) => {
    if (checked) {
      setCorrectAnswers([...correctAnswers, index])
    } else {
      setCorrectAnswers(correctAnswers.filter((i) => i !== index))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text) {
      alert("Please enter a question text")
      return
    }

    if (correctAnswers.length === 0) {
      alert("Please select at least one correct answer")
      return
    }

    onSubmit({
      title,
      text,
      options: options.filter((option) => option.trim() !== ""),
      correctAnswers,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Question Title (Optional)</Label>
        <Input
          id="title"
          placeholder="Enter a title for this question"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Question Text</Label>
        <Textarea
          id="text"
          placeholder="Enter your question here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="space-y-4">
        <Label>Answer Options (Select all correct answers)</Label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`option-${index}`}
                checked={correctAnswers.includes(index)}
                onCheckedChange={(checked) => handleCheckboxChange(index, checked === true)}
              />
              <div className="flex-1">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
              </div>
              {options.length > 2 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Option
        </Button>
      </div>

      <div className="flex justify-end">
        <Button type="submit">{initialData ? "Update Question" : "Add Question"}</Button>
      </div>
    </form>
  )
}
