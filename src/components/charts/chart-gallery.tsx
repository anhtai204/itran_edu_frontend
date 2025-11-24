"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Trash2, Copy, Download } from "lucide-react"
import { toast } from "sonner"

interface ChartGalleryProps {
  charts: any[]
  onLoadChart: (chart: any) => void
  onDeleteChart: (id: string) => void
}

export default function ChartGallery({ charts, onLoadChart, onDeleteChart }: ChartGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCharts = charts.filter(
    (chart) =>
      chart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chart.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCopyChart = (chart: any) => {
    const copiedChart = {
      ...chart,
      id: Date.now().toString(),
      title: `${chart.title} (Copy)`,
      createdAt: new Date().toISOString(),
    }
    onLoadChart(copiedChart)
    toast("Chart copied to builder")
  }

  const handleExportChart = (chart: any) => {
    const dataStr = JSON.stringify(chart, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${chart.title.replace(/\s+/g, "_")}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast("Chart exported successfully")
  }

  const renderMiniChart = (chart: any) => {
    const maxValue = Math.max(...chart.data.map((d: any) => d.value))

    switch (chart.type) {
      case "bar":
        return (
          <div className="space-y-1">
            {chart.data.slice(0, 4).map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-1">
                <div className="w-8 text-xs truncate">{item.label}</div>
                <div className="flex-1 bg-gray-200 rounded h-2">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: `${(item.value / maxValue) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )

      case "pie":
        const total = chart.data.reduce((sum: number, item: any) => sum + item.value, 0)
        return (
          <svg width="80" height="80" viewBox="0 0 80 80">
            {chart.data.slice(0, 5).map((item: any, index: number) => {
              const percentage = (item.value / total) * 100
              const angle = (item.value / total) * 360
              const startAngle = chart.data
                .slice(0, index)
                .reduce((acc: number, d: any) => acc + (d.value / total) * 360, 0)
              const endAngle = startAngle + angle

              const x1 = 40 + 30 * Math.cos(((startAngle - 90) * Math.PI) / 180)
              const y1 = 40 + 30 * Math.sin(((startAngle - 90) * Math.PI) / 180)
              const x2 = 40 + 30 * Math.cos(((endAngle - 90) * Math.PI) / 180)
              const y2 = 40 + 30 * Math.sin(((endAngle - 90) * Math.PI) / 180)
              const largeArc = angle > 180 ? 1 : 0

              const pathData = [`M 40 40`, `L ${x1} ${y1}`, `A 30 30 0 ${largeArc} 1 ${x2} ${y2}`, "Z"].join(" ")

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={chart.colors[index % chart.colors.length]}
                  stroke="white"
                  strokeWidth="1"
                />
              )
            })}
          </svg>
        )

      case "line":
      case "area":
        return (
          <svg width="80" height="60" viewBox="0 0 80 60">
            <polyline
              points={chart.data
                .map(
                  (d: any, i: number) => `${(i / (chart.data.length - 1)) * 70 + 5},${55 - (d.value / maxValue) * 45}`,
                )
                .join(" ")}
              fill={chart.type === "area" ? chart.colors[0] : "none"}
              fillOpacity={chart.type === "area" ? "0.3" : "0"}
              stroke={chart.colors[0]}
              strokeWidth="2"
            />
          </svg>
        )

      default:
        return <div className="w-20 h-16 bg-gray-100 rounded flex items-center justify-center text-xs">Chart</div>
    }
  }

  if (charts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Charts</CardTitle>
          <CardDescription>Your saved charts will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No charts created yet</p>
            <p className="text-sm text-muted-foreground mt-2">Create your first chart using the Chart Builder</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Charts ({charts.length})</CardTitle>
          <CardDescription>Manage your saved charts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search charts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCharts.map((chart) => (
              <Card key={chart.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium truncate">{chart.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {chart.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{chart.data.length} points</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">{renderMiniChart(chart)}</div>

                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(chart.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" onClick={() => onLoadChart(chart)} className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCopyChart(chart)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportChart(chart)}>
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDeleteChart(chart.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCharts.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No charts found matching "{searchTerm}"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
