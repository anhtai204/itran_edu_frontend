import { Skeleton } from "@/components/ui/skeleton"

export function ProfessionalsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="rounded-xl p-4 border dark:border-gray-700">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
            <Skeleton className="h-5 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto mb-2" />
            <div className="flex items-center justify-center gap-4 mt-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
    </div>
  )
}

