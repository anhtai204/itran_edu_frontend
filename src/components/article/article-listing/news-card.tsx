import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import ai from "../../../assets/images/ai.webp";


interface Category {
  id: string;
  name: string;
}

interface NewsItem {
  id: string;
  author: string;
  title: string;
  excerpt: string;
  categories: Category[];
  date: string;
  readTime?: string;
  feature_image: string;
  slug: string;
}

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  console.log(">>>news card: ", news);
  return (
    <Link href={`/article/${news.slug}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative h-48 w-full">
          <Image
            src={
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/${news.feature_image}` ||
              "/placeholder.svg"
            }
            alt={news.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            {news.categories.map((category: Category, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-purple-100 mx-0.5 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 line-clamp-2">
            {news.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {news.excerpt}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="max-w-[60px] text-xs truncate whitespace-nowrap overflow-hidden text-gray-700 dark:text-gray-300">
                {news.author}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{"01 Jan 2024"}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{news.readTime || "10 min read"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
