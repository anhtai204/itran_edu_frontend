"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Bell } from "lucide-react"

export default function Timer() {
  const [duration, setDuration] = useState(300) // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      setIsComplete(true)
      if (audioRef.current) {
        audioRef.current.play().catch((e) => console.error("Error playing sound:", e))
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const startTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(true)
      setIsComplete(false)
    }
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(duration)
    setIsComplete(false)
  }

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0]
    setDuration(newDuration)
    if (!isRunning) {
      setTimeLeft(newDuration)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`text-6xl font-mono font-bold ${isComplete ? "text-destructive animate-pulse" : ""}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>1 minute</span>
          <span>10 minutes</span>
          <span>30 minutes</span>
        </div>
        <Slider
          value={[duration]}
          min={60}
          max={1800}
          step={60}
          onValueChange={handleDurationChange}
          disabled={isRunning}
        />
      </div>

      <div className="flex justify-center space-x-4">
        {!isRunning ? (
          <Button onClick={startTimer} disabled={timeLeft === 0}>
            <Play className="h-4 w-4 mr-2" /> Start
          </Button>
        ) : (
          <Button onClick={pauseTimer} variant="outline">
            <Pause className="h-4 w-4 mr-2" /> Pause
          </Button>
        )}
        <Button onClick={resetTimer} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
      </div>

      {isComplete && (
        <div className="flex items-center justify-center text-destructive">
          <Bell className="h-5 w-5 mr-2 animate-bounce" />
          <span>Time's up!</span>
        </div>
      )}

      {/* Hidden audio element for alarm sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/alarm.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}
