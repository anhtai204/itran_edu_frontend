import { Skeleton } from "@/components/ui/skeleton"

export function HomePageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col dark:bg-gray-900">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Skeleton className="h-8 w-32" />
            <div className="hidden md:flex gap-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero Section Skeleton */}
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

        {/* Discover Section Skeleton */}
        <section className="py-16 dark:bg-gray-800">
          <div className="container text-center max-w-3xl mx-auto px-4">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto mb-8" />

            {/* Category Filters Skeleton */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-28 rounded-full" />
                ))}
            </div>

            {/* Professional Cards Skeleton */}
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

            <Skeleton className="h-10 w-32 rounded-full mx-auto mt-8" />
          </div>
        </section>

        {/* Why Choose Section Skeleton */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto mb-12" />

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <Skeleton className="h-[400px] w-[300px] rounded-xl mx-auto" />

                {/* Feature Cards Skeleton */}
                <div className="absolute top-10 -right-10 bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md w-48">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-28 mb-2" />
                      <Skeleton className="h-7 w-20 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 -right-10 bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md w-48">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-36 mb-2" />
                      <Skeleton className="h-7 w-20 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 left-10 bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md w-48">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-3 w-32 mb-2" />
                      <Skeleton className="h-7 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-left">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-10 w-32 rounded-full" />
                </div>

                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-10 w-32 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clients Section Skeleton */}
        <section className="py-16 dark:bg-gray-900">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <Skeleton className="h-8 w-96 mx-auto mb-2" />
            <Skeleton className="h-4 w-80 mx-auto mb-12" />

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">
              {Array(12)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center justify-center">
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* How It Works Section Skeleton */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container max-w-5xl mx-auto px-4">
            <Skeleton className="h-8 w-48 mx-auto mb-12" />

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-8">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="flex-shrink-0 w-12 h-12 rounded-full" />
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm flex-1">
                        <Skeleton className="h-5 w-48 mb-1" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
              </div>

              <div className="relative">
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <div className="absolute -bottom-4 -left-4 flex">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className={`w-8 h-8 rounded-full ${i > 0 ? "-ml-3" : ""}`} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section Skeleton */}
        <section className="py-16 dark:bg-gray-900">
          <div className="container max-w-5xl mx-auto px-4">
            <Skeleton className="h-8 w-64 mx-auto mb-12" />

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-900 dark:bg-gray-800 p-8 rounded-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-5/6 mb-6" />
                <div className="flex gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>

              <Skeleton className="h-[300px] w-full rounded-xl" />
            </div>
          </div>
        </section>

        {/* FAQ Section Skeleton */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container max-w-3xl mx-auto px-4">
            <Skeleton className="h-8 w-64 mx-auto mb-12" />

            <div className="space-y-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-700 rounded-lg">
                    <div className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-5 w-full max-w-md" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* CTA Section Skeleton */}
        <section className="py-16 dark:bg-gray-900">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 md:p-12 text-center">
              <Skeleton className="h-8 w-3/4 mx-auto mb-4 bg-white/20" />
              <Skeleton className="h-4 w-2/3 mx-auto mb-8 bg-white/20" />

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Skeleton className="h-10 w-32 rounded-full bg-white/20" />
                <Skeleton className="h-10 w-32 rounded-full bg-white/20" />
              </div>

              <Skeleton className="h-10 w-32 rounded-full mx-auto mt-8 bg-white" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer Skeleton */}
      <div className="border-t bg-white dark:bg-gray-800 dark:border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>

            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-2">
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <Skeleton key={j} className="h-4 w-24" />
                      ))}
                  </div>
                </div>
              ))}
          </div>

          <div className="border-t dark:border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <Skeleton className="h-4 w-64 mb-4 md:mb-0" />
            <div className="flex space-x-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-6 w-6 rounded-full" />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

