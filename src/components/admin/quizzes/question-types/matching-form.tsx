"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ArrowRight } from "lucide-react"

interface MatchingFormProps {
  initialData?: any
  onSubmit: (data: any) => void
}

export default function MatchingForm({ initialData, onSubmit }: MatchingFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [text, setText] = useState(initialData?.text || "")
  const [items, setItems] = useState<string[]>(initialData?.items || ["", ""])
  const [matches, setMatches] = useState<string[]>(initialData?.matches || ["", ""])

  const handleAddPair = () => {
    setItems([...items, ""])
    setMatches([...matches, ""])
  }

  const handleRemovePair = (index: number) => {
    if (items.length <= 2) return

    const newItems = [...items]
    const newMatches = [...matches]

    newItems.splice(index, 1)
    newMatches.splice(index, 1)

    setItems(newItems)
    setMatches(newMatches)
  }

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    setItems(newItems)
  }

  const handleMatchChange = (index: number, value: string) => {
    const newMatches = [...matches]
    newMatches[index] = value
    setMatches(newMatches)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text) {
      alert("Please enter a question text")
      return
    }

    // Check if all items and matches are filled
    if (items.some((item) => !item.trim()) || matches.some((match) => !match.trim())) {
      alert("Please fill in all items and matches")
      return
    }

    // Create pairs for the correct answers (in this case, the default matching is 1-to-1 in order)
    const correctPairs = items.map((_, index) => [index, index])

    onSubmit({
      title,
      text,
      items,
      matches,
      correctPairs,
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
          placeholder="Enter your matching question instructions here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="space-y-4">
        <Label>Matching Pairs</Label>
        <p className="text-sm text-muted-foreground">
          Create pairs of items that students will need to match correctly.
        </p>

        <div className="space-y-3">
          {items.map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  placeholder={`Item ${index + 1}`}
                  value={items[index]}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  required
                />
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />

              <div className="flex-1">
                <Input
                  placeholder={`Match ${index + 1}`}
                  value={matches[index]}
                  onChange={(e) => handleMatchChange(index, e.target.value)}
                  required
                />
              </div>

              {items.length > 2 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemovePair(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" size="sm" onClick={handleAddPair} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Pair
        </Button>
      </div>

      <div className="flex justify-end">
        <Button type="submit">{initialData ? "Update Question" : "Add Question"}</Button>
      </div>
    </form>
  )
}
