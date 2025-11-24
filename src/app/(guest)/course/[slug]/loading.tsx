import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Users, BarChart, BookOpen, FileCheck } from "lucide-react";

export default function CourseDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white dark:from-purple-900 dark:to-gray-800">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <Skeleton className="h-8 w-32" />
            </div>
            <nav className="hidden md:flex gap-6">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-b from-purple-900 to-indigo-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 rounded-full bg-white/10" />
              <Skeleton className="h-10 w-full" />
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-300" />
                  <Skeleton className="h-4 w-16 bg-gray-300/30" />
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-300" />
                  <Skeleton className="h-4 w-24 bg-gray-300/30" />
                </div>
                <div className="flex items-center gap-1">
                  <BarChart className="h-4 w-4 text-gray-300" />
                  <Skeleton className="h-4 w-20 bg-gray-300/30" />
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-gray-300" />
                  <Skeleton className="h-4 w-24 bg-gray-300/30" />
                </div>
                <div className="flex items-center gap-1">
                  <FileCheck className="h-4 w-4 text-gray-300" />
                  <Skeleton className="h-4 w-20 bg-gray-300/30" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="relative">
                <Skeleton className="rounded-xl w-[400px] h-[300px]" />
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-7 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
          {/* Tabs Skeleton */}
          <div className="w-full justify-start bg-gray-100 dark:bg-gray-700 rounded-xl p-1 flex space-x-1">
            {["Overview", "Curriculum", "Instructor", "FAQs", "Reviews"].map(
              (tab) => (
                <Skeleton key={tab} className="h-9 w-24 rounded-lg" />
              )
            )}
          </div>

          {/* Tab Content Skeleton */}
          <div className="mt-8 space-y-8">
            {/* Overview Content Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="h-5 w-5 rounded-full mt-0.5" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-8 w-48" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            {/* Comment Form Skeleton */}
            <div className="border-t pt-8">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-32 w-full rounded-lg" />
                <div className="flex justify-end">
                  <Skeleton className="h-10 w-32 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <footer className="border-t bg-white dark:bg-gray-800 dark:border-gray-700 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>

            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t dark:border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </footer>
    </div>
  );
}