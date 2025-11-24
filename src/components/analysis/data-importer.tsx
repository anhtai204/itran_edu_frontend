"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Database, Globe } from "lucide-react"
import { toast } from "sonner"

interface DataImporterProps {
  onDataImport: (data: any[], columns: string[]) => void
}

export default function DataImporter({ onDataImport }: DataImporterProps) {
  const [csvText, setCsvText] = useState("")
  const [jsonText, setJsonText] = useState("")
  const [apiUrl, setApiUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) return { data: [], columns: [] }

    const columns = lines[0].split(",").map((col) => col.trim().replace(/"/g, ""))
    const data = lines.slice(1).map((line) => {
      const values = line.split(",").map((val) => val.trim().replace(/"/g, ""))
      const row: any = {}
      columns.forEach((col, index) => {
        const value = values[index] || ""
        // Try to parse as number
        const numValue = Number.parseFloat(value)
        row[col] = !isNaN(numValue) && value !== "" ? numValue : value
      })
      return row
    })

    return { data, columns }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (file.type === "application/json") {
        try {
          const jsonData = JSON.parse(text)
          const data = Array.isArray(jsonData) ? jsonData : [jsonData]
          const columns = data.length > 0 ? Object.keys(data[0]) : []
          onDataImport(data, columns)
          toast("JSON file imported successfully" )
        } catch (error) {
          toast("Invalid JSON file")
        }
      } else {
        const { data, columns } = parseCSV(text)
        onDataImport(data, columns)
        toast("CSV file imported successfully" )
      }
    }
    reader.readAsText(file)
  }

  const handleCSVImport = () => {
    if (!csvText.trim()) {
      toast("Please enter CSV data")
      return
    }

    const { data, columns } = parseCSV(csvText)
    onDataImport(data, columns)
    toast("CSV data imported successfully")
  }

  const handleJSONImport = () => {
    if (!jsonText.trim()) {
      toast("Please enter JSON data")
      return
    }

    try {
      const jsonData = JSON.parse(jsonText)
      const data = Array.isArray(jsonData) ? jsonData : [jsonData]
      const columns = data.length > 0 ? Object.keys(data[0]) : []
      onDataImport(data, columns)
      toast("JSON data imported successfully")
    } catch (error) {
      toast("Invalid JSON format")
    }
  }

  const handleAPIImport = async () => {
    if (!apiUrl.trim()) {
      toast("Please enter API URL")
      return
    }

    try {
      const response = await fetch(apiUrl)
      const jsonData = await response.json()
      const data = Array.isArray(jsonData) ? jsonData : [jsonData]
      const columns = data.length > 0 ? Object.keys(data[0]) : []
      onDataImport(data, columns)
      toast("API data imported successfully")
    } catch (error) {
      toast("Failed to fetch data from API")
    }
  }

  const sampleData = () => {
    const data = [
      { name: "John", age: 25, salary: 50000, department: "IT" },
      { name: "Jane", age: 30, salary: 60000, department: "HR" },
      { name: "Bob", age: 35, salary: 70000, department: "Finance" },
      { name: "Alice", age: 28, salary: 55000, department: "IT" },
      { name: "Charlie", age: 32, salary: 65000, department: "Marketing" },
    ]
    const columns = Object.keys(data[0])
    onDataImport(data, columns)
    toast("Sample data loaded")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Your Data</CardTitle>
          <CardDescription>Upload files, paste data, or fetch from API to start your analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="file" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="file">File Upload</TabsTrigger>
              <TabsTrigger value="csv">CSV Text</TabsTrigger>
              <TabsTrigger value="json">JSON Text</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Upload CSV or JSON file</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv,.json"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Supported formats: CSV, JSON</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="csv" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv">Paste CSV data</Label>
                  <Textarea
                    id="csv"
                    placeholder="name,age,salary&#10;John,25,50000&#10;Jane,30,60000"
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    rows={8}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleCSVImport} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Import CSV Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="json" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="json">Paste JSON data</Label>
                  <Textarea
                    id="json"
                    placeholder='[{"name": "John", "age": 25, "salary": 50000}]'
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    rows={8}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleJSONImport} className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Import JSON Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api">API URL</Label>
                  <Input
                    id="api"
                    placeholder="https://api.example.com/data"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleAPIImport} className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  Fetch from API
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t">
            <Button variant="outline" onClick={sampleData} className="w-full">
              Load Sample Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
