"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

// Mock sales data
const salesData = {
  daily: {
    revenue: 12580,
    orders: 156,
    customers: 142,
    averageOrder: 80.64,
    comparedToYesterday: 8.5,
  },
  weekly: {
    revenue: 86240,
    orders: 1024,
    customers: 876,
    averageOrder: 84.22,
    comparedToLastWeek: 12.3,
  },
  monthly: {
    revenue: 342560,
    orders: 4256,
    customers: 3128,
    averageOrder: 80.49,
    comparedToLastMonth: -3.2,
  },
}

export default function SalesWidget() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getComparisonText = () => {
    const data = salesData[timeframe]
    const comparisonValue =
      timeframe === "daily"
        ? (data as any).comparedToYesterday
        : timeframe === "weekly"
          ? (data as any).comparedToLastWeek
          : (data as any).comparedToLastMonth

    const isPositive = comparisonValue > 0

    return (
      <div
        className={`flex items-center ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
      >
        {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
        <span>
          {Math.abs(comparisonValue)}% from{" "}
          {timeframe === "daily" ? "yesterday" : timeframe === "weekly" ? "last week" : "last month"}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="daily" onValueChange={(value) => setTimeframe(value as any)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Revenue</div>
          <div className="text-2xl font-bold">{formatCurrency(salesData[timeframe].revenue)}</div>
          {getComparisonText()}
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Orders</div>
          <div className="text-2xl font-bold">{salesData[timeframe].orders}</div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Customers</div>
          <div className="text-2xl font-bold">{salesData[timeframe].customers}</div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Average Order</div>
          <div className="text-2xl font-bold">{formatCurrency(salesData[timeframe].averageOrder)}</div>
        </div>
      </div>

      {/* Simple bar chart visualization */}
      <div className="pt-4">
        <div className="text-sm font-medium mb-2">Revenue Trend</div>
        <div className="flex items-end h-24 space-x-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const height = Math.floor(Math.random() * 100)
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t ${i === 3 ? "bg-primary" : "bg-primary/60"}`}
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs mt-1">{["M", "T", "W", "T", "F", "S", "S"][i]}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
