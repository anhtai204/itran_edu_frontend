import { Star, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Stats {
  average: number,
  total: number,
  distribution: { stars: number, percentage: number }[]
}

interface Review {
  author: string,
  date: string,
  rating: number,
  content: string
}

export function Reviews({ stats, reviews }: {stats: Stats, reviews: Review[]}) {

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start gap-8 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2 text-purple-600 dark:text-purple-400">{stats.average}</div>
          <div className="flex gap-1 justify-center mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(stats.average) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">based on {stats.total} ratings</div>
        </div>

        <div className="flex-1 space-y-2">
          {stats.distribution.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex gap-1 w-20">
                {[...Array(5 - i)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 w-12">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="border-2 border-purple-200 dark:border-purple-800">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-600 text-white">
                    LH
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{review.author}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{review.date}</div>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${j < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{review.content}</p>
            <Button
              variant="link"
              className="mt-2 h-auto p-0 text-purple-600 dark:text-purple-400 flex items-center gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              Reply
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        <Button variant="outline" className="w-10 h-10 p-0 rounded-full" disabled>
          &lt;
        </Button>
        <Button variant="default" className="w-10 h-10 p-0 rounded-full bg-purple-600 hover:bg-purple-700">
          1
        </Button>
        <Button variant="outline" className="w-10 h-10 p-0 rounded-full">
          2
        </Button>
        <Button variant="outline" className="w-10 h-10 p-0 rounded-full">
          3
        </Button>
        <Button variant="outline" className="w-10 h-10 p-0 rounded-full">
          &gt;
        </Button>
      </div>
    </div>
  )
}