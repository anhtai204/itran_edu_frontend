import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "lucide-react";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface CourseProps {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  teacher_id?: string;
  category_id?: string;
  status?: string;
  price?: number;
  duration?: number;
  slug: string;
  assistants_id?: string[];
  original_price?: number;
  featured?: boolean;
  level_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export function CourseCard( {course} : CourseProps) {
  const discount =
    course.original_price && course.original_price > 0
      ? Math.round(
          ((course.original_price - course.price) / course.original_price) * 100
        )
      : 0;

  return (
    <Link href={`/course/${course.slug}`}>
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
          course.featured ? "ring-2 ring-purple-500 dark:ring-purple-400" : ""
        }`}
      >
        <div className="relative">
          <img
            src={
              "./assets/images/" + course.thumbnail_url ||
              "./assets/images/not_found.jpg"
            }
            alt={course.title}
            width={400}
            height={200}
            className="w-full max-h-30 md:h-full object-cover"
          />
          {course.featured && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-indigo-500">
              Featured
            </Badge>
          )}
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
            {discount}% OFF
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded truncate">
              {course.category}
            </span>
            <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded truncate">
              {course.level}
            </span>
          </div>

          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
            {course.title}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            by {course.instructor}
          </p>

          <div className="flex items-center mb-3">
            <div className="flex mr-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(course.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {course.rating}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({course.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${course.price}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                ${course.original_price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}