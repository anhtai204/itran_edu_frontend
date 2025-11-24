"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cloud, CloudRain, Sun, Wind, Snowflake } from "lucide-react"

// Mock weather data
const weatherData = {
  "New York": { temp: 72, condition: "sunny", humidity: 45, wind: 8 },
  London: { temp: 62, condition: "cloudy", humidity: 70, wind: 12 },
  Tokyo: { temp: 80, condition: "rainy", humidity: 85, wind: 5 },
  Sydney: { temp: 68, condition: "partly-cloudy", humidity: 60, wind: 15 },
  Moscow: { temp: 45, condition: "snowy", humidity: 80, wind: 20 },
}

export default function WeatherWidget() {
  const [city, setCity] = useState("New York")
  const [weather, setWeather] = useState(weatherData["New York"])

  useEffect(() => {
    // In a real app, you would fetch weather data from an API here
    setWeather(weatherData[city as keyof typeof weatherData])
  }, [city])

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-12 w-12 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-12 w-12 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-12 w-12 text-blue-500" />
      case "partly-cloudy":
        return (
          <div className="relative">
            <Sun className="h-12 w-12 text-yellow-500" />
            <Cloud className="h-8 w-8 text-gray-500 absolute -bottom-1 -right-1" />
          </div>
        )
      case "snowy":
        return <Snowflake className="h-12 w-12 text-blue-300" />
      default:
        return <Cloud className="h-12 w-12" />
    }
  }

  return (
    <div className="space-y-4">
      <Select value={city} onValueChange={setCity}>
        <SelectTrigger>
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="New York">New York</SelectItem>
          <SelectItem value="London">London</SelectItem>
          <SelectItem value="Tokyo">Tokyo</SelectItem>
          <SelectItem value="Sydney">Sydney</SelectItem>
          <SelectItem value="Moscow">Moscow</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getWeatherIcon(weather.condition)}
          <div className="text-4xl font-bold">{weather.temp}°F</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Humidity: {weather.humidity}%</div>
          <div className="text-sm text-muted-foreground flex items-center justify-end">
            <Wind className="h-3 w-3 mr-1" /> {weather.wind} mph
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 pt-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
          <div key={day} className="flex flex-col items-center">
            <div className="text-xs">{day}</div>
            {getWeatherIcon(Object.values(weatherData)[i % 5].condition)}
            <div className="text-xs font-medium">{Object.values(weatherData)[i % 5].temp}°</div>
          </div>
        ))}
      </div>
    </div>
  )
}
