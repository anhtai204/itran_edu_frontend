"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, LineChart, PieChart, ScatterChartIcon as Scatter } from "lucide-react"

interface DataVisualizationProps {
  data: any[]
  columns: string[]
}

export default function DataVisualization({ data, columns }: DataVisualizationProps) {
  const [chartType, setChartType] = useState<string>("bar")
  const [xAxis, setXAxis] = useState<string>("")
  const [yAxis, setYAxis] = useState<string>("")

  const numericColumns = useMemo(() => {
    return columns.filter((col) => data.some((row) => typeof row[col] === "number" || !isNaN(Number(row[col]))))
  }, [data, columns])

  const categoricalColumns = useMemo(() => {
    return columns.filter((col) => !numericColumns.includes(col))
  }, [columns, numericColumns])

  const chartData = useMemo(() => {
    if (!xAxis || data.length === 0) return []

    if (chartType === "pie") {
      const frequency: any = {}
      data.forEach((row) => {
        const value = row[xAxis]
        frequency[value] = (frequency[value] || 0) + 1
      })
      return Object.entries(frequency).map(([name, value]) => ({ name, value }))
    }

    if (chartType === "bar" && !yAxis) {
      const frequency: any = {}
      data.forEach((row) => {
        const value = row[xAxis]
        frequency[value] = (frequency[value] || 0) + 1
      })
      return Object.entries(frequency).map(([name, value]) => ({ name, value }))
    }

    if (yAxis) {
      return data.map((row) => ({
        name: row[xAxis],
        value: Number(row[yAxis]) || 0,
        x: Number(row[xAxis]) || 0,
        y: Number(row[yAxis]) || 0,
      }))
    }

    return []
  }, [data, xAxis, yAxis, chartType])

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Select columns to generate visualization
        </div>
      )
    }

    const maxValue = Math.max(...chartData.map((d) => (d.value as number) || 0))
    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"]

    switch (chartType) {
      case "bar":
        return (
          <div className="space-y-2">
            {chartData.slice(0, 10).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-20 text-sm truncate">{item.name}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${((item.value as number) / maxValue) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">{item.value as number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case "pie":
        const total = chartData.reduce((sum, item) => sum + (item.value as number), 0)
        let currentAngle = 0

        return (
          <div className="flex items-center justify-center">
            <svg width="300" height="300" viewBox="0 0 300 300">
              {chartData.slice(0, 8).map((item, index) => {
                const percentage = ((item.value as number) / total) * 100
                const angle = ((item.value as number) / total) * 360
                const startAngle = currentAngle
                const endAngle = currentAngle + angle
                currentAngle += angle

                const x1 = 150 + 100 * Math.cos(((startAngle - 90) * Math.PI) / 180)
                const y1 = 150 + 100 * Math.sin(((startAngle - 90) * Math.PI) / 180)
                const x2 = 150 + 100 * Math.cos(((endAngle - 90) * Math.PI) / 180)
                const y2 = 150 + 100 * Math.sin(((endAngle - 90) * Math.PI) / 180)
                const largeArc = angle > 180 ? 1 : 0

                const pathData = [`M 150 150`, `L ${x1} ${y1}`, `A 100 100 0 ${largeArc} 1 ${x2} ${y2}`, "Z"].join(" ")

                return (
                  <g key={index}>
                    <path d={pathData} fill={colors[index % colors.length]} stroke="white" strokeWidth="2" />
                    <text
                      x={150 + 60 * Math.cos(((startAngle + angle / 2 - 90) * Math.PI) / 180)}
                      y={150 + 60 * Math.sin(((startAngle + angle / 2 - 90) * Math.PI) / 180)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {percentage.toFixed(1)}%
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        )

      case "line":
        const sortedData = [...chartData].filter((d): d is { name: any; value: number; x: number; y: number } => 
          'x' in d && 'y' in d && typeof d.x === 'number' && typeof d.y === 'number'
        ).sort((a, b) => a.x - b.x)
        const maxX = Math.max(...sortedData.map((d) => d.x))
        const minX = Math.min(...sortedData.map((d) => d.x))
        const maxY = Math.max(...sortedData.map((d) => d.y))
        const minY = Math.min(...sortedData.map((d) => d.y))

        return (
          <svg width="100%" height="300" viewBox="0 0 400 300">
            <g transform="translate(50, 20)">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i}>
                  <line x1={i * 70} y1={0} x2={i * 70} y2={260} stroke="#e5e7eb" strokeWidth="1" />
                  <line x1={0} y1={i * 52} x2={280} y2={i * 52} stroke="#e5e7eb" strokeWidth="1" />
                </g>
              ))}

              {/* Line */}
              <polyline
                points={sortedData
                  .map((d) => `${((d.x - minX) / (maxX - minX)) * 280},${260 - ((d.y - minY) / (maxY - minY)) * 260}`)
                  .join(" ")}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />

              {/* Points */}
              {sortedData.map((d, i) => (
                <circle
                  key={i}
                  cx={((d.x - minX) / (maxX - minX)) * 280}
                  cy={260 - ((d.y - minY) / (maxY - minY)) * 260}
                  r="4"
                  fill="#3b82f6"
                />
              ))}
            </g>
          </svg>
        )

      case "scatter":
        const scatterData = chartData.filter((d): d is { name: any; value: number; x: number; y: number } => 
          'x' in d && 'y' in d && typeof d.x === 'number' && typeof d.y === 'number'
        )
        return (
          <svg width="100%" height="300" viewBox="0 0 400 300">
            <g transform="translate(50, 20)">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i}>
                  <line x1={i * 70} y1={0} x2={i * 70} y2={260} stroke="#e5e7eb" strokeWidth="1" />
                  <line x1={0} y1={i * 52} x2={280} y2={i * 52} stroke="#e5e7eb" strokeWidth="1" />
                </g>
              ))}

              {/* Points */}
              {scatterData.map((d, i) => (
                <circle
                  key={i}
                  cx={
                    ((d.x - Math.min(...scatterData.map((d) => d.x))) /
                      (Math.max(...scatterData.map((d) => d.x)) - Math.min(...scatterData.map((d) => d.x)))) *
                    280
                  }
                  cy={
                    260 -
                    ((d.y - Math.min(...scatterData.map((d) => d.y))) /
                      (Math.max(...scatterData.map((d) => d.y)) - Math.min(...scatterData.map((d) => d.y)))) *
                      260
                  }
                  r="4"
                  fill={colors[i % colors.length]}
                  opacity="0.7"
                />
              ))}
            </g>
          </svg>
        )

      default:
        return null
    }
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
          <CardDescription>Import data to create visualizations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available for visualization</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chart Configuration</CardTitle>
          <CardDescription>Configure your visualization settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Type</label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Bar Chart</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center space-x-2">
                      <LineChart className="h-4 w-4" />
                      <span>Line Chart</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pie">
                    <div className="flex items-center space-x-2">
                      <PieChart className="h-4 w-4" />
                      <span>Pie Chart</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="scatter">
                    <div className="flex items-center space-x-2">
                      <Scatter className="h-4 w-4" />
                      <span>Scatter Plot</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">X-Axis</label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      <div className="flex items-center space-x-2">
                        <span>{column}</span>
                        <Badge variant={numericColumns.includes(column) ? "default" : "secondary"} className="text-xs">
                          {numericColumns.includes(column) ? "num" : "cat"}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(chartType === "line" ||
              chartType === "scatter" ||
              (chartType === "bar" && categoricalColumns.includes(xAxis))) && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Y-Axis</label>
                <Select value={yAxis} onValueChange={setYAxis}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {numericColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        <div className="flex items-center space-x-2">
                          <span>{column}</span>
                          <Badge variant="default" className="text-xs">
                            num
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setXAxis("")
                  setYAxis("")
                }}
                variant="outline"
                className="w-full"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visualization</CardTitle>
          <CardDescription>
            {xAxis && `Showing ${chartType} chart for ${xAxis}${yAxis ? ` vs ${yAxis}` : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px]">{renderChart()}</div>
        </CardContent>
      </Card>

      {chartType === "pie" && chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {chartData.slice(0, 8).map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor: [
                        "#3b82f6",
                        "#ef4444",
                        "#10b981",
                        "#f59e0b",
                        "#8b5cf6",
                        "#06b6d4",
                        "#84cc16",
                        "#f97316",
                      ][index % 8],
                    }}
                  />
                  <span className="text-sm truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
