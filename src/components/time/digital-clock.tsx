"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DigitalClock() {
  const [time, setTime] = useState(new Date())
  const [timezone, setTimezone] = useState("local")

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const formatTimeWithTimezone = () => {
    if (timezone === "local") {
      return time.toLocaleTimeString()
    }

    // Convert to specified timezone
    const options = { timeZone: timezone, hour: "2-digit", minute: "2-digit", second: "2-digit" }
    return time.toLocaleTimeString(undefined, options as any)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-4xl font-mono font-bold bg-secondary p-4 rounded-lg w-full text-center">
        {formatTimeWithTimezone()}
      </div>

      <Select value={timezone} onValueChange={setTimezone}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="local">Local Time</SelectItem>
          <SelectItem value="UTC">UTC</SelectItem>
          <SelectItem value="America/New_York">EST (New York)</SelectItem>
          <SelectItem value="America/Los_Angeles">PST (Los Angeles)</SelectItem>
          <SelectItem value="Europe/London">GMT (London)</SelectItem>
          <SelectItem value="Asia/Tokyo">JST (Tokyo)</SelectItem>
          <SelectItem value="Asia/Singapore">SGT (Singapore)</SelectItem>
        </SelectContent>
      </Select>

      <div className="text-sm text-muted-foreground">
        {time.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </div>
    </div>
  )
}
