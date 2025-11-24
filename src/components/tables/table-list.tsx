"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, Copy, Download, Search } from "lucide-react"

interface TableListProps {
  onTableSelect: (table: any) => void
}

export default function TableList({ onTableSelect }: TableListProps) {
  const [tables, setTables] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const savedTables = JSON.parse(localStorage.getItem("tables") || "[]")
    setTables(savedTables)
  }, [])

  const filteredTables = tables.filter(
    (table) =>
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const deleteTable = (id: string) => {
    const updatedTables = tables.filter((table) => table.id !== id)
    setTables(updatedTables)
    localStorage.setItem("tables", JSON.stringify(updatedTables))
  }

  const duplicateTable = (table: any) => {
    const newTable = {
      ...table,
      id: `table_${Date.now()}`,
      name: `${table.name} (Copy)`,
      createdAt: new Date().toISOString(),
    }
    const updatedTables = [...tables, newTable]
    setTables(updatedTables)
    localStorage.setItem("tables", JSON.stringify(updatedTables))
  }

  const exportTable = (table: any) => {
    const dataStr = JSON.stringify(table, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `${table.name.replace(/\s+/g, "_")}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>

      {filteredTables.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">
              {searchTerm
                ? "No tables found matching your search."
                : "No tables created yet. Start by building your first table!"}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTables.map((table) => (
            <Card key={table.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{table.name}</CardTitle>
                    <CardDescription className="mt-1">{table.description || "No description"}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{table.columns.length} columns</Badge>
                    <Badge variant="outline">{table.rows.length} rows</Badge>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(table.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onTableSelect(table)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => duplicateTable(table)}>
                      <Copy className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => exportTable(table)}>
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => deleteTable(table.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
