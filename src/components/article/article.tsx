"use client";

import { useState } from "react";
import { NewsHero } from "./article-listing/news-hero";
import { NewsGrid } from "./article-listing/news-grid";
import { NewsSearch } from "./article-listing/news-search";
import { NewsSidebar } from "./article-listing/news-sidebar";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { NewsCategories } from "./article-listing/news-categories";
import { RawNews } from "@/utils/action";
import ai1 from "@/assets/images/ai1.jpg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface IProps {
  initialNews: RawNews[];
  categories: Category[];
  initialMeta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

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

function getArticleWithMostCategories(news: RawNews[]): RawNews | null {
  if (news.length === 0) return null;

  return news.reduce(
    (maxNews, article) =>
      article.categories.length > maxNews.categories.length ? article : maxNews,
    news[0]
  );
}

export function NewsPage(props: IProps) {
  const { initialNews, initialMeta, categories } = props;
  const [news, setNews] = useState(initialNews);
  const [meta, setMeta] = useState(initialMeta);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const current = Number(searchParams.get("current")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || initialMeta.pageSize;

  const [featureNews, setFeatureNews] = useState(featuredNews);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  //   // In a real app, you would fetch news for the selected page
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("current", page.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const handleCategorySelect = (category: string | null) => {
    console.log('>>>setSelectedCategory: ', categories);
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              News & Updates
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Stay updated with the latest news, announcements, and updates from
              Itran Education
            </p>
          </div>
          <div className="w-full md:w-auto flex gap-4">
            <NewsSearch onSearch={handleSearch} />
            <Button
              variant="outline"
              className="md:hidden"
              onClick={toggleFilters}
            >
              <ListFilter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <NewsSidebar
            categories={categories}
            className={`${showFilters ? "block" : "hidden"} md:block`}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          <div className="flex-1">
            <NewsHero
              featuredNews={getArticleWithMostCategories(initialNews) as any} // TODO: Fix type error
            />

            <div className="mt-10">
              <NewsCategories
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={handleCategorySelect}
              />

              <NewsGrid
                news={news}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />

              {/* <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={TOTAL_PAGES}
                  onPageChange={handlePageChange}
                />
              </div> */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {(meta.current - 1) * meta.pageSize + 1} to{" "}
                  {Math.min(meta.current * meta.pageSize, meta.total)} of{" "}
                  {meta.total} entries
                </p>
                <Pagination
                  currentPage={meta.current}
                  totalPages={meta.pages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
