import type { Metadata } from "next";
import Footer from "@/components/layout/footer";
import { NewsArticle } from "@/components/article/article-detail/article-detail";
import HeaderCheckLogin from "@/components/layout/header";

interface NewsArticlePageProps {
  params: {
    slug: string;
  };
}

// This would typically come from a CMS or API
export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  // In a real app, fetch the news article data based on the slug
  return {
    title: `News Article | Itran Education`,
    description: "Latest news and updates from Itran Education",
  };
}

export default function NewsArticlePage({ params }: NewsArticlePageProps) {
  // console.log('>>>params: ', params.slug);
  return (
    <>
      <HeaderCheckLogin />
      <NewsArticle slug={params.slug} />
      <Footer />
    </>
  );
}