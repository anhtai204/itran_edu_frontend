"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChart, LineChart, TrendingUp } from "lucide-react"
import ChartBuilder from "./chart-builder"
import ChartGallery from "./chart-gallery"
import ChartTemplates from "./chart-templates"
import ChartExport from "./chart-export"

export default function ChartsUtility() {
  const [currentChart, setCurrentChart] = useState<any>(null)
  const [savedCharts, setSavedCharts] = useState<any[]>([])

  const handleSaveChart = (chart: any) => {
    const newChart = {
      ...chart,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setSavedCharts((prev) => [...prev, newChart])
    setCurrentChart(newChart)
  }

  const handleLoadChart = (chart: any) => {
    setCurrentChart(chart)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Chart Builder</h1>
        <p className="text-muted-foreground">Create beautiful, interactive charts and data visualizations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charts Created</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedCharts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chart Types</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Export Formats</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="builder">Chart Builder</TabsTrigger>
          <TabsTrigger value="gallery">My Charts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <ChartBuilder currentChart={currentChart} onSaveChart={handleSaveChart} />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <ChartGallery
            charts={savedCharts}
            onLoadChart={handleLoadChart}
            onDeleteChart={(id) => setSavedCharts((prev) => prev.filter((c) => c.id !== id))}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <ChartTemplates onLoadTemplate={handleLoadChart} />
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <ChartExport chart={currentChart} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
