import type React from "react";
import Footer from "@/components/layout/footer";
import BlogDetail from "@/components/blog/blog-detail/blog-detail-v2";
import HeaderCheckLogin from "@/components/layout/header";
import QuizDetail from "@/components/quiz/quiz-detail";
import QuizOverview from "@/components/quiz/quiz-overview";


interface QuizPageProps {
  params: {
    id: string;
  };
}

export default async function QuizPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white dark:from-purple-900 dark:to-gray-800">
      <HeaderCheckLogin />
      {/* <QuizDetail quizId={params.id}/> */}
      <QuizOverview quizId={params.id}/>
      <Footer />
    </div>
  );
}
