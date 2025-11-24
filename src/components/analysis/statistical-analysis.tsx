"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StatisticalAnalysisProps {
  data: any[]
  columns: string[]
}

export default function StatisticalAnalysis({ data, columns }: StatisticalAnalysisProps) {
  const statistics = useMemo(() => {
    if (data.length === 0) return {}

    const stats: any = {}

    columns.forEach((column) => {
      const values = data.map((row) => row[column]).filter((val) => val !== null && val !== undefined && val !== "")
      const numericValues = values.filter((val) => typeof val === "number" || !isNaN(Number(val))).map(Number)

      stats[column] = {
        type: numericValues.length > values.length * 0.8 ? "numeric" : "categorical",
        count: values.length,
        missing: data.length - values.length,
        unique: new Set(values).size,
      }

      if (stats[column].type === "numeric" && numericValues.length > 0) {
        const sorted = [...numericValues].sort((a, b) => a - b)
        const sum = numericValues.reduce((a, b) => a + b, 0)
        const mean = sum / numericValues.length
        const variance = numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numericValues.length

        stats[column] = {
          ...stats[column],
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          mean: mean,
          median:
            sorted.length % 2 === 0
              ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
              : sorted[Math.floor(sorted.length / 2)],
          std: Math.sqrt(variance),
          q1: sorted[Math.floor(sorted.length * 0.25)],
          q3: sorted[Math.floor(sorted.length * 0.75)],
        }
      } else {
        const frequency = values.reduce((acc: any, val) => {
          acc[val] = (acc[val] || 0) + 1
          return acc
        }, {})

        stats[column] = {
          ...stats[column],
          mode: Object.keys(frequency).reduce((a, b) => (frequency[a] > frequency[b] ? a : b)),
          frequency: Object.entries(frequency)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 10),
        }
      }
    })

    return stats
  }, [data, columns])

  const correlationMatrix = useMemo(() => {
    const numericColumns = columns.filter((col) => statistics[col]?.type === "numeric")
    if (numericColumns.length < 2) return null

    const matrix: any = {}

    numericColumns.forEach((col1) => {
      matrix[col1] = {}
      numericColumns.forEach((col2) => {
        const values1 = data.map((row) => Number(row[col1])).filter((val) => !isNaN(val))
        const values2 = data.map((row) => Number(row[col2])).filter((val) => !isNaN(val))

        if (values1.length === values2.length && values1.length > 0) {
          const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length
          const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length

          const numerator = values1.reduce((acc, val, i) => acc + (val - mean1) * (values2[i] - mean2), 0)
          const denominator = Math.sqrt(
            values1.reduce((acc, val) => acc + Math.pow(val - mean1, 2), 0) *
              values2.reduce((acc, val) => acc + Math.pow(val - mean2, 2), 0),
          )

          matrix[col1][col2] = denominator === 0 ? 0 : numerator / denominator
        } else {
          matrix[col1][col2] = 0
        }
      })
    })

    return matrix
  }, [data, columns, statistics])

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistical Analysis</CardTitle>
          <CardDescription>Import data to see statistical insights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available for analysis</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="descriptive">Descriptive Stats</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {columns.map((column) => (
              <Card key={column}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{column}</CardTitle>
                    <Badge variant={statistics[column]?.type === "numeric" ? "default" : "secondary"}>
                      {statistics[column]?.type || "unknown"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Count:</span>
                    <span>{statistics[column]?.count || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Missing:</span>
                    <span>{statistics[column]?.missing || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Unique:</span>
                    <span>{statistics[column]?.unique || 0}</span>
                  </div>
                  {statistics[column]?.type === "numeric" && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Mean:</span>
                        <span>{statistics[column]?.mean?.toFixed(2) || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Std:</span>
                        <span>{statistics[column]?.std?.toFixed(2) || 0}</span>
                      </div>
                    </>
                  )}
                  {statistics[column]?.type === "categorical" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mode:</span>
                      <span className="truncate">{statistics[column]?.mode || "N/A"}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="descriptive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Descriptive Statistics</CardTitle>
              <CardDescription>Detailed statistics for numeric columns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Mean</TableHead>
                    <TableHead>Std</TableHead>
                    <TableHead>Min</TableHead>
                    <TableHead>25%</TableHead>
                    <TableHead>50%</TableHead>
                    <TableHead>75%</TableHead>
                    <TableHead>Max</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {columns
                    .filter((col) => statistics[col]?.type === "numeric")
                    .map((column) => (
                      <TableRow key={column}>
                        <TableCell className="font-medium">{column}</TableCell>
                        <TableCell>{statistics[column]?.count || 0}</TableCell>
                        <TableCell>{statistics[column]?.mean?.toFixed(2) || 0}</TableCell>
                        <TableCell>{statistics[column]?.std?.toFixed(2) || 0}</TableCell>
                        <TableCell>{statistics[column]?.min?.toFixed(2) || 0}</TableCell>
                        <TableCell>{statistics[column]?.q1?.toFixed(2) || 0}</TableCell>
                        <TableCell>{statistics[column]?.median?.toFixed(2) || 0}</TableCell>
                        <TableCell>{statistics[column]?.q3?.toFixed(2) || 0}</TableCell>
                        <TableCell>{statistics[column]?.max?.toFixed(2) || 0}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          {correlationMatrix ? (
            <Card>
              <CardHeader>
                <CardTitle>Correlation Matrix</CardTitle>
                <CardDescription>Correlation coefficients between numeric variables</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variable</TableHead>
                      {Object.keys(correlationMatrix).map((col) => (
                        <TableHead key={col}>{col}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(correlationMatrix).map((row) => (
                      <TableRow key={row}>
                        <TableCell className="font-medium">{row}</TableCell>
                        {Object.keys(correlationMatrix).map((col) => (
                          <TableCell key={col}>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                Math.abs(correlationMatrix[row][col]) > 0.7
                                  ? "bg-red-100 text-red-800"
                                  : Math.abs(correlationMatrix[row][col]) > 0.3
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {correlationMatrix[row][col].toFixed(3)}
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Correlation Matrix</CardTitle>
                <CardDescription>Need at least 2 numeric columns for correlation analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Import data with numeric columns to see correlations</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
