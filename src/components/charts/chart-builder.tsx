"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Save, Eye } from "lucide-react"
import { toast } from "sonner"

interface ChartBuilderProps {
  currentChart: any
  onSaveChart: (chart: any) => void
}

export default function ChartBuilder({ currentChart, onSaveChart }: ChartBuilderProps) {
  const [chartConfig, setChartConfig] = useState({
    title: "",
    type: "bar",
    data: [
      { label: "Jan", value: 100 },
      { label: "Feb", value: 150 },
      { label: "Mar", value: 120 },
    ],
    colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
    width: 600,
    height: 400,
    showLegend: true,
    showGrid: true,
    xAxisLabel: "",
    yAxisLabel: "",
    description: "",
  })

  const [newDataPoint, setNewDataPoint] = useState({ label: "", value: "" })

  useEffect(() => {
    if (currentChart) {
      setChartConfig(currentChart)
    }
  }, [currentChart])

  const addDataPoint = () => {
    if (!newDataPoint.label || !newDataPoint.value) {
      toast("Please enter both label and value")
      return
    }

    const value = Number.parseFloat(newDataPoint.value)
    if (isNaN(value)) {
      toast("Value must be a number")
      return
    }

    setChartConfig((prev) => ({
      ...prev,
      data: [...prev.data, { label: newDataPoint.label, value }],
    }))

    setNewDataPoint({ label: "", value: "" })
  }

  const removeDataPoint = (index: number) => {
    setChartConfig((prev) => ({
      ...prev,
      data: prev.data.filter((_, i) => i !== index),
    }))
  }

  const updateDataPoint = (index: number, field: "label" | "value", newValue: string) => {
    setChartConfig((prev) => ({
      ...prev,
      data: prev.data.map((item, i) =>
        i === index ? { ...item, [field]: field === "value" ? Number.parseFloat(newValue) || 0 : newValue } : item,
      ),
    }))
  }

  const handleSave = () => {
    if (!chartConfig.title) {
      toast("Please enter a chart title")
      return
    }

    if (chartConfig.data.length === 0) {
      toast("Please add at least one data point")
      return
    }

    onSaveChart(chartConfig)
    toast.success("Chart saved successfully")
  }

  const renderChart = () => {
    if (chartConfig.data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
          Add data points to see chart preview
        </div>
      )
    }

    const maxValue = Math.max(...chartConfig.data.map((d) => d.value))
    const colors = chartConfig.colors

    switch (chartConfig.type) {
      case "bar":
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-center">{chartConfig.title}</h3>
            {chartConfig.data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-16 text-sm truncate">{item.label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <div
                    className="h-8 rounded-full flex items-center justify-end pr-2"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: colors[index % colors.length],
                    }}
                  >
                    <span className="text-white text-sm font-medium">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case "pie":
        const total = chartConfig.data.reduce((sum, item) => sum + item.value, 0)
        let currentAngle = 0

        return (
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">{chartConfig.title}</h3>
            <div className="flex justify-center">
              <svg width="300" height="300" viewBox="0 0 300 300">
                {chartConfig.data.map((item, index) => {
                  const percentage = (item.value / total) * 100
                  const angle = (item.value / total) * 360
                  const startAngle = currentAngle
                  const endAngle = currentAngle + angle
                  currentAngle += angle

                  const x1 = 150 + 100 * Math.cos(((startAngle - 90) * Math.PI) / 180)
                  const y1 = 150 + 100 * Math.sin(((startAngle - 90) * Math.PI) / 180)
                  const x2 = 150 + 100 * Math.cos(((endAngle - 90) * Math.PI) / 180)
                  const y2 = 150 + 100 * Math.sin(((endAngle - 90) * Math.PI) / 180)
                  const largeArc = angle > 180 ? 1 : 0

                  const pathData = [`M 150 150`, `L ${x1} ${y1}`, `A 100 100 0 ${largeArc} 1 ${x2} ${y2}`, "Z"].join(
                    " ",
                  )

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
            {chartConfig.showLegend && (
              <div className="grid grid-cols-2 gap-2">
                {chartConfig.data.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: colors[index % colors.length] }} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case "line":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">{chartConfig.title}</h3>
            <svg width="100%" height="300" viewBox="0 0 500 300">
              <g transform="translate(60, 20)">
                {chartConfig.showGrid && (
                  <>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <g key={i}>
                        <line x1={i * 85} y1={0} x2={i * 85} y2={260} stroke="#e5e7eb" strokeWidth="1" />
                        <line x1={0} y1={i * 52} x2={340} y2={i * 52} stroke="#e5e7eb" strokeWidth="1" />
                      </g>
                    ))}
                  </>
                )}

                <polyline
                  points={chartConfig.data
                    .map((d, i) => `${(i / (chartConfig.data.length - 1)) * 340},${260 - (d.value / maxValue) * 260}`)
                    .join(" ")}
                  fill="none"
                  stroke={colors[0]}
                  strokeWidth="3"
                />

                {chartConfig.data.map((d, i) => (
                  <g key={i}>
                    <circle
                      cx={(i / (chartConfig.data.length - 1)) * 340}
                      cy={260 - (d.value / maxValue) * 260}
                      r="5"
                      fill={colors[0]}
                    />
                    <text
                      x={(i / (chartConfig.data.length - 1)) * 340}
                      y={280}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#666"
                    >
                      {d.label}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        )

      case "area":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">{chartConfig.title}</h3>
            <svg width="100%" height="300" viewBox="0 0 500 300">
              <g transform="translate(60, 20)">
                {chartConfig.showGrid && (
                  <>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <g key={i}>
                        <line x1={i * 85} y1={0} x2={i * 85} y2={260} stroke="#e5e7eb" strokeWidth="1" />
                        <line x1={0} y1={i * 52} x2={340} y2={i * 52} stroke="#e5e7eb" strokeWidth="1" />
                      </g>
                    ))}
                  </>
                )}

                <polygon
                  points={[
                    "0,260",
                    ...chartConfig.data.map(
                      (d, i) => `${(i / (chartConfig.data.length - 1)) * 340},${260 - (d.value / maxValue) * 260}`,
                    ),
                    "340,260",
                  ].join(" ")}
                  fill={colors[0]}
                  fillOpacity="0.3"
                  stroke={colors[0]}
                  strokeWidth="2"
                />

                {chartConfig.data.map((d, i) => (
                  <g key={i}>
                    <circle
                      cx={(i / (chartConfig.data.length - 1)) * 340}
                      cy={260 - (d.value / maxValue) * 260}
                      r="4"
                      fill={colors[0]}
                    />
                    <text
                      x={(i / (chartConfig.data.length - 1)) * 340}
                      y={280}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#666"
                    >
                      {d.label}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Chart Configuration</CardTitle>
            <CardDescription>Configure your chart settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Chart Title</Label>
                  <Input
                    id="title"
                    value={chartConfig.title}
                    onChange={(e) => setChartConfig((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter chart title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Chart Type</Label>
                  <Select
                    value={chartConfig.type}
                    onValueChange={(value) => setChartConfig((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={chartConfig.description}
                    onChange={(e) => setChartConfig((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Chart description (optional)"
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Label"
                        value={newDataPoint.label}
                        onChange={(e) => setNewDataPoint((prev) => ({ ...prev, label: e.target.value }))}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Value"
                        type="number"
                        value={newDataPoint.value}
                        onChange={(e) => setNewDataPoint((prev) => ({ ...prev, value: e.target.value }))}
                      />
                    </div>
                    <Button onClick={addDataPoint} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {chartConfig.data.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                        <Input
                          value={item.label}
                          onChange={(e) => updateDataPoint(index, "label", e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={item.value}
                          onChange={(e) => updateDataPoint(index, "value", e.target.value)}
                          className="w-20"
                        />
                        <Button variant="outline" size="sm" onClick={() => removeDataPoint(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      type="number"
                      value={chartConfig.width}
                      onChange={(e) =>
                        setChartConfig((prev) => ({ ...prev, width: Number.parseInt(e.target.value) || 600 }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      value={chartConfig.height}
                      onChange={(e) =>
                        setChartConfig((prev) => ({ ...prev, height: Number.parseInt(e.target.value) || 400 }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color Palette</Label>
                  <div className="flex space-x-2">
                    {chartConfig.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showLegend"
                      checked={chartConfig.showLegend}
                      onChange={(e) => setChartConfig((prev) => ({ ...prev, showLegend: e.target.checked }))}
                    />
                    <Label htmlFor="showLegend">Show Legend</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showGrid"
                      checked={chartConfig.showGrid}
                      onChange={(e) => setChartConfig((prev) => ({ ...prev, showGrid: e.target.checked }))}
                    />
                    <Label htmlFor="showGrid">Show Grid</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex space-x-2">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Chart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Chart Preview</span>
            </CardTitle>
            <CardDescription>
              {chartConfig.title || "Untitled Chart"} • {chartConfig.type} • {chartConfig.data.length} data points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px] flex items-center justify-center">{renderChart()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
