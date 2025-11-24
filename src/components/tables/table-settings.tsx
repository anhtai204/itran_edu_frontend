"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Download, Share } from "lucide-react"

interface TableSettingsProps {
  table: any
}

export default function TableSettings({ table }: TableSettingsProps) {
  const [settings, setSettings] = useState({
    pagination: true,
    search: true,
    sorting: true,
    filtering: true,
    export: true,
    theme: "default",
    pageSize: 10,
    showRowNumbers: false,
    allowSelection: true,
  })

  if (!table) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">Select a table to configure its settings.</div>
        </CardContent>
      </Card>
    )
  }

  const generateEmbedCode = () => {
    return `<iframe src="${window.location.origin}/embed/table/${table.id}" width="100%" height="600" frameborder="0"></iframe>`
  }

  const generateShareUrl = () => {
    return `${window.location.origin}/table/${table.id}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Table Settings</CardTitle>
            <CardDescription>Configure how your table behaves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Pagination</Label>
                <div className="text-sm text-muted-foreground">Split data into pages for better performance</div>
              </div>
              <Switch
                checked={settings.pagination}
                onCheckedChange={(checked) => setSettings({ ...settings, pagination: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Search</Label>
                <div className="text-sm text-muted-foreground">Allow users to search through table data</div>
              </div>
              <Switch
                checked={settings.search}
                onCheckedChange={(checked) => setSettings({ ...settings, search: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Sorting</Label>
                <div className="text-sm text-muted-foreground">Allow users to sort columns</div>
              </div>
              <Switch
                checked={settings.sorting}
                onCheckedChange={(checked) => setSettings({ ...settings, sorting: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Filtering</Label>
                <div className="text-sm text-muted-foreground">Allow users to filter data</div>
              </div>
              <Switch
                checked={settings.filtering}
                onCheckedChange={(checked) => setSettings({ ...settings, filtering: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Export</Label>
                <div className="text-sm text-muted-foreground">Allow users to export table data</div>
              </div>
              <Switch
                checked={settings.export}
                onCheckedChange={(checked) => setSettings({ ...settings, export: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Row Numbers</Label>
                <div className="text-sm text-muted-foreground">Display row numbers in the first column</div>
              </div>
              <Switch
                checked={settings.showRowNumbers}
                onCheckedChange={(checked) => setSettings({ ...settings, showRowNumbers: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Table Theme</Label>
              <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pageSize">Page Size</Label>
              <Select
                value={settings.pageSize.toString()}
                onValueChange={(value) => setSettings({ ...settings, pageSize: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 rows</SelectItem>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="25">25 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                  <SelectItem value="100">100 rows</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">Save Settings</Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Share & Embed</CardTitle>
            <CardDescription>Share your table or embed it on your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Share URL</Label>
              <div className="flex gap-2">
                <Input value={generateShareUrl()} readOnly className="flex-1" />
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateShareUrl())}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Embed Code</Label>
              <div className="flex gap-2">
                <textarea value={generateEmbedCode()} readOnly className="flex-1 h-20 p-2 border rounded text-sm" />
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateEmbedCode())}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Table Statistics</CardTitle>
            <CardDescription>View table usage and performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{table.rows.length}</div>
                <div className="text-sm text-muted-foreground">Total Rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{table.columns.length}</div>
                <div className="text-sm text-muted-foreground">Columns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Exports</div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
