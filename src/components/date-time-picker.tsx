"use client"

import * as React from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [selectedHour, setSelectedHour] = React.useState<string>(date ? format(date, "HH") : "12")
  const [selectedMinute, setSelectedMinute] = React.useState<string>(date ? format(date, "mm") : "00")

  // Update the parent component when any of the date/time values change
  // React.useEffect(() => {
  //   if (selectedDate) {
  //     const newDate = new Date(selectedDate)
  //     newDate.setHours(Number.parseInt(selectedHour, 10))
  //     newDate.setMinutes(Number.parseInt(selectedMinute, 10))
  //     setDate(newDate)
  //   } else {
  //     setDate(undefined)
  //   }
  // }, [selectedDate, selectedHour, selectedMinute, setDate])


  // Đồng bộ với prop date từ parent khi nó thay đổi
  React.useEffect(() => {
    if (date && date.getTime() !== selectedDate?.getTime()) {
      setSelectedDate(date);
      setSelectedHour(format(date, "HH"));
      setSelectedMinute(format(date, "mm"));
    } else if (!date && selectedDate) {
      setSelectedDate(undefined);
    }
  }, [date]);

  // Chỉ gọi setDate khi giá trị thực sự thay đổi
  React.useEffect(() => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(Number.parseInt(selectedHour, 10));
      newDate.setMinutes(Number.parseInt(selectedMinute, 10));
      // So sánh với date từ prop để tránh cập nhật dư thừa
      if (!date || newDate.getTime() !== date.getTime()) {
        setDate(newDate);
      }
    } else if (date) {
      // Nếu selectedDate bị xóa nhưng date vẫn tồn tại
      setDate(undefined);
    }
  }, [selectedDate, selectedHour, selectedMinute, setDate, date]);

  // Generate hours options (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))

  // Generate minutes options (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  return (
    <div className="flex flex-col gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
        </PopoverContent>
      </Popover>

      {selectedDate && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div className="grid grid-cols-2 gap-2">
            <Select value={selectedHour} onValueChange={setSelectedHour}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMinute} onValueChange={setSelectedMinute}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {selectedDate && (
        <Button
          variant="ghost"
          className="mt-2 text-xs h-7 text-muted-foreground"
          onClick={() => {
            setSelectedDate(undefined)
            setSelectedHour("12")
            setSelectedMinute("00")
          }}
        >
          Clear schedule
        </Button>
      )}
    </div>
  )
}

