"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Maximize2, Minimize2, X, Move } from "lucide-react"
import WeatherWidget from "@/components/widgets/weather-widget"
import TodoWidget from "@/components/widgets/todo-widget"
import SystemStatusWidget from "@/components/widgets/system-status-widget" 
import SalesWidget from "@/components/widgets/sales-widget" 
import ChartWidget from "@/components/widgets/chart-widget" 

// Widget types
type WidgetType = "weather" | "todo" | "system" | "sales" | "chart"

interface Widget {
  id: string
  type: WidgetType
  title: string
  size: "sm" | "md" | "lg"
  minimized: boolean
}

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "1", type: "weather", title: "Weather", size: "md", minimized: false },
    { id: "2", type: "todo", title: "To-Do List", size: "md", minimized: false },
    { id: "3", type: "system", title: "System Status", size: "md", minimized: false },
    { id: "4", type: "sales", title: "Sales Performance", size: "md", minimized: false },
    { id: "5", type: "chart", title: "Analytics", size: "md", minimized: false },
  ])

  const [newWidgetType, setNewWidgetType] = useState<WidgetType>("weather")
  const [newWidgetTitle, setNewWidgetTitle] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  // Add a new widget
  const addWidget = () => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: newWidgetType,
      title: newWidgetTitle || getDefaultTitle(newWidgetType),
      size: "md",
      minimized: false,
    }

    setWidgets([...widgets, newWidget])
    setNewWidgetTitle("")
    setDialogOpen(false)
  }

  // Get default title based on widget type
  const getDefaultTitle = (type: WidgetType): string => {
    switch (type) {
      case "weather":
        return "Weather"
      case "todo":
        return "To-Do List"
      case "system":
        return "System Status"
      case "sales":
        return "Sales Performance"
      case "chart":
        return "Analytics"
      default:
        return "Widget"
    }
  }

  // Remove a widget
  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id))
  }

  // Toggle widget size
  const toggleWidgetSize = (id: string) => {
    setWidgets(
      widgets.map((widget) => {
        if (widget.id === id) {
          const newSize = widget.size === "md" ? "lg" : "md"
          return { ...widget, size: newSize }
        }
        return widget
      }),
    )
  }

  // Toggle widget minimized state
  const toggleWidgetMinimized = (id: string) => {
    setWidgets(
      widgets.map((widget) => {
        if (widget.id === id) {
          return { ...widget, minimized: !widget.minimized }
        }
        return widget
      }),
    )
  }

  // Handle drag start
  const handleDragStart = (index: number) => {
    dragItem.current = index
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    dragOverItem.current = index
  }

  // Handle drop to reorder widgets
  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return

    const _widgets = [...widgets]
    const draggedWidget = _widgets[dragItem.current]
    _widgets.splice(dragItem.current, 1)
    _widgets.splice(dragOverItem.current, 0, draggedWidget)

    setWidgets(_widgets)
    dragItem.current = null
    dragOverItem.current = null
  }

  // Render widget content based on type
  const renderWidgetContent = (widget: Widget) => {
    if (widget.minimized) {
      return null
    }

    switch (widget.type) {
      case "weather":
        return <WeatherWidget />
      case "todo":
        return <TodoWidget />
      case "system":
        return <SystemStatusWidget />
      case "sales":
        return <SalesWidget />
      case "chart":
        return <ChartWidget />
      default:
        return <div>Unknown widget type</div>
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Widgets Dashboard</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Widget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Widget</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Widget Title</label>
                <input
                  type="text"
                  placeholder="Enter widget title"
                  className="w-full p-2 border rounded-md"
                  value={newWidgetTitle}
                  onChange={(e) => setNewWidgetTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Widget Type</label>
                <Tabs defaultValue="weather" onValueChange={(value) => setNewWidgetType(value as WidgetType)}>
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="weather">Weather</TabsTrigger>
                    <TabsTrigger value="todo">Todo</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                    <TabsTrigger value="chart">Chart</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Button onClick={addWidget} className="w-full">
                Add Widget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget, index) => (
          <Card
            key={widget.id}
            className={`${widget.size === "lg" ? "md:col-span-2" : ""} ${widget.minimized ? "h-auto" : ""}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
          >
            <CardHeader className="flex flex-row items-center justify-between p-4 cursor-move">
              <CardTitle className="flex items-center">
                <Move className="h-4 w-4 mr-2 text-muted-foreground" />
                {widget.title}
              </CardTitle>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleWidgetMinimized(widget.id)}
                >
                  {widget.minimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleWidgetSize(widget.id)}
                  disabled={widget.minimized}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeWidget(widget.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className={`p-4 ${widget.minimized ? "hidden" : ""}`}>
              {renderWidgetContent(widget)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
