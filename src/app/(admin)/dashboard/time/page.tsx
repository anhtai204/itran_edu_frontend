"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DigitalClock from "@/components/time/digital-clock" 
import AnalogClock from "@/components/time/analog-clock"
import WorldClock from "@/components/time/world-clock"
import Timer from "@/components/time/timer"
import Stopwatch from "@/components/time/stopwatch"
import TimeUsageChart from "@/components/time/time-usage-chart"
import Calendar from "@/components/time/calendar"

export default function TimePage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Time Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Time</CardTitle>
            <CardDescription>Digital and analog representation of current time</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <div className="w-full md:w-1/2">
              <DigitalClock />
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <AnalogClock />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>World Clock</CardTitle>
            <CardDescription>Time across different timezones</CardDescription>
          </CardHeader>
          <CardContent>
            <WorldClock />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timer">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
        </TabsList>
        <TabsContent value="timer">
          <Card>
            <CardHeader>
              <CardTitle>Timer</CardTitle>
              <CardDescription>Set a countdown timer</CardDescription>
            </CardHeader>
            <CardContent>
              <Timer />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stopwatch">
          <Card>
            <CardHeader>
              <CardTitle>Stopwatch</CardTitle>
              <CardDescription>Track elapsed time</CardDescription>
            </CardHeader>
            <CardContent>
              <Stopwatch />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Usage Analytics</CardTitle>
            <CardDescription>System usage patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <TimeUsageChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Monthly view and events</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
