import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white dark:from-purple-900 dark:to-gray-800">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-b from-purple-900 to-indigo-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />

          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 opacity-50" />
              <Input
                disabled
                className="pl-10 pr-4 py-6 rounded-full text-gray-800 dark:text-white dark:bg-gray-700 border-0 shadow-lg opacity-70"
              />
              <Button
                disabled
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full opacity-70"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-5xl container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Mobile Toggle Skeleton */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <Button
              disabled
              variant="outline"
              className="flex items-center gap-2 opacity-70"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-[180px] rounded-md" />
            </div>
          </div>

          {/* Filter Sidebar Skeleton */}
          <div className="lg:w-1/4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6 hidden lg:block">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-16" />
            </div>

            <div className="space-y-6">
              {/* Category Filter Skeleton */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor Filter Skeleton */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <Skeleton className="h-5 w-24 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter Skeleton */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <Skeleton className="h-5 w-16 mb-4" />
                <div className="space-y-6">
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-12 rounded-md" />
                    <Skeleton className="h-6 w-12 rounded-md" />
                  </div>
                </div>
              </div>

              {/* Rating Filter Skeleton */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <Skeleton className="h-5 w-16 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Level Filter Skeleton */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <Skeleton className="h-5 w-16 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Course Listing Skeleton */}
          <div className="lg:w-3/4">
            {/* Desktop Sort and View Options Skeleton */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <Skeleton className="h-5 w-32" />

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
                <Skeleton className="h-9 w-[180px] rounded-md" />
              </div>
            </div>

            {/* Course Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                >
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-6 w-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-12 line-through" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-9 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}