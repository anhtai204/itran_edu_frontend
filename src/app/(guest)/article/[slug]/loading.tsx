import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs skeleton */}
        <Skeleton className="h-6 w-64 mb-6" />

        {/* Title skeleton */}
        <Skeleton className="h-12 w-full mb-4" />

        {/* Meta info skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Featured image skeleton */}
        <Skeleton className="h-[400px] w-full rounded-xl mb-8" />

        {/* Content skeleton */}
        <div className="space-y-4 mb-10">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2 mb-8">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
        </div>

        {/* Share buttons skeleton */}
        <Skeleton className="h-10 w-full mb-10" />

        {/* Related news skeleton */}
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[300px] rounded-xl" />
            ))}
        </div>
      </div>
    </div>
  );
}