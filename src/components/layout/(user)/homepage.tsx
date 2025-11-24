// 'use client'

// import { CrownOutlined } from "@ant-design/icons"
// import { Result } from "antd"

// const HomePage = () => {
//     return (
//         <div style={{ padding: 20 }}>
//             <Result
//                 icon={<CrownOutlined />}
//                 title="Fullstack Next/Nest - createdBy @itran"
//             />
//         </div>
//     )
// }

// export default HomePage;


"use client"

import { Crown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const HomePage = () => {
  return (
    <div className="p-5">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full mb-4">
            <Crown className="h-10 w-10 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold mt-4">Fullstack Next/Nest - createdBy @itran</h2>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage

