"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"

// Mock system status data
const initialSystemStatus: Record<string, SystemComponent> = {
  server: { status: "operational", uptime: "99.98%", load: 42 },
  database: { status: "operational", uptime: "99.95%", load: 38 },
  api: { status: "degraded", uptime: "98.75%", load: 78 },
  storage: { status: "operational", uptime: "99.99%", load: 65 },
  cdn: { status: "operational", uptime: "99.90%", load: 51 },
}

type StatusType = "operational" | "degraded" | "outage"

interface SystemComponent {
  status: StatusType
  uptime: string
  load: number
}

export default function SystemStatusWidget() {
  const [systemStatus, setSystemStatus] = useState<Record<string, SystemComponent>>(initialSystemStatus)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    // In a real app, you would fetch system status from an API
    // This is just a simulation to show changing status
    const interval = setInterval(() => {
      const components = Object.keys(systemStatus)
      const randomComponent = components[Math.floor(Math.random() * components.length)]
      const statuses: StatusType[] = ["operational", "degraded", "outage"]
      const randomStatus = statuses[Math.floor(Math.random() * (statuses.length - 0.7))] // Bias towards operational
      const randomLoad = Math.floor(Math.random() * 100)

      setSystemStatus((prev) => ({
        ...prev,
        [randomComponent]: {
          ...prev[randomComponent],
          status: randomStatus,
          load: randomLoad,
        },
      }))

      setLastUpdated(new Date())
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [systemStatus])

  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case "operational":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Operational
          </Badge>
        )
      case "degraded":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <AlertCircle className="h-3 w-3 mr-1" /> Degraded
          </Badge>
        )
      case "outage":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <XCircle className="h-3 w-3 mr-1" /> Outage
          </Badge>
        )
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getLoadColor = (load: number) => {
    if (load < 50) return "bg-green-500"
    if (load < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>

      <div className="space-y-3">
        {Object.entries(systemStatus).map(([name, component]) => (
          <div key={name} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="font-medium capitalize">{name}</div>
              {getStatusBadge(component.status)}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Uptime: {component.uptime}</span>
              <span>Load: {component.load}%</span>
            </div>
            <Progress value={component.load} className={`h-1.5 ${getLoadColor(component.load)}`} />
          </div>
        ))}
      </div>

      <div className="text-sm">
        {Object.values(systemStatus).every((c) => c.status === "operational") ? (
          <div className="text-green-600 dark:text-green-400 flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-1" /> All systems operational
          </div>
        ) : Object.values(systemStatus).some((c) => c.status === "outage") ? (
          <div className="text-red-600 dark:text-red-400 flex items-center">
            <XCircle className="h-4 w-4 mr-1" /> System outages detected
          </div>
        ) : (
          <div className="text-yellow-600 dark:text-yellow-400 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" /> Some systems degraded
          </div>
        )}
      </div>
    </div>
  )
}
