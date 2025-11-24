"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuizFormProps {
  quizData: {
    title: string
    description: string
    category?: string
    difficulty?: string
  }
  onChange: (data: any) => void
}

export default function QuizForm({ quizData, onChange }: QuizFormProps) {
  const categories = [
    "Programming",
    "Mathematics",
    "Science",
    "Language",
    "History",
    "Geography",
    "Art",
    "Music",
    "Business",
    "Other",
  ]

  const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"]

  const handleChange = (field: string, value: string) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Quiz Title</Label>
        <Input
          id="title"
          placeholder="Enter quiz title"
          value={quizData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter quiz description"
          rows={4}
          value={quizData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={quizData.category || ""} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select value={quizData.difficulty || ""} onValueChange={(value) => handleChange("difficulty", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty.toLowerCase()}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
