"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for the charts
const hourlyData = [
  { hour: "00:00", visits: 120 },
  { hour: "01:00", visits: 80 },
  { hour: "02:00", visits: 40 },
  { hour: "03:00", visits: 30 },
  { hour: "04:00", visits: 20 },
  { hour: "05:00", visits: 25 },
  { hour: "06:00", visits: 45 },
  { hour: "07:00", visits: 100 },
  { hour: "08:00", visits: 220 },
  { hour: "09:00", visits: 380 },
  { hour: "10:00", visits: 450 },
  { hour: "11:00", visits: 420 },
  { hour: "12:00", visits: 380 },
  { hour: "13:00", visits: 400 },
  { hour: "14:00", visits: 450 },
  { hour: "15:00", visits: 420 },
  { hour: "16:00", visits: 380 },
  { hour: "17:00", visits: 340 },
  { hour: "18:00", visits: 280 },
  { hour: "19:00", visits: 220 },
  { hour: "20:00", visits: 180 },
  { hour: "21:00", visits: 170 },
  { hour: "22:00", visits: 150 },
  { hour: "23:00", visits: 130 },
]

const dailyData = [
  { day: "Mon", visits: 2500 },
  { day: "Tue", visits: 2700 },
  { day: "Wed", visits: 2800 },
  { day: "Thu", visits: 2600 },
  { day: "Fri", visits: 2400 },
  { day: "Sat", visits: 1800 },
  { day: "Sun", visits: 1600 },
]

const monthlyData = [
  { month: "Jan", visits: 45000 },
  { month: "Feb", visits: 42000 },
  { month: "Mar", visits: 50000 },
  { month: "Apr", visits: 52000 },
  { month: "May", visits: 48000 },
  { month: "Jun", visits: 55000 },
  { month: "Jul", visits: 60000 },
  { month: "Aug", visits: 58000 },
  { month: "Sep", visits: 53000 },
  { month: "Oct", visits: 56000 },
  { month: "Nov", visits: 51000 },
  { month: "Dec", visits: 48000 },
]

export default function TimeUsageChart() {
  const [chartType, setChartType] = useState("bar")

  // Find the maximum value for scaling
  const maxHourlyVisits = Math.max(...hourlyData.map((d) => d.visits))
  const maxDailyVisits = Math.max(...dailyData.map((d) => d.visits))
  const maxMonthlyVisits = Math.max(...monthlyData.map((d) => d.visits))

  // Function to render bar chart
  const renderBarChart = (data: any[], labelKey: string, valueKey: string, maxValue: number) => {
    return (
      <div className="h-64 flex items-end space-x-1">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-primary rounded-t"
              style={{
                height: `${(item[valueKey] / maxValue) * 100}%`,
                minHeight: "1px",
              }}
            ></div>
            <div className="text-xs mt-1 rotate-45 origin-left truncate">{item[labelKey]}</div>
          </div>
        ))}
      </div>
    )
  }

  // Function to render line chart
  const renderLineChart = (data: any[], labelKey: string, valueKey: string, maxValue: number) => {
    const points = data
      .map((item, index) => {
        const x = (index / (data.length - 1)) * 100
        const y = 100 - (item[valueKey] / maxValue) * 100
        return `${x},${y}`
      })
      .join(" ")

    return (
      <div className="h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
        </svg>

        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs">
          {data.map((item, index) => (
            <div key={index} className={index % 3 === 0 ? "block" : "hidden sm:block"}>
              {item[labelKey]}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="hourly">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="hourly" className="pt-4">
          {chartType === "bar"
            ? renderBarChart(hourlyData, "hour", "visits", maxHourlyVisits)
            : renderLineChart(hourlyData, "hour", "visits", maxHourlyVisits)}
        </TabsContent>

        <TabsContent value="daily" className="pt-4">
          {chartType === "bar"
            ? renderBarChart(dailyData, "day", "visits", maxDailyVisits)
            : renderLineChart(dailyData, "day", "visits", maxDailyVisits)}
        </TabsContent>

        <TabsContent value="monthly" className="pt-4">
          {chartType === "bar"
            ? renderBarChart(monthlyData, "month", "visits", maxMonthlyVisits)
            : renderLineChart(monthlyData, "month", "visits", maxMonthlyVisits)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
