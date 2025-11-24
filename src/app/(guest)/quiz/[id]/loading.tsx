import { Skeleton } from "@/components/ui/skeleton";

export default function QuizLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="p-6">
            <Skeleton className="h-4 w-32 mb-6" />

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <Skeleton className="h-8 w-8 rounded-full mr-3" />
                  <Skeleton className="h-6 w-full max-w-md" />
                </div>

                <div className="space-y-3 mt-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 rounded-md border border-gray-200 dark:border-gray-700 p-3"
                    >
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-md" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}