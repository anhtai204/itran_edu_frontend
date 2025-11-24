"use client"

import Image from "next/image"
import { StatsCard } from "@/components/stats-card"
import { Card } from "@/components/ui/card"

// Giả định rằng bạn đã có file ảnh này trong dự án
// Nếu không, bạn có thể thay thế bằng đường dẫn placeholder
import ai6 from "@/assets/images/ai6.png"

const DashBoardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Welcome Card */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Image src={ai6 || "/placeholder.svg"} alt="Profile" className="rounded-full" height={64} width={64} />
          <div>
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="text-xl">Jhon Anderson!</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-2xl font-bold">$65.4K</div>
            <p className="text-sm text-muted-foreground">Today's Sales</p>
          </div>
          <div>
            <div className="text-2xl font-bold">78.4%</div>
            <p className="text-sm text-muted-foreground">Growth Rate</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Active Users" value="42.5K" description="24K users increased from last month" />
        <StatsCard title="Total Users" value="97.4K" description="12.5% from last month" />
        <StatsCard title="Total Clicks" value="82.7K" description="12.5% from last month" />
        <StatsCard title="Total Views" value="68.4K" description="35K users increased from last month" />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
          <div className="h-[300px]">
            {/* Add your chart component here */}
            <div className="text-sm text-muted-foreground">Average monthly sale for every author</div>
            <div className="text-2xl font-bold text-blue-500 mt-2">
              68.9%
              <span className="text-sm text-green-500 ml-2">↑ 34.5%</span>
            </div>
          </div>
        </Card>

        {/* Device Type Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Device Type</h3>
          <div className="h-[300px]">
            {/* Add your chart component here */}
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span>Desktop</span>
                </div>
                <span>35%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span>Tablet</span>
                </div>
                <span>48%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span>Mobile</span>
                </div>
                <span>27%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DashBoardPage
