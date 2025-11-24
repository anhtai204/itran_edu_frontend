"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Upload } from "lucide-react"

interface ImageMatchingFormProps {
  initialData?: any
  onSubmit: (data: any) => void
}

export default function ImageMatchingForm({ initialData, onSubmit }: ImageMatchingFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [text, setText] = useState(initialData?.text || "")
  const [images, setImages] = useState<string[]>(
    initialData?.images || ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
  )
  const [labels, setLabels] = useState<string[]>(initialData?.labels || ["", ""])

  const handleAddPair = () => {
    setImages([...images, "/placeholder.svg?height=100&width=100"])
    setLabels([...labels, ""])
  }

  const handleRemovePair = (index: number) => {
    if (images.length <= 2) return

    const newImages = [...images]
    const newLabels = [...labels]

    newImages.splice(index, 1)
    newLabels.splice(index, 1)

    setImages(newImages)
    setLabels(newLabels)
  }

  const handleLabelChange = (index: number, value: string) => {
    const newLabels = [...labels]
    newLabels[index] = value
    setLabels(newLabels)
  }

  const handleImageChange = (index: number, value: string) => {
    // In a real application, this would handle image uploads
    // For now, we'll just use placeholder images
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text) {
      alert("Please enter a question text")
      return
    }

    // Check if all labels are filled
    if (labels.some((label) => !label.trim())) {
      alert("Please fill in all labels")
      return
    }

    // Create pairs for the correct answers (in this case, the default matching is 1-to-1 in order)
    const correctPairs = images.map((_, index) => [index, index])

    onSubmit({
      title,
      text,
      images,
      labels,
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
          placeholder="Enter your image matching question instructions here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="space-y-4">
        <Label>Image-Label Pairs</Label>
        <p className="text-sm text-muted-foreground">
          Create pairs of images and labels that students will need to match correctly.
        </p>

        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-24 h-24 border rounded flex items-center justify-center relative">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Image ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-0 right-0 bg-background/80 rounded-full h-6 w-6"
                  onClick={() => {
                    // In a real app, this would open a file picker
                    alert("Image upload would be implemented here")
                  }}
                >
                  <Upload className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex-1">
                <Input
                  placeholder={`Label for image ${index + 1}`}
                  value={labels[index]}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  required
                />
              </div>

              {images.length > 2 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemovePair(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" size="sm" onClick={handleAddPair} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Image-Label Pair
        </Button>
      </div>

      <div className="flex justify-end">
        <Button type="submit">{initialData ? "Update Question" : "Add Question"}</Button>
      </div>
    </form>
  )
}
