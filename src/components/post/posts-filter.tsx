"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { MultiSelect } from "@/components/ui/multi-select"

interface PostsFilterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: () => void
}

export function PostsFilter({ open, onOpenChange, onApplyFilters }: PostsFilterProps) {
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([])
  const [tags, setTags] = useState<{ label: string; value: string }[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()
  const [authors, setAuthors] = useState<{ label: string; value: string }[]>([])
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      // Use fake data directly instead of API calls
      const fakeCategories = [
        { label: "Web Development", value: "1" },
        { label: "JavaScript", value: "2" },
        { label: "Tutorials", value: "3" },
        { label: "Design", value: "4" },
        { label: "Mobile", value: "5" },
      ]
      setCategories(fakeCategories)

      const fakeTags = [
        { label: "Next.js", value: "1" },
        { label: "React", value: "2" },
        { label: "Patterns", value: "3" },
        { label: "Blog", value: "4" },
        { label: "TypeScript", value: "5" },
      ]
      setTags(fakeTags)

      // Fake authors data
      setAuthors([
        { label: "John Doe", value: "1" },
        { label: "Jane Smith", value: "2" },
        { label: "Bob Johnson", value: "3" },
      ])
    }
  }, [open])

  const handleApplyFilters = () => {
    // In a real app, you would pass these filters to the parent component
    onApplyFilters()
    onOpenChange(false)
  }

  const handleResetFilters = () => {
    setSelectedCategories([])
    setSelectedTags([])
    setDateFrom(undefined)
    setDateTo(undefined)
    setSelectedAuthors([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>
            Filter posts by multiple criteria to find exactly what you're looking for.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Categories</label>
            <MultiSelect
              options={categories}
              selected={selectedCategories}
              onChange={setSelectedCategories}
              placeholder="Select categories"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Tags</label>
            <MultiSelect options={tags} selected={selectedTags} onChange={setSelectedTags} placeholder="Select tags" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Authors</label>
            <MultiSelect
              options={authors}
              selected={selectedAuthors}
              onChange={setSelectedAuthors}
              placeholder="Select authors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Date From</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Date To</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleResetFilters}>
            <X className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

