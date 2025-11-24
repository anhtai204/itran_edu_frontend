"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronUp, ChevronDown, Search, Download } from "lucide-react"
import { Label } from "@/components/ui/label"

interface TablePreviewProps {
  table: any
}

export default function TablePreview({ table }: TablePreviewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredAndSortedRows = useMemo(() => {
    if (!table) return []

    const filtered = table.rows.filter((row: any) => {
      if (!searchTerm) return true
      return table.columns.some((col: any) => {
        const value = row[col.id]
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    })

    if (sortColumn) {
      filtered.sort((a: any, b: any) => {
        const aValue = a[sortColumn] || ""
        const bValue = b[sortColumn] || ""

        if (sortDirection === "asc") {
          return aValue.toString().localeCompare(bValue.toString())
        } else {
          return bValue.toString().localeCompare(aValue.toString())
        }
      })
    }

    return filtered
  }, [table?.rows, table?.columns, searchTerm, sortColumn, sortDirection, table])

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredAndSortedRows.slice(startIndex, startIndex + pageSize)
  }, [filteredAndSortedRows, currentPage, pageSize])

  const totalPages = Math.ceil(filteredAndSortedRows.length / pageSize)

  const handleSort = (columnId: string) => {
    const column = table.columns.find((col: any) => col.id === columnId)
    if (!column?.sortable) return

    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnId)
      setSortDirection("asc")
    }
  }

  const exportToCSV = () => {
    const headers = table.columns.map((col: any) => col.name).join(",")
    const rows = filteredAndSortedRows
      .map((row: any) => table.columns.map((col: any) => row[col.id] || "").join(","))
      .join("\n")

    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${table.name}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!table) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">Select a table to preview it here.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{table.name}</CardTitle>
              <CardDescription>{table.description}</CardDescription>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search table data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{filteredAndSortedRows.length} rows</Badge>
              <Badge variant="outline">{table.columns.length} columns</Badge>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    {table.columns.map((column: any) => (
                      <th
                        key={column.id}
                        className={`p-3 text-left font-medium ${
                          column.sortable ? "cursor-pointer hover:bg-muted/80" : ""
                        }`}
                        style={{ width: column.width }}
                        onClick={() => handleSort(column.id)}
                      >
                        <div className="flex items-center gap-2">
                          {column.name}
                          {column.sortable && (
                            <div className="flex flex-col">
                              <ChevronUp
                                className={`h-3 w-3 ${
                                  sortColumn === column.id && sortDirection === "asc"
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                              <ChevronDown
                                className={`h-3 w-3 -mt-1 ${
                                  sortColumn === column.id && sortDirection === "desc"
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((row: any, index: number) => (
                    <tr key={row.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      {table.columns.map((column: any) => (
                        <td key={column.id} className="p-3 border-t">
                          {row[column.id] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredAndSortedRows.length)} of {filteredAndSortedRows.length}{" "}
                results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Table Information</CardTitle>
          <CardDescription>Details about this table</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium">Table ID</Label>
              <div className="text-sm text-muted-foreground">{table.id}</div>
            </div>

            <div>
              <Label className="text-sm font-medium">Created</Label>
              <div className="text-sm text-muted-foreground">{new Date(table.createdAt).toLocaleString()}</div>
            </div>

            <div>
              <Label className="text-sm font-medium">Columns</Label>
              <div className="text-sm text-muted-foreground">{table.columns.length} columns</div>
            </div>

            <div>
              <Label className="text-sm font-medium">Rows</Label>
              <div className="text-sm text-muted-foreground">{table.rows.length} rows</div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Column Types</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {[...new Set(table.columns.map((col: any) => col.type))].map((type) => (
                <Badge key={type as string} variant="outline" className="text-xs">
                  {type as string}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
