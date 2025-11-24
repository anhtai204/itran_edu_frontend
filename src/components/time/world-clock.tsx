"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Predefined list of major cities and their timezones
const CITIES = [
  { name: "New York", timezone: "America/New_York" },
  { name: "Los Angeles", timezone: "America/Los_Angeles" },
  { name: "London", timezone: "Europe/London" },
  { name: "Paris", timezone: "Europe/Paris" },
  { name: "Tokyo", timezone: "Asia/Tokyo" },
  { name: "Sydney", timezone: "Australia/Sydney" },
  { name: "Singapore", timezone: "Asia/Singapore" },
  { name: "Dubai", timezone: "Asia/Dubai" },
  { name: "Moscow", timezone: "Europe/Moscow" },
  { name: "Rio de Janeiro", timezone: "America/Sao_Paulo" },
]

export default function WorldClock() {
  const [selectedCities, setSelectedCities] = useState([
    { name: "New York", timezone: "America/New_York" },
    { name: "London", timezone: "Europe/London" },
    { name: "Tokyo", timezone: "Asia/Tokyo" },
  ])
  const [newCity, setNewCity] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  })

  const addCity = () => {
    if (newCity && !selectedCities.some((city) => city.name === newCity)) {
      const cityToAdd = CITIES.find((city) => city.name === newCity)
      if (cityToAdd) {
        setSelectedCities([...selectedCities, cityToAdd])
        setNewCity("")
      }
    }
  }

  const removeCity = (cityName: string) => {
    setSelectedCities(selectedCities.filter((city) => city.name !== cityName))
  }

  const getTimeInTimezone = (timezone: string) => {
    try {
      return currentTime.toLocaleTimeString(undefined, {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    } catch (error) {
      return "Invalid timezone"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select value={newCity} onValueChange={setNewCity}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Add a city" />
          </SelectTrigger>
          <SelectContent>
            {CITIES.filter((city) => !selectedCities.some((sc) => sc.name === city.name)).map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addCity} disabled={!newCity}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {selectedCities.map((city) => (
          <Card key={city.name}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <div className="font-medium">{city.name}</div>
                <div className="text-xl font-mono">{getTimeInTimezone(city.timezone)}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeCity(city.name)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
