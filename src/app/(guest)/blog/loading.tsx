import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white dark:from-purple-900 dark:to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs skeleton */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6 animate-pulse"></div>

          {/* Categories skeleton */}
          <div className="flex gap-2 mb-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-32 animate-pulse"></div>
          </div>

          {/* Title skeleton */}
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4 animate-pulse"></div>

          {/* Meta skeleton */}
          <div className="flex gap-4 mb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
          </div>

          {/* Image skeleton */}
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8 animate-pulse"></div>

          {/* Content skeleton */}
          <div className="space-y-4 mb-8">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

