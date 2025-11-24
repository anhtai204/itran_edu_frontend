import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

import ani from "@/assets/images/ani.png";
import ai from "@/assets/images/ai.webp";
import doof from "@/assets/images/doof.jpg";
import earth from "@/assets/images/earth.png";
import hnue from "@/assets/images/hnue.jpg";
import meme from "@/assets/images/meme.jpg";
import meme1 from "@/assets/images/meme1.jpg";

import ai1 from "@/assets/images/ai1.jpg";
import ai2 from "@/assets/images/ai2.jpg";
import ai3 from "@/assets/images/ai3.jpg";
import ai4 from "@/assets/images/ai4.jpg";
import ai5 from "@/assets/images/ai5.jpg";
import ai6 from "@/assets/images/ai6.png";
import ai7 from "@/assets/images/ai7.png";
import ai8 from "@/assets/images/ai8.webp";
import ai9 from "@/assets/images/ai9.webp";
import { RawNews } from "@/utils/action";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface Category {
  id: string;
  name: string;
}

// Mock data
const featuredNews = {
  id: "featured-1",
  title: "Itran Education Launches New AI Learning Path",
  excerpt:
    "Our new comprehensive learning path helps students master artificial intelligence from basics to advanced applications.",
  category: "Announcements",
  date: "March 15, 2025",
  readTime: "5 min read",
  image: ai1,
  slug: "Itran-education-launches-new-ai-learning-path",
};


const recentNews = [
  {
    id: "recent-1",
    title: "New Partnership with Tech Industry Leaders",
    excerpt:
      "Itran Education partners with leading tech companies to provide students with real-world experience.",
    category: "Partnerships",
    date: "March 10, 2025",
    image: ai2,
    slug: "new-partnership-with-tech-industry-leaders",
  },
  {
    id: "recent-2",
    title: "Summer Coding Bootcamp Registration Now Open",
    excerpt:
      "Register now for our intensive summer coding bootcamp starting June 2025.",
    category: "Events",
    date: "March 8, 2025",
    image: ai3,
    slug: "summer-coding-bootcamp-registration",
  },
  {
    id: "recent-3",
    title: "Student Success Story: From Beginner to Senior Developer",
    excerpt:
      "Read how our student went from zero coding knowledge to a senior developer position in just 18 months.",
    category: "Success Stories",
    date: "March 5, 2025",
    image: ai4,
    slug: "student-success-story-senior-developer",
  },
];

interface NewsHeroProps {
  featuredNews: {
    id: string;
    title: string;
    excerpt: string;
    categories: Category[];
    date: string;
    readTime: string;
    image: StaticImport;
    slug: string;
  };
}

export function NewsHero({ featuredNews }: NewsHeroProps) {
  console.log(">>>feature article: ", featuredNews);
  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Featured News
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main featured news */}
        <div className="group">
          <Link href={`/news/${featuredNews.slug}`} className="block">
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <Image
                // src={featuredNews.feature_image || "/placeholder.svg"}
                src={ai}
                alt={featuredNews.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                {/* <Badge className="mb-3 bg-indigo-600 hover:bg-indigo-700">
                  {featuredNews.categories.map((category, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                    >
                      {category}
                    </Badge>
                  ))}
                </Badge> */}
                <Badge className="mb-3 bg-indigo-600 hover:bg-indigo-700">
                  {featuredNews.categories.map((category: Category, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {featuredNews.title}
                </h3>
                <p className="text-gray-200 mb-3 line-clamp-2">
                  {featuredNews.excerpt}
                </p>
                <div className="flex items-center text-gray-300 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>10 min</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent news sidebar */}
        <div className="space-y-4">
          {recentNews.map((news) => (
            <Link
              key={news.id}
              href={`/news/${news.slug}`}
              className="block group"
            >
              <div className="flex gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={news.image || "/placeholder.svg"}
                    alt={news.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Badge className="mb-1 bg-indigo-600 hover:bg-indigo-700 text-xs">
                    {news.category}
                  </Badge>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{news.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
