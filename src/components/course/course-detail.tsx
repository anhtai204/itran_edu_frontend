import { useState } from "react";
import { Clock, Users, BarChart, BookOpen, FileCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { Overview } from "./course-single/overview";
import { CommentForm } from "./course-single/component-form";
import { Curriculum } from "./course-single/curriculum";
import { Instructor } from "./course-single/instructor";
import { FAQs } from "./course-single/faqs";
import { Reviews } from "./course-single/reviews";

const CourseDetail = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const courseMetadata = {
    duration: "2 Weeks",
    students: "156 Students",
    level: "All levels",
    lessons: "20 Lessons",
    quizzes: "3 Quizzes",
    sections: [
      {
        title: "Chapter With Video Content",
        totalLessons: 5,
        totalDuration: "45 Mins",
        lessons: [
          {
            title: "Lessons with video content",
            duration: "12:30",
            preview: true,
            completed: true,
          },
          {
            title: "Lessons with video content",
            duration: "10:05",
            preview: true,
            completed: true,
          },
          {
            title: "Lessons with video content",
            duration: "5:35",
            locked: true,
          },
          {
            title: "Lessons with video content",
            duration: "9:25",
            locked: true,
          },
          {
            title: "Lessons with video content",
            duration: "8:42",
            locked: true,
          },
        ],
      },
      {
        title: "Lessons With Video Content",
        totalLessons: 3,
        totalDuration: "45 Mins",
        lessons: [
          {
            title: "Lessons with video content",
            duration: "12:30",
            preview: true,
          },
          {
            title: "Lessons with video content",
            duration: "10:05",
            preview: true,
          },
          {
            title: "Lessons with video content",
            duration: "2:25",
            locked: true,
          },
        ],
      },
      {
        title: "Lessons With Video Content",
        totalLessons: 5,
        totalDuration: "45 Mins",
        lessons: [
          {
            title: "Lessons with video content",
            duration: "12:30",
            preview: true,
          },
          {
            title: "Lessons with video content",
            duration: "10:05",
            preview: true,
          },
          {
            title: "Lessons with video content",
            duration: "5:35",
            locked: true,
          },
          {
            title: "Lessons with video content",
            duration: "9:25",
            locked: true,
          },
          {
            title: "Lessons with video content",
            duration: "8:42",
            locked: true,
          },
        ],
      },
      {
        title: "Lessons With Video Content",
        totalLessons: 5,
        totalDuration: "45 Mins",
        lessons: [
          {
            title: "Lessons with video content",
            duration: "12:30",
            preview: true,
          },
          {
            title: "Lessons with video content",
            duration: "10:05",
            preview: true,
          },
          {
            title: "Lessons with video content",
            duration: "9:25",
            locked: true,
          },
          {
            title: "Lessons with video content",
            duration: "5:35",
            locked: true,
          },
          {
            title: "Lessons with video content",
            duration: "8:42",
            locked: true,
          },
        ],
      },
    ],
    stats: {
      average: 4.0,
      total: 146,
      distribution: [
        { stars: 5, percentage: 90 },
        { stars: 4, percentage: 5 },
        { stars: 3, percentage: 2 },
        { stars: 2, percentage: 2 },
        { stars: 1, percentage: 1 },
      ],
    },
    reviews: [
      {
        author: "Laura Hipster",
        date: "October 03, 2022",
        rating: 5,
        content:
          "Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultricies mi ut eleifend lacus ut. Id sed faucibus bibendum augue id cras porta. At eget euismod cursus non. Molestie dignissim sed vulputat feugiat vel.",
      },
      {
        author: "Laura Hipster",
        date: "October 03, 2022",
        rating: 4,
        content:
          "Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultricies mi ut eleifend lacus ut. Id sed faucibus bibendum augue id cras porta. At eget euismod cursus non. Molestie dignissim sed vulputat feugiat vel.",
      },
      {
        author: "Laura Hipster",
        date: "October 03, 2022",
        rating: 5,
        content:
          "Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultricies mi ut eleifend lacus ut. Id sed faucibus bibendum augue id cras porta. At eget euismod cursus non. Molestie dignissim sed vulputat feugiat vel.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white dark:from-purple-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-900 to-indigo-800 text-white py-12">
        <div className="max-w-5xl container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs">
                <span>Photography</span>
                <span className="mx-2 text-gray-300">by</span>
                <span>Determined-Poitras</span>
              </div>

              <h1 className="text-1xl md:text-2xl font-bold">
                The Ultimate Guide To The Best LMS Plugin
              </h1>

              <div className="flex flex-wrap gap-4 text-xs text-gray-300">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{courseMetadata.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{courseMetadata.students}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  <span>{courseMetadata.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{courseMetadata.lessons}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileCheck className="h-4 w-4" />
                  <span>{courseMetadata.quizzes}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="relative">
                <Image
                  src={"./assets/images/ani.png"}
                  alt="Course Preview"
                  className="rounded-xl"
                  width={400}
                  height={300}
                />
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg line-through text-gray-400">
                      $69.0
                    </span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      $49.0
                    </span>
                  </div>
                  <Button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600">
                    Start Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <TabsTrigger
                value="overview"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="curriculum"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow"
              >
                Curriculum
              </TabsTrigger>
              <TabsTrigger
                value="instructor"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow"
              >
                Instructor
              </TabsTrigger>
              <TabsTrigger
                value="faqs"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow"
              >
                FAQs
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="overview">
                <Overview />
                <CommentForm />
              </TabsContent>

              <TabsContent value="curriculum">
                <Curriculum sections={courseMetadata.sections} />
                <CommentForm />
              </TabsContent>

              <TabsContent value="instructor">
                <Instructor />
                <CommentForm />
              </TabsContent>

              <TabsContent value="faqs">
                <FAQs />
                <CommentForm />
              </TabsContent>

              <TabsContent value="reviews">
                <Reviews
                  stats={courseMetadata.stats}
                  reviews={courseMetadata.reviews}
                />
                <CommentForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default CourseDetail;