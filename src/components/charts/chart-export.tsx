"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Download, Code, FileText, Share2 } from "lucide-react"
import { toast } from "sonner"

interface ChartExportProps {
  chart: any
}

export default function ChartExport({ chart }: ChartExportProps) {
  const [exportFormat, setExportFormat] = useState("json")
  const [embedCode, setEmbedCode] = useState("")

  const generateEmbedCode = () => {
    if (!chart) return ""

    const code = `
<div id="chart-${chart.id || "preview"}" style="width: ${chart.width || 600}px; height: ${chart.height || 400}px;">
  <!-- Chart will be rendered here -->
</div>

<script>
// Chart configuration
const chartConfig = ${JSON.stringify(chart, null, 2)};

// Render chart function
function renderChart(config) {
  // Your chart rendering logic here
  console.log('Rendering chart:', config);
}

// Initialize chart
renderChart(chartConfig);
</script>
    `.trim()

    return code
  }

  const handleExport = () => {
    if (!chart) {
      toast("No chart to export")
      return
    }

    let content = ""
    let filename = ""
    let mimeType = ""

    switch (exportFormat) {
      case "json":
        content = JSON.stringify(chart, null, 2)
        filename = `${chart.title.replace(/\s+/g, "_")}.json`
        mimeType = "application/json"
        break

      case "csv":
        const headers = ["Label", "Value"]
        const rows = chart.data.map((item: any) => [item.label, item.value])
        content = [headers, ...rows].map((row) => row.join(",")).join("\n")
        filename = `${chart.title.replace(/\s+/g, "_")}.csv`
        mimeType = "text/csv"
        break

      case "html":
        content = `
<!DOCTYPE html>
<html>
<head>
    <title>${chart.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .chart-container { max-width: ${chart.width || 600}px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="chart-container">
        <h1>${chart.title}</h1>
        ${chart.description ? `<p>${chart.description}</p>` : ""}
        <div id="chart"></div>
    </div>
    
    ${generateEmbedCode()}
</body>
</html>
        `.trim()
        filename = `${chart.title.replace(/\s+/g, "_")}.html`
        mimeType = "text/html"
        break

      default:
        return
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)

    toast(`Chart exported as ${exportFormat.toUpperCase()}`)
  }

  const handleCopyEmbedCode = () => {
    const code = generateEmbedCode()
    navigator.clipboard.writeText(code)
    toast("Embed code copied to clipboard")
  }

  const handleShareChart = () => {
    if (!chart) return

    const shareData = {
      title: chart.title,
      text: chart.description || "Check out this chart",
      url: window.location.href,
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast("Chart URL copied to clipboard")
    }
  }

  if (!chart) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Export Chart</CardTitle>
          <CardDescription>Create or select a chart to export</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No chart available for export</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Export your chart in various formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{chart.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary">{chart.type}</Badge>
                  <span className="text-sm text-muted-foreground">{chart.data.length} data points</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Export Format</label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">
                      <div className="flex items-center space-x-2">
                        <Code className="h-4 w-4" />
                        <span>JSON</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>CSV</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="html">
                      <div className="flex items-center space-x-2">
                        <Code className="h-4 w-4" />
                        <span>HTML</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleExport} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Chart
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Embed Code</CardTitle>
          <CardDescription>Copy this code to embed the chart in your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={generateEmbedCode()} readOnly rows={12} className="font-mono text-sm" />
          <div className="flex space-x-2">
            <Button onClick={handleCopyEmbedCode} variant="outline" className="flex-1">
              <Code className="h-4 w-4 mr-2" />
              Copy Embed Code
            </Button>
            <Button onClick={handleShareChart} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Formats</CardTitle>
          <CardDescription>Available export options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Code className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium">JSON</h4>
              </div>
              <p className="text-sm text-muted-foreground">Export chart configuration as JSON for programmatic use</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-5 w-5 text-green-500" />
                <h4 className="font-medium">CSV</h4>
              </div>
              <p className="text-sm text-muted-foreground">Export chart data as CSV for spreadsheet applications</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Code className="h-5 w-5 text-purple-500" />
                <h4 className="font-medium">HTML</h4>
              </div>
              <p className="text-sm text-muted-foreground">Export as standalone HTML page with embedded chart</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
