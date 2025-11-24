import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-12 w-48 mb-8" />

      {/* Featured news skeleton */}
      <div className="mb-10">
        <Skeleton className="h-8 w-36 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
          </div>
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
      </div>

      {/* News grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[350px] rounded-xl" />
          ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center mt-10">
        <Skeleton className="h-10 w-72" />
      </div>
    </div>
  );
}