"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Target, Award } from "lucide-react";
import { useRouter } from "next/navigation";

interface Quiz {
  id: string;
  title: string;
  description: string;
  time_limit: number;
  max_attempts: number;
  passing_score: number;
  status: string;
  difficulty_id: string;
  created_at: string;
}

interface QuizzesProps {
  quizzes: Quiz[];
}

const Quizzes = ({ quizzes }: QuizzesProps) => {
  const router = useRouter();

  const getDifficultyBadge = (difficultyId: string) => {
    switch (difficultyId) {
      case "dde5490c-3ef6-4c1c-b6cf-dcdc4f5806b1":
        return <Badge variant="default">Beginer</Badge>;
      case "d378cef7-17f9-4ea3-a1f5-5aef1e25513d":
        return <Badge variant="outline">Intermediate</Badge>;
      case "ac24da54-2c52-4c88-9bb0-51665f4a2c60":
        return <Badge variant="destructive">Extreme hard</Badge>;
      case "7fe0233d-479f-4981-98a3-6dbcdbe838e4":
        return <Badge variant="default">Advanced</Badge>;
      default:
        return <Badge variant="default">Beginer</Badge>;
    }
  };

  const handleStartQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Danh sách bài kiểm tra
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow border-2 border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="flex-1">
            <CardHeader className="max-h-[200px] overflow-y-auto mb-5">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                {getDifficultyBadge(quiz.difficulty_id)}
              </div>
              <CardDescription
                className="mt-2"
                dangerouslySetInnerHTML={{ __html: quiz.description }}
              />
            </CardHeader>
            <CardContent className="max-h-[200px] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Thời gian: {quiz.time_limit} phút
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Số lần thử: {quiz.max_attempts}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Điểm đạt: {quiz.passing_score}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Trạng thái: {quiz.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                </div>
              </div>
            </CardContent>
            </div>
            <CardFooter>
              <Button
                className="w-full"
                variant="default"
                onClick={() => handleStartQuiz(quiz.id)}
              >
                Bắt đầu làm bài
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;