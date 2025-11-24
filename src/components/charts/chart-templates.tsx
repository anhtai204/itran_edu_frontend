"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface ChartTemplatesProps {
  onLoadTemplate: (template: any) => void
}

export default function ChartTemplates({ onLoadTemplate }: ChartTemplatesProps) {

  const templates = [
    {
      id: "sales-monthly",
      title: "Monthly Sales Report",
      type: "bar",
      category: "Business",
      description: "Track monthly sales performance",
      data: [
        { label: "Jan", value: 45000 },
        { label: "Feb", value: 52000 },
        { label: "Mar", value: 48000 },
        { label: "Apr", value: 61000 },
        { label: "May", value: 55000 },
        { label: "Jun", value: 67000 },
      ],
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"],
      showLegend: true,
      showGrid: true,
    },
    {
      id: "market-share",
      title: "Market Share Analysis",
      type: "pie",
      category: "Business",
      description: "Visualize market share distribution",
      data: [
        { label: "Company A", value: 35 },
        { label: "Company B", value: 25 },
        { label: "Company C", value: 20 },
        { label: "Company D", value: 12 },
        { label: "Others", value: 8 },
      ],
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
      showLegend: true,
      showGrid: false,
    },
    {
      id: "website-traffic",
      title: "Website Traffic Trend",
      type: "line",
      category: "Analytics",
      description: "Monitor website traffic over time",
      data: [
        { label: "Week 1", value: 1200 },
        { label: "Week 2", value: 1350 },
        { label: "Week 3", value: 1180 },
        { label: "Week 4", value: 1420 },
        { label: "Week 5", value: 1580 },
        { label: "Week 6", value: 1650 },
      ],
      colors: ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6"],
      showLegend: false,
      showGrid: true,
    },
    {
      id: "revenue-growth",
      title: "Revenue Growth",
      type: "area",
      category: "Finance",
      description: "Track revenue growth over quarters",
      data: [
        { label: "Q1 2023", value: 125000 },
        { label: "Q2 2023", value: 142000 },
        { label: "Q3 2023", value: 158000 },
        { label: "Q4 2023", value: 175000 },
        { label: "Q1 2024", value: 192000 },
      ],
      colors: ["#06b6d4", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
      showLegend: false,
      showGrid: true,
    },
    {
      id: "survey-results",
      title: "Customer Satisfaction Survey",
      type: "bar",
      category: "Survey",
      description: "Display survey response distribution",
      data: [
        { label: "Very Satisfied", value: 45 },
        { label: "Satisfied", value: 32 },
        { label: "Neutral", value: 15 },
        { label: "Dissatisfied", value: 6 },
        { label: "Very Dissatisfied", value: 2 },
      ],
      colors: ["#10b981", "#84cc16", "#f59e0b", "#ef4444", "#dc2626"],
      showLegend: false,
      showGrid: true,
    },
    {
      id: "product-categories",
      title: "Product Category Sales",
      type: "pie",
      category: "E-commerce",
      description: "Sales breakdown by product category",
      data: [
        { label: "Electronics", value: 28 },
        { label: "Clothing", value: 22 },
        { label: "Home & Garden", value: 18 },
        { label: "Sports", value: 15 },
        { label: "Books", value: 10 },
        { label: "Others", value: 7 },
      ],
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"],
      showLegend: true,
      showGrid: false,
    },
    {
      id: "user-engagement",
      title: "Daily Active Users",
      type: "line",
      category: "Analytics",
      description: "Track daily user engagement metrics",
      data: [
        { label: "Mon", value: 2400 },
        { label: "Tue", value: 2210 },
        { label: "Wed", value: 2290 },
        { label: "Thu", value: 2000 },
        { label: "Fri", value: 2181 },
        { label: "Sat", value: 2500 },
        { label: "Sun", value: 2100 },
      ],
      colors: ["#8b5cf6", "#ef4444", "#10b981", "#f59e0b", "#3b82f6"],
      showLegend: false,
      showGrid: true,
    },
    {
      id: "budget-allocation",
      title: "Budget Allocation",
      type: "pie",
      category: "Finance",
      description: "Visualize budget distribution across departments",
      data: [
        { label: "Marketing", value: 30 },
        { label: "Development", value: 25 },
        { label: "Sales", value: 20 },
        { label: "Operations", value: 15 },
        { label: "HR", value: 10 },
      ],
      colors: ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6"],
      showLegend: true,
      showGrid: false,
    },
  ]

  const categories = [...new Set(templates.map((t) => t.category))]

  const handleLoadTemplate = (template: any) => {
    const chartConfig = {
      title: template.title,
      type: template.type,
      data: template.data,
      colors: template.colors,
      width: 600,
      height: 400,
      showLegend: template.showLegend,
      showGrid: template.showGrid,
      xAxisLabel: "",
      yAxisLabel: "",
      description: template.description,
    }

    onLoadTemplate(chartConfig)
    toast("Template loaded in Chart Builder" )
  }

  const renderMiniChart = (template: any) => {
    const maxValue = Math.max(...template.data.map((d: any) => d.value))

    switch (template.type) {
      case "bar":
        return (
          <div className="space-y-1">
            {template.data.slice(0, 4).map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-1">
                <div className="w-8 text-xs truncate">{item.label}</div>
                <div className="flex-1 bg-gray-200 rounded h-2">
                  <div
                    className="h-2 rounded"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: template.colors[index % template.colors.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )

      case "pie":
        const total = template.data.reduce((sum: number, item: any) => sum + item.value, 0)
        return (
          <svg width="80" height="80" viewBox="0 0 80 80">
            {template.data.slice(0, 5).map((item: any, index: number) => {
              const angle = (item.value / total) * 360
              const startAngle = template.data
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
                  fill={template.colors[index % template.colors.length]}
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
              points={template.data
                .map(
                  (d: any, i: number) =>
                    `${(i / (template.data.length - 1)) * 70 + 5},${55 - (d.value / maxValue) * 45}`,
                )
                .join(" ")}
              fill={template.type === "area" ? template.colors[0] : "none"}
              fillOpacity={template.type === "area" ? "0.3" : "0"}
              stroke={template.colors[0]}
              strokeWidth="2"
            />
          </svg>
        )

      default:
        return <div className="w-20 h-16 bg-gray-100 rounded flex items-center justify-center text-xs">Chart</div>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chart Templates</CardTitle>
          <CardDescription>Choose from pre-built chart templates to get started quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-semibold">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates
                    .filter((template) => template.category === category)
                    .map((template) => (
                      <Card key={template.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-sm font-medium">{template.title}</CardTitle>
                              <Badge variant="secondary" className="text-xs">
                                {template.type}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription className="text-xs">{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-center">{renderMiniChart(template)}</div>

                          <Button onClick={() => handleLoadTemplate(template)} className="w-full" size="sm">
                            Use Template
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
