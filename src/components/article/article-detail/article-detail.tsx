"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Bookmark,
  ThumbsUp,
  Facebook,
  Twitter,
  Linkedin,
  LinkIcon,
  ChevronRight,
  MessageSquare,
  Link2,
} from "lucide-react";

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
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import { Avatar } from "@radix-ui/react-avatar";
import ArticleDetailContent from "./article-detail-content";
import { RelatedPostCard } from "@/components/blog/blog-single/related-post-card";

// Mock data - in a real app, this would come from an API or CMS
const newsArticles = {
  id: "1",
  title: "The Ultimate Guide to Learning Management Systems in 2023",
  excerpt:
    "Discover the best practices, trends, and tools for implementing a successful Learning Management System in your organization.",
  content: `<p class="mb-4 whitespace-pre-wrap">
  <strong>I – Tương Lai Của Công Nghệ</strong> 🤖✨</p>
  <p class="mb-4 whitespace-pre-wrap">Trí tuệ nhân tạo (AI) đang thay đổi cách chúng ta sống và làm việc mỗi ngày. Từ chatbot hỗ trợ khách hàng, ô tô tự lái, đến các hệ thống dự đoán xu hướng kinh doanh, AI ngày càng đóng vai trò quan trọng trong mọi lĩnh vực.</p>
  <p class="mb-4 whitespace-pre-wrap">Với sự phát triển mạnh mẽ của học máy (Machine Learning) và xử lý ngôn ngữ tự nhiên (NLP), AI không chỉ giúp tự động hóa công việc mà còn tạo ra những giải pháp thông minh, tối ưu hoá năng suất.</p>
  <p class="mb-4 whitespace-pre-wrap">Tuy nhiên, AI cũng đặt ra những thách thức về đạo đức, bảo mật dữ liệu và ảnh hưởng đến thị trường lao động. Vì vậy, việc phát triển AI một cách bền vững và có trách nhiệm là điều cần thiết.</p>
  <p class="mb-4 whitespace-pre-wrap">Bạn nghĩ gì về AI? Nó sẽ giúp ích hay là một mối đe dọa? Hãy chia sẻ suy nghĩ của bạn!</p>`,
  publishedAt: "2023-06-15",
  readTime: "8 min read",
  author: "Jane Smith",
  categories: ["Education Technology", "E-Learning", "Corporate Training"],
  tags: ["LMS", "Online Learning", "EdTech", "Training", "Education"],
  feature_image: ai1,
  comments: [
    {
      id: 1,
      author: "Michael Johnson",
      avatar: ai1,
      date: "2023-06-16",
      content:
        "Great article! I've been using Moodle for years and it's been a game-changer for our university.",
      likes: 12,
      replies: [
        {
          id: 101,
          author: "Jane Smith",
          avatar: doof,
          date: "2023-06-16",
          content:
            "Thanks Michael! Moodle is definitely one of the most versatile options out there.",
          likes: 3,
        },
      ],
    },
    {
      id: 2,
      author: "Sarah Williams",
      avatar: ai2,
      date: "2023-06-17",
      content:
        "I've been considering implementing an LMS for our company's training program. This article was very helpful in understanding the options available.",
      likes: 8,
      replies: [],
    },
  ],
  relatedPosts: [
    {
      id: 1,
      title: "10 Best Practices for Online Course Creation",
      excerpt:
        "Learn how to create engaging and effective online courses that keep students coming back for more.",
      image: ai3,
      author: "John Doe",
      publishedAt: "2023-05-20",
      readTime: "6 min read",
      slug: "best-practices-online-course-creation",
    },
    {
      id: 2,
      title: "The Future of E-Learning: Trends to Watch in 2023",
      excerpt:
        "Discover the emerging trends that are shaping the future of online education and e-learning.",
      image: ai4,
      author: "Emily Johnson",
      publishedAt: "2023-06-05",
      readTime: "5 min read",
      slug: "future-of-elearning-trends",
    },
    {
      id: 3,
      title: "How to Choose the Right LMS for Your Organization",
      excerpt:
        "A step-by-step guide to evaluating and selecting the perfect Learning Management System for your specific needs.",
      image: ai5,
      author: "Robert Wilson",
      publishedAt: "2023-06-10",
      readTime: "7 min read",
      slug: "choose-right-lms-organization",
    },
  ],
};
interface NewsArticleProps {
  slug: string;
}

export function NewsArticle({ slug }: NewsArticleProps) {
  const router = useRouter();

  const session = useSession();
  const userId = session?.data?.user?.id;
  const [relatedArticle, setRelatedArticle] = useState([
    {
      id: 1,
      title: "10 Best Practices for Online Course Creation",
      excerpt:
        "Learn how to create engaging and effective online courses that keep students coming back for more.",
      image: ai3,
      author: "John Doe",
      publishedAt: "2023-05-20",
      readTime: "6 min read",
      slug: "best-practices-online-course-creation",
    },
    {
      id: 2,
      title: "The Future of E-Learning: Trends to Watch in 2023",
      excerpt:
        "Discover the emerging trends that are shaping the future of online education and e-learning.",
      image: ai4,
      author: "Emily Johnson",
      publishedAt: "2023-06-05",
      readTime: "5 min read",
      slug: "future-of-elearning-trends",
    },
    {
      id: 3,
      title: "How to Choose the Right LMS for Your Organization",
      excerpt:
        "A step-by-step guide to evaluating and selecting the perfect Learning Management System for your specific needs.",
      image: ai5,
      author: "Robert Wilson",
      publishedAt: "2023-06-10",
      readTime: "7 min read",
      slug: "choose-right-lms-organization",
    },
  ]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const [article, setArticle] = useState(newsArticles);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const articleRes = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news/custom/${slug}`,
          method: "GET",
        });

        console.log("Raw response:", articleRes);
        if (articleRes.statusCode === 200) {
          setArticle(articleRes.data); // Cập nhật state post
        } else {
          console.error("Post API error:", articleRes);
        }
      } catch (error) {
        console.error("Fetch post error:", error);
      }
    };

    fetchPost();
  }, [slug]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <p className="mb-8">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/news")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to News
        </Button>
      </div>
    );
  }

  // return (
  //   <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 py-8">
  //     <div className="max-w-3xl container mx-auto px-4">
  //       <div className="max-w-4xl mx-auto">
  //         {/* Breadcrumbs */}
  //         <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
  //           <Button
  //             variant="ghost"
  //             size="sm"
  //             className="p-0 h-auto"
  //             onClick={() => router.push("/news")}
  //           >
  //             <ArrowLeft className="mr-2 h-4 w-4" />
  //             Back to News
  //           </Button>
  //           <span className="mx-2">/</span>
  //           <span>{article.category}</span>
  //         </div>

  //         {/* Article title */}
  //         <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
  //           {article.title}
  //         </h1>

  //         {/* Meta information */}
  //         <div className="flex flex-wrap items-center gap-4 mb-8">
  //           <div className="flex items-center">
  //             <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
  //               <Image
  //                 src={article.author.avatar || "/placeholder.svg"}
  //                 alt={article.author.name}
  //                 fill
  //                 className="object-cover"
  //               />
  //             </div>
  //             <div>
  //               <p className="font-medium text-gray-900 dark:text-white">
  //                 {article.author.name}
  //               </p>
  //               <p className="text-sm text-gray-600 dark:text-gray-400">
  //                 {article.author.role}
  //               </p>
  //             </div>
  //           </div>

  //           <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
  //             <Calendar className="h-4 w-4 mr-1" />
  //             <span className="mr-4">{article.date}</span>
  //             <Clock className="h-4 w-4 mr-1" />
  //             <span>{article.readTime}</span>
  //           </div>

  //           <Badge className="bg-indigo-600 hover:bg-indigo-700">
  //             {article.category}
  //           </Badge>
  //         </div>

  //         {/* Featured image */}
  //         <div className="relative h-[400px] w-full rounded-xl overflow-hidden mb-8">
  //           <Image
  //             src={article.image || "/placeholder.svg"}
  //             alt={article.title}
  //             fill
  //             className="object-cover"
  //           />
  //         </div>

  //         {/* Article content */}
  //         <div
  //           className="prose prose-lg dark:prose-invert max-w-none mb-10"
  //           dangerouslySetInnerHTML={{ __html: article.content }}
  //         />

  //         {/* Tags */}
  //         <div className="flex flex-wrap gap-2 mb-8">
  //           {article.tags.map((tag) => (
  //             <Badge key={tag} variant="outline" className="text-sm">
  //               #{tag}
  //             </Badge>
  //           ))}
  //         </div>

  //         {/* Interaction buttons */}
  //         <div className="flex flex-wrap justify-between items-center mb-10">
  //           <div className="flex gap-2">
  //             <Button variant="outline" size="sm">
  //               <ThumbsUp className="h-4 w-4 mr-2" />
  //               Like
  //             </Button>
  //             <Button variant="outline" size="sm">
  //               <Bookmark className="h-4 w-4 mr-2" />
  //               Save
  //             </Button>
  //           </div>

  //           <div className="flex gap-2">
  //             <Button
  //               variant="outline"
  //               size="icon"
  //               className="h-9 w-9 rounded-full"
  //             >
  //               <Facebook className="h-4 w-4" />
  //               <span className="sr-only">Share on Facebook</span>
  //             </Button>
  //             <Button
  //               variant="outline"
  //               size="icon"
  //               className="h-9 w-9 rounded-full"
  //             >
  //               <Twitter className="h-4 w-4" />
  //               <span className="sr-only">Share on Twitter</span>
  //             </Button>
  //             <Button
  //               variant="outline"
  //               size="icon"
  //               className="h-9 w-9 rounded-full"
  //             >
  //               <Linkedin className="h-4 w-4" />
  //               <span className="sr-only">Share on LinkedIn</span>
  //             </Button>
  //             <Button
  //               variant="outline"
  //               size="icon"
  //               className="h-9 w-9 rounded-full"
  //             >
  //               <LinkIcon className="h-4 w-4" />
  //               <span className="sr-only">Copy link</span>
  //             </Button>
  //           </div>
  //         </div>

  //         <Separator className="mb-10" />

  //         {/* Related news */}
  //         <div className="mb-10">
  //           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
  //             Related News
  //           </h2>

  //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //             {article.relatedNews.map((news) => (
  //               <Link
  //                 key={news.id}
  //                 href={`/news/${news.slug}`}
  //                 className="block group"
  //               >
  //                 <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
  //                   <div className="relative h-40 w-full">
  //                     <Image
  //                       src={news.image || "/placeholder.svg"}
  //                       alt={news.title}
  //                       fill
  //                       className="object-cover transition-transform duration-300 group-hover:scale-105"
  //                     />
  //                     <div className="absolute top-2 left-2">
  //                       <Badge className="bg-indigo-600 hover:bg-indigo-700 text-xs">
  //                         {news.category}
  //                       </Badge>
  //                     </div>
  //                   </div>

  //                   <div className="p-4">
  //                     <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
  //                       {news.title}
  //                     </h3>

  //                     <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-2">
  //                       <Calendar className="h-3 w-3 mr-1" />
  //                       <span>{news.date}</span>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </Link>
  //             ))}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link
            href="/"
            className="hover:text-purple-600 dark:hover:text-purple-400"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link
            href="/news"
            className="hover:text-purple-600 dark:hover:text-purple-400"
          >
            News
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-700 dark:text-gray-300">
            Current Article
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.categories.map((category: any, index: any) => (
            <Link
              href={`/news/category/${category
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              key={index}
            >
              <Badge
                variant="outline"
                className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
              >
                {category}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {article.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {/* <span>{post.publishedAt}</span> */}
            <span>{"01 Jan 2024"}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {/* <span>{post.readTime}</span> */}
            <span>10 min read</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            {/* <span>{post.comments.length} comments</span> */}
            <span>{2}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-xl overflow-hidden">
          <Image
            src={
              `${process.env.NEXT_PUBLIC_BACKEND_URL || "/placeholder.svg"}/${
                article.feature_image
              }` || ai6
            }
            width={800}
            height={500}
            alt={article.title}
            className="w-3xl h-auto"
          />
        </div>

        {/* Author Info - Mobile */}
        <div className="md:hidden bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-8">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-purple-200 dark:border-purple-800">
              {/* <Image src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} /> */}
              <Image src={ai1 || "/placeholder.svg"} alt={"abc"} />
            </Avatar>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {article.author}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {/* {post.author.role} */}
                {"Education Technology Specialist"}
              </div>
            </div>
          </div>
        </div>

        {/* Content and Sidebar Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div>
            {/* Article Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8">
              <ArticleDetailContent content={article.content} />
            </div>
            {/* Sidebar */}
            <div className="flex space-y-8">
              {/* Author Info - Desktop */}
              <div className="md:w-1/3 hidden md:block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="h-20 w-20 mb-4 border-2 border-purple-200 dark:border-purple-800">
                    <Image src={ai7 || "/placeholder.svg"} alt={article.author} />
                  </Avatar>
                  <div className="font-medium text-lg text-gray-900 dark:text-white">
                    {article.author || "bcsna"}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {/* {post.author.role} */}
                    {"Education Technology Specialist"}
                  </div>
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {/* {post.author.bio} */}
                  {
                    "Jane Smith is an Education Technology Specialist with over 10 years of experience implementing learning solutions for organizations of all sizes."
                  }
                </p>
                <Button variant="outline" className="w-full mt-4 rounded-full">
                  View Profile
                </Button>
              </div>

              {/* Related Posts */}
              <div className="ml-3 md:w-2/3 h-fit bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Related Posts
                </h3>
                <div className="space-y-4">
                  {relatedArticle.map((relatedPost: any) => (
                    <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mr-auto ml-auto md:w-2/4 mb-10 mt-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 shadow-sm text-white">
              <h3 className="text-lg font-semibold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-sm text-purple-100 mb-4">
                Get the latest articles and resources sent straight to your
                inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-full text-gray-800 text-sm"
                />
                <Button
                  type="submit"
                  className="w-full bg-white text-purple-600 hover:bg-purple-50 rounded-full"
                >
                  Subscribe
                </Button>
              </form>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: any, index: any) => (
                  // {post.categories.map((tag: any, index: any) => (
                  <Link
                    href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    key={index}
                  >
                    <Badge
                      variant="outline"
                      className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Sharing */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full ${
                    isBookmarked ? "text-purple-600 dark:text-purple-400" : ""
                  }`}
                  onClick={handleBookmark}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Share:
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <Link2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
