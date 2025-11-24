"use client"

import { useState, useEffect } from "react"

export default function AnalogClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  // Calculate the rotation angles for the clock hands
  const secondsRatio = time.getSeconds() / 60
  const minutesRatio = (secondsRatio + time.getMinutes()) / 60
  const hoursRatio = (minutesRatio + time.getHours()) / 12

  return (
    <div className="relative w-48 h-48">
      {/* Clock face */}
      <div className="absolute inset-0 rounded-full border-4 border-primary bg-card"></div>

      {/* Hour markers */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-3 bg-primary"
          style={{
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-20px)`,
          }}
        ></div>
      ))}

      {/* Hour hand */}
      <div
        className="absolute top-1/2 left-1/2 w-1 h-16 bg-primary rounded-full origin-bottom"
        style={{
          transform: `translate(-50%, -100%) rotate(${hoursRatio * 360}deg)`,
        }}
      ></div>

      {/* Minute hand */}
      <div
        className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-primary rounded-full origin-bottom"
        style={{
          transform: `translate(-50%, -100%) rotate(${minutesRatio * 360}deg)`,
        }}
      ></div>

      {/* Second hand */}
      <div
        className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-destructive rounded-full origin-bottom"
        style={{
          transform: `translate(-50%, -100%) rotate(${secondsRatio * 360}deg)`,
        }}
      ></div>

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  )
}
