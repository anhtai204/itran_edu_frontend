"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Flag } from "lucide-react"

interface Lap {
  id: number
  time: number
  elapsed: number
}

export default function Stopwatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10) // Update every 10ms for more precision
      }, 10)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const startStopwatch = () => {
    setIsRunning(true)
  }

  const pauseStopwatch = () => {
    setIsRunning(false)
  }

  const resetStopwatch = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
  }

  const addLap = () => {
    if (isRunning) {
      const lastLapTime = laps.length > 0 ? laps[0].time : 0
      const newLap: Lap = {
        id: Date.now(),
        time,
        elapsed: time - lastLapTime,
      }
      setLaps([newLap, ...laps])
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl font-mono font-bold">{formatTime(time)}</div>
      </div>

      <div className="flex justify-center space-x-4">
        {!isRunning ? (
          <Button onClick={startStopwatch}>
            <Play className="h-4 w-4 mr-2" /> Start
          </Button>
        ) : (
          <Button onClick={pauseStopwatch} variant="outline">
            <Pause className="h-4 w-4 mr-2" /> Pause
          </Button>
        )}
        <Button onClick={resetStopwatch} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
        <Button onClick={addLap} disabled={!isRunning} variant="secondary">
          <Flag className="h-4 w-4 mr-2" /> Lap
        </Button>
      </div>

      {laps.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Lap</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Lap Time</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lap, index) => (
                <tr key={lap.id} className="border-t">
                  <td className="p-2">{laps.length - index}</td>
                  <td className="p-2 font-mono">{formatTime(lap.time)}</td>
                  <td className="p-2 font-mono">{formatTime(lap.elapsed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
