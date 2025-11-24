"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, TrendingDown, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface DataInsightsProps {
  data: any[]
  columns: string[]
}

export default function DataInsights({ data, columns }: DataInsightsProps) {
  const insights = useMemo(() => {
    if (data.length === 0) return []

    const insights: any[] = []

    // Data quality insights
    const totalCells = data.length * columns.length
    const missingCells = columns.reduce((acc, col) => {
      return acc + data.filter((row) => row[col] === null || row[col] === undefined || row[col] === "").length
    }, 0)
    const missingPercentage = (missingCells / totalCells) * 100

    if (missingPercentage > 10) {
      insights.push({
        type: "warning",
        title: "High Missing Data",
        description: `${missingPercentage.toFixed(1)}% of your data is missing. Consider data cleaning.`,
        icon: AlertTriangle,
      })
    } else if (missingPercentage > 0) {
      insights.push({
        type: "info",
        title: "Some Missing Data",
        description: `${missingPercentage.toFixed(1)}% of your data is missing.`,
        icon: Info,
      })
    } else {
      insights.push({
        type: "success",
        title: "Complete Dataset",
        description: "No missing values detected in your dataset.",
        icon: CheckCircle,
      })
    }

    // Duplicate detection
    const duplicates = data.filter(
      (row, index, arr) => arr.findIndex((r) => JSON.stringify(r) === JSON.stringify(row)) !== index,
    ).length

    if (duplicates > 0) {
      insights.push({
        type: "warning",
        title: "Duplicate Rows",
        description: `Found ${duplicates} duplicate rows in your dataset.`,
        icon: AlertTriangle,
      })
    }

    // Numeric insights
    columns.forEach((column) => {
      const numericValues = data.map((row) => Number(row[column])).filter((val) => !isNaN(val))

      if (numericValues.length > data.length * 0.8) {
        const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length
        const std = Math.sqrt(
          numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numericValues.length,
        )

        // Outlier detection (values beyond 2 standard deviations)
        const outliers = numericValues.filter((val) => Math.abs(val - mean) > 2 * std)

        if (outliers.length > 0) {
          insights.push({
            type: "info",
            title: `Outliers in ${column}`,
            description: `Found ${outliers.length} potential outliers (values beyond 2σ).`,
            icon: TrendingUp,
          })
        }

        // Trend detection (if data appears to be time series)
        if (numericValues.length > 10) {
          const firstHalf = numericValues.slice(0, Math.floor(numericValues.length / 2))
          const secondHalf = numericValues.slice(Math.floor(numericValues.length / 2))
          const firstMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
          const secondMean = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length

          const change = ((secondMean - firstMean) / firstMean) * 100

          if (Math.abs(change) > 10) {
            insights.push({
              type: change > 0 ? "success" : "warning",
              title: `Trend in ${column}`,
              description: `${change > 0 ? "Increasing" : "Decreasing"} trend detected (${Math.abs(change).toFixed(1)}% change).`,
              icon: change > 0 ? TrendingUp : TrendingDown,
            })
          }
        }
      }
    })

    // Categorical insights
    columns.forEach((column) => {
      const values = data.map((row) => row[column]).filter((val) => val !== null && val !== undefined && val !== "")
      const unique = new Set(values)
      const uniqueRatio = unique.size / values.length

      if (uniqueRatio < 0.1 && unique.size > 1) {
        insights.push({
          type: "info",
          title: `Low Diversity in ${column}`,
          description: `Only ${unique.size} unique values out of ${values.length} records.`,
          icon: Info,
        })
      }

      if (uniqueRatio > 0.9 && values.length > 10) {
        insights.push({
          type: "info",
          title: `High Diversity in ${column}`,
          description: `${unique.size} unique values - might be an identifier column.`,
          icon: Info,
        })
      }
    })

    // Correlation insights
    const numericColumns = columns.filter((col) => {
      const numericValues = data.map((row) => Number(row[col])).filter((val) => !isNaN(val))
      return numericValues.length > data.length * 0.8
    })

    if (numericColumns.length >= 2) {
      for (let i = 0; i < numericColumns.length; i++) {
        for (let j = i + 1; j < numericColumns.length; j++) {
          const col1 = numericColumns[i]
          const col2 = numericColumns[j]

          const values1 = data.map((row) => Number(row[col1])).filter((val) => !isNaN(val))
          const values2 = data.map((row) => Number(row[col2])).filter((val) => !isNaN(val))

          if (values1.length === values2.length && values1.length > 0) {
            const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length
            const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length

            const numerator = values1.reduce((acc, val, idx) => acc + (val - mean1) * (values2[idx] - mean2), 0)
            const denominator = Math.sqrt(
              values1.reduce((acc, val) => acc + Math.pow(val - mean1, 2), 0) *
                values2.reduce((acc, val) => acc + Math.pow(val - mean2, 2), 0),
            )

            const correlation = denominator === 0 ? 0 : numerator / denominator

            if (Math.abs(correlation) > 0.7) {
              insights.push({
                type: "success",
                title: `Strong Correlation`,
                description: `${col1} and ${col2} are ${correlation > 0 ? "positively" : "negatively"} correlated (r=${correlation.toFixed(3)}).`,
                icon: TrendingUp,
              })
            }
          }
        }
      }
    }

    return insights
  }, [data, columns])

  const recommendations = useMemo(() => {
    const recs: any[] = []

    if (data.length < 100) {
      recs.push({
        title: "Small Dataset",
        description: "Consider collecting more data for more robust statistical analysis.",
        action: "Expand data collection",
      })
    }

    const numericColumns = columns.filter((col) => {
      const numericValues = data.map((row) => Number(row[col])).filter((val) => !isNaN(val))
      return numericValues.length > data.length * 0.8
    })

    if (numericColumns.length < 2) {
      recs.push({
        title: "Limited Numeric Data",
        description: "Add more numeric columns for advanced statistical analysis and correlations.",
        action: "Include numeric variables",
      })
    }

    if (columns.length > 20) {
      recs.push({
        title: "High Dimensionality",
        description: "Consider feature selection or dimensionality reduction techniques.",
        action: "Reduce dimensions",
      })
    }

    return recs
  }, [data, columns])

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Insights</CardTitle>
          <CardDescription>Import data to see automated insights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available for analysis</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Automated Insights</CardTitle>
          <CardDescription>AI-powered analysis of your dataset</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length === 0 ? (
            <p className="text-muted-foreground">No significant insights detected.</p>
          ) : (
            insights.map((insight, index) => (
              <Alert
                key={index}
                className={
                  insight.type === "warning"
                    ? "border-yellow-200 bg-yellow-50"
                    : insight.type === "success"
                      ? "border-green-200 bg-green-50"
                      : "border-blue-200 bg-blue-50"
                }
              >
                <insight.icon
                  className={`h-4 w-4 ${
                    insight.type === "warning"
                      ? "text-yellow-600"
                      : insight.type === "success"
                        ? "text-green-600"
                        : "text-blue-600"
                  }`}
                />
                <div>
                  <h4 className="font-medium">{insight.title}</h4>
                  <AlertDescription>{insight.description}</AlertDescription>
                </div>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Suggestions to improve your analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.length === 0 ? (
            <p className="text-muted-foreground">Your dataset looks good for analysis!</p>
          ) : (
            recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                  <Badge variant="outline" className="mt-2">
                    {rec.action}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dataset Summary</CardTitle>
          <CardDescription>Quick overview of your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{data.length}</div>
              <div className="text-sm text-muted-foreground">Rows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{columns.length}</div>
              <div className="text-sm text-muted-foreground">Columns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {
                  columns.filter((col) => {
                    const numericValues = data.map((row) => Number(row[col])).filter((val) => !isNaN(val))
                    return numericValues.length > data.length * 0.8
                  }).length
                }
              </div>
              <div className="text-sm text-muted-foreground">Numeric</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {
                  columns.filter((col) => {
                    const numericValues = data.map((row) => Number(row[col])).filter((val) => !isNaN(val))
                    return numericValues.length <= data.length * 0.8
                  }).length
                }
              </div>
              <div className="text-sm text-muted-foreground">Categorical</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
