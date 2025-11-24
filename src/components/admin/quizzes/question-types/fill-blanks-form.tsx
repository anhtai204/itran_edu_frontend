"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface FillBlanksFormProps {
  initialData?: any
  onSubmit: (data: any) => void
}

export default function FillBlanksForm({ initialData, onSubmit }: FillBlanksFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [text, setText] = useState(initialData?.text || "")
  const [preview, setPreview] = useState("")
  const [blanks, setBlanks] = useState<string[]>([])

  // Extract blanks from text whenever it changes
  useEffect(() => {
    const extractedBlanks: string[] = []
    const regex = /\[\[(.*?)\]\]/g
    let match

    while ((match = regex.exec(text)) !== null) {
      extractedBlanks.push(match[1])
    }

    setBlanks(extractedBlanks)

    // Create preview with underscores for blanks
    const previewText = text.replace(/\[\[(.*?)\]\]/g, "______")
    setPreview(previewText)
  }, [text])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text) {
      alert("Please enter a question text")
      return
    }

    if (blanks.length === 0) {
      alert("Please add at least one blank using [[answer]] format")
      return
    }

    onSubmit({
      title,
      text,
      blanks,
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

      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Use double square brackets to create blanks: [[answer]]. For example: "The capital of France is [[Paris]]."
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="text">Question Text with Blanks</Label>
        <Textarea
          id="text"
          placeholder="Enter your text with blanks using [[answer]] format"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          required
        />
      </div>

      {preview && (
        <div className="space-y-2 border p-4 rounded-md bg-muted/30">
          <Label>Preview</Label>
          <p>{preview}</p>
        </div>
      )}

      {blanks.length > 0 && (
        <div className="space-y-2">
          <Label>Detected Answers</Label>
          <div className="flex flex-wrap gap-2">
            {blanks.map((blank, index) => (
              <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {blank}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit">{initialData ? "Update Question" : "Add Question"}</Button>
      </div>
    </form>
  )
}
