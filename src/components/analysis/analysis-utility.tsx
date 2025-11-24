"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Database, FileSpreadsheet } from "lucide-react"
import DataImporter from "./data-importer"
import StatisticalAnalysis from "./statistical-analysis"
import DataVisualization from "./data-visualization"
import DataInsights from "./data-insights"

export default function AnalysisUtility() {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])

  const handleDataImport = (importedData: any[], importedColumns: string[]) => {
    setData(importedData)
    setColumns(importedColumns)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Analysis</h1>
        <p className="text-muted-foreground">
          Import, analyze, and gain insights from your data with powerful statistical tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Columns</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{columns.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Numeric Columns</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.length > 0 ? columns.filter((col) => data.some((row) => typeof row[col] === "number")).length : 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analysis Ready</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length > 0 ? "✓" : "✗"}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <DataImporter onDataImport={handleDataImport} />
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <StatisticalAnalysis data={data} columns={columns} />
        </TabsContent>

        <TabsContent value="visualization" className="space-y-4">
          <DataVisualization data={data} columns={columns} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <DataInsights data={data} columns={columns} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
