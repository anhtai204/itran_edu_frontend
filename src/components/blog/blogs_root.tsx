"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { Search, Calendar, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog/blog-listing/blog-card";

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
import Image from "next/image";
import { sendRequest } from "@/utils/api";
import { RawPost } from "@/utils/action";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "../ui/pagination";

interface IProps {
  initialPosts: RawPost[];
  categories: Category[];
  initialMeta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

// Sample categories
const categories_fake = [
  { name: "All", count: 42 },
  { name: "Education Technology", count: 15 },
  { name: "E-Learning", count: 12 },
  { name: "Corporate Training", count: 8 },
  { name: "Online Courses", count: 7 },
];

const featuredPost_fake = {
  id: "1",
  author: "admin11",
  categories: [],
  comment_status: true,
  content:
    '"<p class=\\"mb-4 whitespace-pre-wrap\\">Nếu bạn không muốn thay đổi backend hoặc cách trên không hiệu quả, bạn có thể xử lý chuỗi bị thoát ký tự ở frontend trước khi truyền vào BlogDetailContent.</p>"',
  create_at: new Date(),
  description: "ádfdsf  dsaf",
  excerpt: null,
  feature_image:
    "uploads/images/1742485447208-39749abe214713612968d10f8be2c43b.jpg",
  ping_status: true,
  post_status: "draft",
  slug: "df-sdf",
  title: "UK minister in US to pitch Britain as global AI investment hub",
  visibility: "public",
  scheduled_at: '2025-03-26T03:34:02.682Z'
};

interface Category {
  name: string;
  count: number;
}

function getPostWithMostCategories(posts: RawPost[]): RawPost | null {
  if (posts.length === 0) return null;

  return posts.reduce(
    (maxPost, post) =>
      post.categories.length > maxPost.categories.length ? post : maxPost,
    posts[0]
  );
}

const BlogMain = (props: IProps) => {
  const { initialPosts, initialMeta, categories } = props;
  const [posts, setPosts] = useState(initialPosts);
  const [meta, setMeta] = useState(initialMeta);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const current = Number(searchParams.get("current")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || initialMeta.pageSize;

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/custom`,
        method: "GET",
        queryParams: { current, pageSize },
      });
      if (res.statusCode === 200) {
        setPosts(res.data.results || []);
        setMeta(res.data.meta);
      }
    };
    if (current !== meta.current) {
      fetchPosts();
    }
  }, [current, pageSize]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("current", page.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  // console.log(">>>categories", categories);
  console.log(">>>posts: ", posts);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredPost, setFeaturedPost] = useState<RawPost>(featuredPost_fake);

  // const feature_post = getPostWithMostCategories(posts);
  // if (featuredPost !== null) {
  //   setFeaturedPost(feature_post);
  // }

  useEffect(() => {
    const feature_post = getPostWithMostCategories(posts);

    if (feature_post) {
      setFeaturedPost({
        ...feature_post,
        create_at: new Date(feature_post.create_at), // Ép kiểu Date
      });
    }
  }, [posts]);

  console.log(">>>feature post: ", getPostWithMostCategories(posts));

  // Filter posts based on selected category and search query
  const filteredPosts = posts.filter((post: any) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (Array.isArray(post.categories) &&
        post.categories.some(
          (category: string) =>
            category.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase()
        ));
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="bg-gradient-to-b from-purple-900 to-indigo-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Blog</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Insights, tips, and resources to help you succeed in your
            educational journey
          </p>

          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search articles..."
                className="pl-10 pr-4 py-6 rounded-full text-gray-800 dark:text-white dark:bg-gray-700 border-0 shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category: Category) => (
            <Button
              key={category.name}
              variant={
                selectedCategory === category.name ? "default" : "outline"
              }
              className={`rounded-full ${
                selectedCategory === category.name
                  ? "bg-gradient-to-r from-purple-600 to-indigo-500"
                  : ""
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <Link href={`/blog/${featuredPost.slug}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-60 md:h-auto">
                  <Image
                    src={
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/${featuredPost.feature_image}` ||
                      ai6
                    }
                    width={700}
                    height={500}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-indigo-500">
                    Featured
                  </Badge>
                </div>
                <div className="p-6 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {featuredPost.categories.map((category, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <Image
                        src={ai4}
                        alt={featuredPost.author}
                        width={500}
                        height={300}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {featuredPost.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {/* <span>{featuredPost.publishedAt}</span> */}
                        <span>{"01 Jan 2024"}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {/* <span>{featuredPost.readTime}</span> */}
                        <span>{"10 min read"}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="mt-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600">
                    Read More <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post: any, index: number) => (
            <BlogCard key={`${post.id}-${index}`} post={post} />
          ))}
        </div>

        {/* Pagination */}
        {/* {filteredPosts.length > 0 ? (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="w-10 h-10 p-0 rounded-full"
                disabled
              >
                &lt;
              </Button>
              <Button
                variant="default"
                className="w-10 h-10 p-0 rounded-full bg-purple-600 hover:bg-purple-700"
              >
                1
              </Button>
              <Button variant="outline" className="w-10 h-10 p-0 rounded-full">
                2
              </Button>
              <Button variant="outline" className="w-10 h-10 p-0 rounded-full">
                3
              </Button>
              <Button variant="outline" className="w-10 h-10 p-0 rounded-full">
                &gt;
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
            <Button
              className="mt-4 rounded-full"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )} */}

        <div className="flex mt-5 items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(meta.current - 1) * meta.pageSize + 1} to{" "}
            {Math.min(meta.current * meta.pageSize, meta.total)} of {meta.total}{" "}
            entries
          </p>
          <Pagination
            currentPage={meta.current}
            totalPages={meta.pages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-purple-100 max-w-2xl mx-auto mb-8">
            Get the latest articles, resources, and updates delivered straight
            to your inbox.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Your email address"
              className="rounded-full bg-white/20 border-transparent placeholder-white/70 text-white"
            />
            <Button className="rounded-full bg-white text-purple-600 hover:bg-purple-50">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogMain;
