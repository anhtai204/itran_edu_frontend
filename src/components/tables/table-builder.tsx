"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, GripVertical, Type, Hash, Calendar, ToggleLeft } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface TableColumn {
  id: string
  name: string
  type: string
  sortable: boolean
  filterable: boolean
  width?: string
}

interface TableBuilderProps {
  onTableSelect: (table: any) => void
}

const columnTypes = [
  { value: "text", label: "Text", icon: Type },
  { value: "number", label: "Number", icon: Hash },
  { value: "date", label: "Date", icon: Calendar },
  { value: "boolean", label: "Boolean", icon: ToggleLeft },
]

export default function TableBuilder({ onTableSelect }: TableBuilderProps) {
  const [tableName, setTableName] = useState("")
  const [tableDescription, setTableDescription] = useState("")
  const [columns, setColumns] = useState<TableColumn[]>([])
  const [selectedColumn, setSelectedColumn] = useState<TableColumn | null>(null)
  const [rows, setRows] = useState<any[]>([])

  const addColumn = (type: string) => {
    const newColumn: TableColumn = {
      id: `col_${Date.now()}`,
      name: `New ${type} column`,
      type,
      sortable: true,
      filterable: true,
      width: "150px",
    }
    setColumns([...columns, newColumn])
    setSelectedColumn(newColumn)
  }

  const updateColumn = (id: string, updates: Partial<TableColumn>) => {
    setColumns(columns.map((col) => (col.id === id ? { ...col, ...updates } : col)))
    if (selectedColumn?.id === id) {
      setSelectedColumn({ ...selectedColumn, ...updates })
    }
  }

  const deleteColumn = (id: string) => {
    setColumns(columns.filter((col) => col.id !== id))
    if (selectedColumn?.id === id) {
      setSelectedColumn(null)
    }
    // Remove column data from rows
    setRows(
      rows.map((row) => {
        const newRow = { ...row }
        delete newRow[id]
        return newRow
      }),
    )
  }

  const addRow = () => {
    const newRow: any = { id: `row_${Date.now()}` }
    columns.forEach((col) => {
      newRow[col.id] = ""
    })
    setRows([...rows, newRow])
  }

  const updateRowData = (rowId: string, columnId: string, value: any) => {
    setRows(rows.map((row) => (row.id === rowId ? { ...row, [columnId]: value } : row)))
  }

  const deleteRow = (rowId: string) => {
    setRows(rows.filter((row) => row.id !== rowId))
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(columns)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setColumns(items)
  }

  const saveTable = () => {
    const table = {
      id: `table_${Date.now()}`,
      name: tableName,
      description: tableDescription,
      columns,
      rows,
      createdAt: new Date().toISOString(),
      settings: {
        pagination: true,
        search: true,
        export: true,
      },
    }

    // Save to localStorage for demo
    const savedTables = JSON.parse(localStorage.getItem("tables") || "[]")
    savedTables.push(table)
    localStorage.setItem("tables", JSON.stringify(savedTables))

    onTableSelect(table)
    alert("Table saved successfully!")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Table Builder */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Table Details</CardTitle>
            <CardDescription>Set up your table name and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Table Name</Label>
              <Input
                id="name"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Enter table name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={tableDescription}
                onChange={(e) => setTableDescription(e.target.value)}
                placeholder="Enter table description"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Columns</CardTitle>
            <CardDescription>Drag and drop to reorder columns</CardDescription>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="columns">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {columns.map((column, index) => (
                      <Draggable key={column.id} draggableId={column.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-4 border rounded-lg flex items-center gap-3 ${
                              selectedColumn?.id === column.id ? "border-primary bg-primary/5" : "border-border"
                            }`}
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1" onClick={() => setSelectedColumn(column)}>
                              <div className="font-medium">{column.name}</div>
                              <div className="text-sm text-muted-foreground capitalize">
                                {column.type}
                                {column.sortable && (
                                  <Badge variant="secondary" className="ml-2">
                                    Sortable
                                  </Badge>
                                )}
                                {column.filterable && (
                                  <Badge variant="outline" className="ml-1">
                                    Filterable
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => deleteColumn(column.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {columns.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No columns added yet. Add columns from the panel on the right.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Rows</CardTitle>
                <CardDescription>Add and edit table data</CardDescription>
              </div>
              <Button onClick={addRow} disabled={columns.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {columns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Add columns first to start adding data.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column.id} className="border p-2 text-left bg-muted">
                          {column.name}
                        </th>
                      ))}
                      <th className="border p-2 w-16">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        {columns.map((column) => (
                          <td key={column.id} className="border p-2">
                            <Input
                              value={row[column.id] || ""}
                              onChange={(e) => updateRowData(row.id, column.id, e.target.value)}
                              type={column.type === "number" ? "number" : "text"}
                              className="border-0 p-1"
                            />
                          </td>
                        ))}
                        <td className="border p-2">
                          <Button variant="ghost" size="sm" onClick={() => deleteRow(row.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={saveTable} disabled={!tableName || columns.length === 0}>
            Save Table
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setTableName("")
              setTableDescription("")
              setColumns([])
              setRows([])
              setSelectedColumn(null)
            }}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Add Columns */}
        <Card>
          <CardHeader>
            <CardTitle>Add Columns</CardTitle>
            <CardDescription>Click to add column types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {columnTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.value}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addColumn(type.value)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {type.label}
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Column Properties */}
        {selectedColumn && (
          <Card>
            <CardHeader>
              <CardTitle>Column Properties</CardTitle>
              <CardDescription>Configure the selected column</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="column-name">Column Name</Label>
                <Input
                  id="column-name"
                  value={selectedColumn.name}
                  onChange={(e) => updateColumn(selectedColumn.id, { name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="column-width">Width</Label>
                <Input
                  id="column-width"
                  value={selectedColumn.width || ""}
                  onChange={(e) => updateColumn(selectedColumn.id, { width: e.target.value })}
                  placeholder="e.g., 150px, 20%"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="column-sortable"
                  checked={selectedColumn.sortable}
                  onCheckedChange={(checked) => updateColumn(selectedColumn.id, { sortable: checked })}
                />
                <Label htmlFor="column-sortable">Sortable</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="column-filterable"
                  checked={selectedColumn.filterable}
                  onCheckedChange={(checked) => updateColumn(selectedColumn.id, { filterable: checked })}
                />
                <Label htmlFor="column-filterable">Filterable</Label>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
