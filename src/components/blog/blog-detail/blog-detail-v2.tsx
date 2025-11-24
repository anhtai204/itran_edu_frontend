"use client";
import Link from "next/link";
import type React from "react";

import { useEffect, useState } from "react";

import {
  Calendar,
  Clock,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  ThumbsUp,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { BlogComment } from "../blog-single/comment-v2";
import { RelatedPostCard } from "@/components/blog/blog-single/related-post-card";
import doof from "@/assets/images/doof.jpg";

import ai1 from "@/assets/images/ai1.jpg";
import ai2 from "@/assets/images/ai2.jpg";
import ai3 from "@/assets/images/ai3.jpg";
import ai4 from "@/assets/images/ai4.jpg";
import ai5 from "@/assets/images/ai5.jpg";
import ai6 from "@/assets/images/ai6.png";
import ai7 from "@/assets/images/ai7.png";

import Image from "next/image";
import { sendRequest } from "@/utils/api";
import BlogDetailContent from "./blog-detail-content";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ReplyType {
  id: string; // Đổi từ number sang string để khớp với backend
  author: string;
  date: string;
  content: string;
  likes: number;
  avatar?: string; // Optional vì backend không trả về avatar
  status?: string;
  user_id?: string;
}

interface CommentType {
  id: string; // Đổi từ number sang string
  author: string;
  date: string;
  content: string;
  likes: number;
  replies: ReplyType[];
  status?: string;
  user_id?: string;
}

interface IBackendRes<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Sample blog post data
const postFake = {
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
  // author: {
  //   name: "Jane Smith",
  //   role: "Education Technology Specialist",
  //   avatar: doof,
  //   bio: "Jane Smith is an Education Technology Specialist with over 10 years of experience implementing learning solutions for organizations of all sizes.",
  // },
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

const commentFake: CommentType[] = [
  {
    id: "1", // Đổi sang string
    author: "Michael Johnson",
    date: "2023-06-16",
    content:
      "Great article! I've been using Moodle for years and it's been a game-changer for our university.",
    likes: 12,
    replies: [
      {
        id: "101", // Đổi sang string
        author: "Jane Smith",
        date: "2023-06-16",
        content:
          "Thanks Michael! Moodle is definitely one of the most versatile options out there.",
        likes: 3,
      },
    ],
  },
  {
    id: "2", // Đổi sang string
    author: "Sarah Williams",
    date: "2023-06-17",
    content:
      "I've been considering implementing an LMS for our company's training program. This article was very helpful in understanding the options available.",
    likes: 8,
    replies: [],
  },
];

const BlogDetail = (props: any) => {
  const { slug } = props;

  const session = useSession();
  const userId = session?.data?.user?.id;
  // console.log('>>>userId: ', userId);

  const [post, setPost] = useState(postFake);
  const [relatedPosts, setRelatedPosts] = useState([
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
  // const [comments, setComments] = useState(commentFake);
  const [comments, setComments] = useState<CommentType[]>(commentFake);
  const [comment, setComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  // const [likeCount, setLikeCount] = useState(0);
  // const [hasLiked, setHasLiked] = useState(false);
  const [commentStatus, setCommentStatus] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Bước 1: Lấy dữ liệu post
        const postRes = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/custom/${slug}`,
          method: "GET",
        });

        console.log("Raw response:", postRes);
        if (postRes.statusCode === 200) {
          setPost(postRes.data); // Cập nhật state post

          // Bước 2: Lấy comments dựa trên post.id
          try {
            const commentsRes = await sendRequest<IBackendRes<any>>({
              url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments/get-by-post/${postRes.data.id}`,
              method: "GET",
            });

            if (commentsRes.statusCode === 200) {
              console.log("post comments:", commentsRes);
              setComments(commentsRes.data);
              setCommentStatus(commentsRes.data.comment_status);
            } else {
              console.error("Comments API error:", commentsRes);
            }
          } catch (error) {
            console.error("Fetch comments error:", error);
          }

          // Bước 3: Lấy số lượt likes dựa trên post.id
          try {
            const likesRes = await sendRequest<IBackendRes<any>>({
              url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-likes/count-likes/${postRes.data.id}`,
              method: "GET",
            });
            console.log(">>>post likes: ", likesRes);
            if (likesRes.statusCode === 200) {
              setLikeCount(likesRes.data);
            }
          } catch (error) {
            console.error("Fetch count like error:", error);
          }
        } else {
          console.error("Post API error:", postRes);
        }
      } catch (error) {
        console.error("Fetch post error:", error);
      }
    };

    fetchPost();
  }, [slug]);

  const handleLike = async () => {
    try {
      if (hasLiked) {
        // Nếu đã like, gửi request để unlike (xóa lượt like)
        await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-likes/unlike/${userId}/${post.id}`,
          method: "DELETE",
        });
        setLikeCount(likeCount - 1);
        setHasLiked(false);
      } else {
        // Nếu chưa like, gửi request để like (thêm lượt like)
        await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-likes`,
          method: "POST",
          body: {
            user_id: userId,
            post_id: post.id,
          },
        });
        setLikeCount(likeCount + 1);
        setHasLiked(true);
      }
    } catch (error) {
      console.error("Handle like error:", error);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("You must be logged in to comment");
      return;
    }
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments`,
        method: "POST",
        body: {
          user_id: userId,
          post_id: post.id,
          parent_id: null,
          content: comment,
          // status: "pending",
        },
      });

      console.log(">>>response comment: ", response);
      console.log(">>>session: ", session);

      if (response.statusCode === 201) {
        const newComment = {
          id: response.data.id,
          author: session?.data?.user?.username || "Anonymous",
          date: new Date().toISOString().split("T")[0],
          content: response.data.content,
          likes: 0,
          replies: [],
          status: response.data.status, // Add status to the new comment
          user_id: userId, // Add user_id to the new comment
        };
        setComments((prevComments) => [...prevComments, newComment]);
        setComment("");
        toast.success("Comment submitted and pending approval");
      }
    } catch (error) {
      console.error("Submit comment error:", error);
      toast.error("Failed to submit comment");
    }
  };

  const handleReplySubmit = async (parentId: string, replyContent: string) => {
    if (!userId) {
      toast.error("You must be logged in to reply");
      return;
    }
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      const response = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments`,
        method: "POST",
        body: {
          user_id: userId,
          post_id: post.id,
          parent_id: parentId,
          content: replyContent,
          // status: "pending",
        },
      });

      console.log(">>>response reply: ", response);

      if (response.statusCode === 201) {
        const newReply: ReplyType = {
          id: response.data.id,
          author: session?.data?.user?.username || "Anonymous",
          date: new Date().toISOString().split("T")[0],
          content: response.data.content,
          likes: 0,
          status: response.data.status, // Add status to the new reply
          user_id: userId, // Add user_id to the new reply
        };

        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === parentId
              ? { ...comment, replies: [...comment.replies, newReply] }
              : comment
          )
        );
        toast.success("Reply submitted and pending approval");
      }
    } catch (error) {
      console.error("Submit reply error:", error);
      toast.error("Failed to submit reply");
    }
  };

  // Handle editing a comment
  const handleEditComment = async (
    id: string,
    content: string,
    isReply: boolean
  ) => {
    try {
      const response = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments/${id}`,
        method: "PATCH",
        body: {
          content,
          status: "pending", // Reset to pending when edited
        },
      });

      if (response.statusCode === 200) {
        if (isReply) {
          // Update a reply
          setComments((prevComments) =>
            prevComments.map((comment) => ({
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === id
                  ? { ...reply, content, status: "pending" }
                  : reply
              ),
            }))
          );
        } else {
          // Update a main comment
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === id
                ? { ...comment, content, status: "pending" }
                : comment
            )
          );
        }
        toast.success("Comment updated and pending approval");
      }
    } catch (error) {
      console.error("Edit comment error:", error);
      toast.error("Failed to update comment");
      throw error;
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (id: string, isReply: boolean) => {
    try {
      const response = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments/${id}`,
        method: "DELETE",
      });

      if (response.statusCode === 200) {
        if (isReply) {
          // Remove a reply
          setComments((prevComments) =>
            prevComments.map((comment) => ({
              ...comment,
              replies: comment.replies.filter((reply) => reply.id !== id),
            }))
          );
        } else {
          // Remove a main comment
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== id)
          );
        }
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      console.error("Delete comment error:", error);
      toast.error("Failed to delete comment");
      throw error;
    }
  };

  // Handle liking a comment
  const handleLikeComment = async (id: string, isReply: boolean) => {
    if (!userId) {
      toast.error("You must be logged in to like comments");
      return;
    }

    try {
      const response = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments-likes`,
        method: "POST",
        body: {
          user_id: userId,
          post_comment_id: id,
        },
      });

      if (response.statusCode === 201) {
        // Update UI to reflect the like
        if (isReply) {
          // Update a reply like count
          setComments((prevComments) =>
            prevComments.map((comment) => ({
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === id ? { ...reply, likes: reply.likes + 1 } : reply
              ),
            }))
          );
        } else {
          // Update a main comment like count
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === id
                ? { ...comment, likes: comment.likes + 1 }
                : comment
            )
          );
        }
      }
    } catch (error) {
      console.error("Like comment error:", error);
      toast.error("Failed to like comment");
      throw error;
    }
  };

  return (
    <>
      {/* Blog Post Content */}
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
              href="/blog"
              className="hover:text-purple-600 dark:hover:text-purple-400"
            >
              Blog
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700 dark:text-gray-300">
              Current Article
            </span>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category: any, index: any) => (
              <Link
                href={`/blog/category/${category
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
            {post.title}
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
                  post.feature_image
                }` || ai6
              }
              width={800}
              height={500}
              alt={post.title}
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
                  {post.author}
                  {"John"}
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
                {/* <div
                  className="prose prose-gray dark:prose-invert max-w-none"
                  // dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderKatex(post.content)) }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                /> */}
                <BlogDetailContent content={post.content} />
              </div>
              {/* Sidebar */}
              <div className="flex space-y-8">
                {/* Author Info - Desktop */}
                <div className="md:w-1/3 hidden md:block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col items-center text-center mb-4">
                    <Avatar className="h-20 w-20 mb-4 border-2 border-purple-200 dark:border-purple-800">
                      <Image
                        src={ai7 || "/placeholder.svg"}
                        alt={post.author}
                      />
                    </Avatar>
                    <div className="font-medium text-lg text-gray-900 dark:text-white">
                      {post.author || "bcsna"}
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
                  <Button
                    variant="outline"
                    className="w-full mt-4 rounded-full"
                  >
                    View Profile
                  </Button>
                </div>

                {/* Related Posts */}
                <div className="ml-3 md:w-2/3 h-fit bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Related Posts
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost: any) => (
                      <RelatedPostCard
                        key={relatedPost.id}
                        post={relatedPost}
                      />
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
                  {post.tags.map((tag: any, index: any) => (
                    // {post.categories.map((tag: any, index: any) => (
                    <Link
                      href={`/blog/tag/${tag
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
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
                    className={`rounded-full flex items-center gap-1 ${
                      hasLiked ? "text-red-500 dark:text-red-400" : ""
                    }`}
                    onClick={handleLike}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{likeCount}</span>
                  </Button>
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

              {/* Comments Section */}
              {!commentStatus ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                    Comments ({comments.length})
                  </h3>

                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="mb-8">
                    <Textarea
                      placeholder="Write your comment..."
                      className="mb-4 min-h-[100px] rounded-xl dark:bg-gray-700 dark:border-gray-600"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                      type="submit"
                      className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600"
                    >
                      Post Comment
                    </Button>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments.map((comment: any) => (
                      <BlogComment
                        key={comment.id}
                        comment={comment}
                        currentUserId={userId}
                        onReply={handleReplySubmit}
                        onEdit={handleEditComment}
                        onDelete={handleDeleteComment}
                        onLike={handleLikeComment}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8">
                  <p className="text-gray-600 dark:text-gray-300">
                    Comments are disabled for this post.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default BlogDetail;
