import type React from "react";
import Footer from "@/components/layout/footer";
import BlogDetail from "@/components/blog/blog-detail/blog-detail-v2";
import HeaderCheckLogin from "@/components/layout/header";


interface BlogsPageProps {
  params: {
    slug: string;
  };
}

const BlogPostPage = ({ params }: BlogsPageProps) => {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white dark:from-purple-900 dark:to-gray-800">
      <HeaderCheckLogin />
      <BlogDetail slug={params.slug}/>
      <Footer />
    </div>
  );
}

export default BlogPostPage;
