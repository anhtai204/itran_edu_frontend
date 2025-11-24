"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock events data
const events = [
  { id: 1, date: "2025-05-15", title: "Team Meeting", type: "work" },
  { id: 2, date: "2025-05-18", title: "Project Deadline", type: "important" },
  { id: 3, date: "2025-05-20", title: "Doctor Appointment", type: "personal" },
  { id: 4, date: "2025-05-22", title: "Conference Call", type: "work" },
  { id: 5, date: "2025-05-25", title: "Birthday Party", type: "personal" },
]

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week">("month")

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get first day of the month and total days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Get day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay()

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get events for a specific date
  const getEventsForDate = (year: number, month: number, day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateString)
  }

  // Generate calendar days
  const calendarDays: (number | null)[] = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Render month view
  const renderMonthView = () => {
    const today = new Date()
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear

    return (
      <div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium mb-2">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-20 bg-muted/20 rounded-md"></div>
            }

            const isToday = isCurrentMonth && today.getDate() === day
            const dayEvents = getEventsForDate(currentYear, currentMonth, day)

            return (
              <div
                key={`day-${day}`}
                className={`h-20 p-1 border rounded-md flex flex-col ${
                  isToday ? "bg-primary/10 border-primary" : "hover:bg-muted/20"
                }`}
              >
                <div className={`text-right ${isToday ? "font-bold" : ""}`}>{day}</div>
                <div className="flex-1 overflow-y-auto">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs truncate mt-1 rounded px-1 ${
                        event.type === "work"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : event.type === "important"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg">
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {renderMonthView()}

      <div className="flex space-x-2 text-sm">
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Work
        </Badge>
        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Important
        </Badge>
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Personal
        </Badge>
      </div>
    </div>
  )
}
