"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface TrueFalseFormProps {
  initialData?: any
  onSubmit: (data: any) => void
}

export default function TrueFalseForm({ initialData, onSubmit }: TrueFalseFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [text, setText] = useState(initialData?.text || "")
  const [correctAnswer, setCorrectAnswer] = useState<boolean>(
    initialData?.correctAnswer !== undefined ? initialData.correctAnswer : true,
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text) {
      alert("Please enter a question text")
      return
    }

    onSubmit({
      title,
      text,
      correctAnswer,
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
          placeholder="Enter your true/false question here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Correct Answer</Label>
        <RadioGroup
          value={correctAnswer ? "true" : "false"}
          onValueChange={(value) => setCorrectAnswer(value === "true")}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="true" />
            <Label htmlFor="true">True</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="false" />
            <Label htmlFor="false">False</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-end">
        <Button type="submit">{initialData ? "Update Question" : "Add Question"}</Button>
      </div>
    </form>
  )
}
