"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for charts
const generateMockData = (points: number) => {
  const data = []
  let value = 1000

  for (let i = 0; i < points; i++) {
    // Random walk algorithm with some constraints to make it look realistic
    const change = Math.random() * 200 - 100
    value = Math.max(500, Math.min(2000, value + change))
    data.push(value)
  }

  return data
}

const chartData = {
  visitors: {
    daily: generateMockData(24),
    weekly: generateMockData(7),
    monthly: generateMockData(30),
  },
  pageviews: {
    daily: generateMockData(24).map((v) => v * 2.5),
    weekly: generateMockData(7).map((v) => v * 2.5),
    monthly: generateMockData(30).map((v) => v * 2.5),
  },
  conversions: {
    daily: generateMockData(24).map((v) => v * 0.05),
    weekly: generateMockData(7).map((v) => v * 0.05),
    monthly: generateMockData(30).map((v) => v * 0.05),
  },
}

type ChartType = "line" | "bar" | "area"
type DataType = "visitors" | "pageviews" | "conversions"
type TimeFrame = "daily" | "weekly" | "monthly"

export default function ChartWidget() {
  const [chartType, setChartType] = useState<ChartType>("line")
  const [dataType, setDataType] = useState<DataType>("visitors")
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("daily")
  const [data, setData] = useState<number[]>([])

  useEffect(() => {
    setData(chartData[dataType][timeFrame])
  }, [dataType, timeFrame])

  // Find min and max for scaling
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min

  // Scale a value to fit in the chart height
  const scaleValue = (value: number) => {
    return 100 - ((value - min) / range) * 100
  }

  // Get labels based on timeframe
  const getLabels = () => {
    if (timeFrame === "daily") {
      return ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"]
    } else if (timeFrame === "weekly") {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    } else {
      return Array.from({ length: 30 }, (_, i) => (i + 1).toString())
    }
  }

  // Format data value based on type
  const formatValue = (value: number) => {
    if (!value && value !== 0) return "0"
    if (dataType === "conversions") {
      return value.toFixed(1) + "%"
    } else {
      return value.toLocaleString()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={dataType} onValueChange={(value) => setDataType(value as DataType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visitors">Visitors</SelectItem>
            <SelectItem value="pageviews">Page Views</SelectItem>
            <SelectItem value="conversions">Conversions</SelectItem>
          </SelectContent>
        </Select>

        <Tabs defaultValue="line" onValueChange={(value) => setChartType(value as ChartType)}>
          <TabsList>
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs defaultValue="daily" onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-64 relative">
        {/* Chart visualization */}
        <div className="absolute inset-0 flex items-end">
          {data.map((value, index) => {
            const scaledHeight = 100 - scaleValue(value)

            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                {chartType === "bar" && (
                  <div
                    className="w-full max-w-[20px] mx-auto bg-primary rounded-t"
                    style={{ height: `${scaledHeight}%` }}
                  ></div>
                )}

                {chartType === "line" && index > 0 && (
                  <div
                    className="absolute h-[2px] bg-primary"
                    style={{
                      width: `${100 / data.length}%`,
                      bottom: `${scaleValue(data[index - 1]) + (scaleValue(value) - scaleValue(data[index - 1])) / 2}%`,
                      left: `${(index - 0.5) * (100 / data.length)}%`,
                      transform: `rotate(${
                        Math.atan2(scaleValue(value) - scaleValue(data[index - 1]), 100 / data.length) * (180 / Math.PI)
                      }deg)`,
                      transformOrigin: "left center",
                    }}
                  ></div>
                )}

                {chartType === "line" && (
                  <div
                    className="absolute w-2 h-2 rounded-full bg-primary border-2 border-background"
                    style={{
                      bottom: `${scaleValue(value)}%`,
                      left: `${index * (100 / data.length) + 100 / data.length / 2}%`,
                      transform: "translate(-50%, 50%)",
                    }}
                  ></div>
                )}

                {chartType === "area" && (
                  <div
                    className="w-full bg-primary/20 border-t border-primary"
                    style={{ height: `${scaledHeight}%` }}
                  ></div>
                )}
              </div>
            )
          })}
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-b border-muted h-0 w-full"></div>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 inset-y-0 flex flex-col justify-between pointer-events-none text-xs text-muted-foreground">
          {[max, max - range * 0.33, max - range * 0.66, min].map((value, i) => (
            <div key={i} className="transform -translate-y-1/2">
              {formatValue(value)}
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 inset-x-0 flex justify-between pointer-events-none text-xs text-muted-foreground pt-2">
          {getLabels().map((label, i) => (
            <div key={i} className="text-center">
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div>
          <span className="font-medium">Current: </span>
          <span>{formatValue(data[data.length - 1])}</span>
        </div>
        <div>
          <span className="font-medium">Average: </span>
          <span>{formatValue(data.reduce((a, b) => a + b, 0) / data.length)}</span>
        </div>
        <div>
          <span className="font-medium">Peak: </span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  )
}
