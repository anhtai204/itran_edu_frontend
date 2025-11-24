import { Skeleton } from "@/components/ui/skeleton"

export function HeroSectionSkeleton() {
  return (
    <section className="relative bg-gradient-to-b from-purple-100 to-white dark:from-purple-900 dark:to-gray-800 pt-16 pb-18">
      <div className="container text-center max-w-3xl mx-auto px-4">
        <Skeleton className="h-6 w-48 rounded-full mx-auto mb-6" />
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-4 w-2/3 mx-auto mb-8" />

        <div className="bg-white dark:bg-gray-700 rounded-lg p-2 shadow-md flex flex-col sm:flex-row gap-2 mb-8">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
          <div className="flex items-center gap-2 px-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24 ml-4" />
          </div>
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </div>

      {/* Image Slider Skeleton */}
      <div className="container overflow-hidden py-8">
        <div className="flex gap-4 justify-center">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
            ))}
        </div>
      </div>
    </section>
  )
}

