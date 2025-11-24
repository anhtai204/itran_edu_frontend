import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { handleGetQuizzesPuhlished } from "@/utils/action";
import Quizzes from "@/components/quiz/quizzes";

// Mock data for quizzes
const quizzes = [
  {
    id: 1,
    title: "Kiểm tra kiến thức cơ bản",
    description: "Bài kiểm tra kiến thức cơ bản về lập trình",
    questionCount: 10,
    timeLimit: 30, // minutes
  },
  {
    id: 2,
    title: "Kiểm tra nâng cao",
    description: "Bài kiểm tra kiến thức nâng cao về lập trình",
    questionCount: 15,
    timeLimit: 45,
  },
  {
    id: 3,
    title: "Kiểm tra tổng hợp",
    description: "Bài kiểm tra tổng hợp các kiến thức",
    questionCount: 20,
    timeLimit: 60,
  },
];

const QuizPage = async () => {
  const quizzes = await handleGetQuizzesPuhlished();
  console.log(">>>quizzes: ", quizzes);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white dark:from-purple-900 dark:to-gray-800">
      <Header />
      {/* <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Danh sách bài kiểm tra
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Số câu hỏi: {quiz.questionCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Thời gian: {quiz.timeLimit} phút
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="default">
                  Bắt đầu làm bài
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main> */}
      <Quizzes quizzes={quizzes} />
      <Footer />
    </div>
  );
};

export default QuizPage;