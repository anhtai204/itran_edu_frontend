
"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import {
  QuizQuestion,
  type Question,
  type Answer,
} from "@/components/quiz/quiz-question";
import { QuizTimer } from "@/components/quiz/quiz-timer";
import { QuizSidebar } from "@/components/quiz/quiz-sidebar";
import { QuizViewToggle } from "@/components/quiz/quiz-view-toggle";
import { QuizNavigation } from "@/components/quiz/quiz-navigation";
import { QuizResult } from "@/components/quiz/quiz-result";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";
import { getQuizData } from "@/utils/action";

// Mock function to fetch quiz data
// async function getQuizData(quizId: string) {
//   // In a real application, this would fetch from an API
//   const data = {
//     title: "Bài kiểm tra mẫu",
//     description: "Đây là một bài kiểm tra mẫu để kiểm tra kiến thức của bạn.",
//     timeLimit: 3600, // 1 hour in seconds
//     passingScore: 70, // 70% to pass
//     quizzes: [
//       {
//         id: "f9212825-106d-4b5a-a29c-a1bbc83c2a26",
//         question_text: `
//       <strong><u>afds</u></strong>
//       <ol class="list-decimal ml-3">
//         <li>
//           <a target="_blank" rel="noopener noreferrer nofollow" href="aaa">sfdfa</a><blockquote>
//           <strong><u>sfasdf</u></strong>
//           <ul class="list-disc ml-3">
//             <li>
//               <strong><u>asdf</u></strong>
//             </li>
//           </ul></blockquote>
//         </li>
//       </ol>`,
//         question_type: "single-choice",
//         content: {
//           options: [
//             {
//               id: "1",
//               text: "a",
//             },
//             {
//               id: "2",
//               text: "b",
//             },
//             {
//               id: "option-1745659965818",
//               text: "c",
//             },
//           ],
//         },
//         correctAnswer: "1",
//         points: 1,
//         question_order: 1,
//       },
//       {
//         id: "8632f37a-6ff2-4174-831e-5225be047388",
//         question_text: "multiple choice ",
//         question_type: "multiple-choice",
//         content: {
//           options: [
//             {
//               id: "1",
//               text: "aa",
//             },
//             {
//               id: "2",
//               text: "bb",
//             },
//             {
//               id: "option-1745660107465",
//               text: "c",
//             },
//           ],
//         },
//         correctAnswers: ["1", "2"],
//         points: 1,
//         question_order: 2,
//       },
//       {
//         id: "f582acca-673d-49c9-8f38-ece34eb68100",
//         question_text: "true false question",
//         question_type: "true-false",
//         correctAnswer: true,
//         explanation: "",
//         points: 1,
//         question_order: 3,
//       },
//       {
//         id: "8857a44d-a58e-4231-b1cb-d6dbd7cf18a3",
//         question_text: "matching question",
//         question_type: "matching",
//         content: {
//           items: [
//             {
//               id: "c620b259-b090-424d-a25a-005ebcf57a0c",
//               text: "a",
//             },
//             {
//               id: "65ad66a8-1719-41d1-b8a9-56aa9eaeb29e",
//               text: "<strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. [[]] psum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived [[]] only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the [[]] of Letraset sheets containing Lorem Ipsum passages,",
//             },
//           ],
//           matches: [
//             {
//               id: "1caaf6b3-4051-443b-ab7e-656187c7b801",
//               text: "1",
//             },
//             {
//               id: "8cca6354-1761-4f8b-bcea-593fec2e6c57",
//               text: "and more <strong>recently with desktop</strong> publishing software like Aldus PageMaker including versions of Lorem Ipsum",
//             },
//           ],
//           correct_matches: [
//             {
//               item_id: "c620b259-b090-424d-a25a-005ebcf57a0c",
//               match_id: "1caaf6b3-4051-443b-ab7e-656187c7b801",
//             },
//             {
//               item_id: "65ad66a8-1719-41d1-b8a9-56aa9eaeb29e",
//               match_id: "8cca6354-1761-4f8b-bcea-593fec2e6c57",
//             },
//           ],
//         },
//         points: 1,
//         question_order: 4,
//       },
//       {
//         id: "960c1bad-c65c-4fbf-80af-04dc4888ff5f",
//         question_text: "g",
//         question_type: "image-matching",
//         content: {
//           image_urls: [
//             {
//               id: "1caaf6b3-4051-443b-ab7e-656187c7b801",
//               url: "/assets/images/ai1.jpg",
//             },
//             {
//               id: "8cca6354-1761-4f8b-bcea-593fec2e6c57",
//               url: "/assets/images/ai2.jpg",
//             },
//           ],
//           labels: [
//             {
//               id: "c620b259-b090-424d-a25a-005ebcf57a0c",
//               label: "vvv",
//             },
//             {
//               id: "65ad66a8-1719-41d1-b8a9-56aa9eaeb29e",
//               label: "aaa",
//             },
//           ],
//           correct_matches: [
//             {
//               url_id: "1caaf6b3-4051-443b-ab7e-656187c7b801",
//               label_id: "c620b259-b090-424d-a25a-005ebcf57a0c",
//             },
//             {
//               url_id: "8cca6354-1761-4f8b-bcea-593fec2e6c57",
//               label_id: "65ad66a8-1719-41d1-b8a9-56aa9eaeb29e",
//             },
//           ],
//         },
//         points: 1,
//         question_order: 5,
//       },
//       {
//         id: "378efb0d-1561-4aac-a0b7-677188db9ce3",
//         question_text:
//           "<strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. [[]] psum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived [[]] only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the [[]] of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
//         question_type: "fill-blanks",
//         content: {
//           answers: [
//             {
//               id: "1",
//               text: "not",
//             },
//             {
//               id: "2",
//               text: "Lorem",
//             },
//             {
//               id: "3",
//               text: "release",
//             },
//           ],
//           correct_answers: ["1", "2", "3"],
//         },
//         points: 1,
//         question_order: 6,
//       },
//     ],
//   };

//   // Wait a bit to simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   return data;
// }


export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params);
  const router = useRouter();

  const [quizData, setQuizData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(Answer | null)[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timeGLeft, setTimeGLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);

  // View mode: "single" for one question at a time, "multiple" for all questions
  const [viewMode, setViewMode] = useState<"single" | "multiple">("single");

  // Use a ref to track the current question for cleanup
  const questionRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    console.log("answers:", answers);
  }, [answers]);

  useEffect(() => {
    setIsMounted(true);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getQuizData(quizId);
        console.log('>>>quiz data: ', data)
        setQuizData(data);

        // if (data) {
        //   // Initialize answers array with nulls
        //   setAnswers(new Array(data.quizzes.length).fill(null));
        //   setCorrectAnswers(new Array(data.quizzes.length).fill(false));
        // }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [quizId]);

  // Handle answer selection
  const handleAnswerSelect = (questionIndex: number, answer: Answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestion < quizData.quizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Handle quiz submission
  const handleSubmit = () => {
    // Calculate score and mark correct/incorrect answers
    let correctCount = 0;
    const newCorrectAnswers = [...correctAnswers];

    quizData.quizzes.forEach((question, index) => {
      const isCorrect = newCorrectAnswers[index] = answers[index] === question.correctAnswer;
      if (isCorrect) {
        correctCount++;
      }
    });

    setCorrectAnswers(newCorrectAnswers);
    setScore(correctCount);
    setQuizCompleted(true);
    setTimeTaken(quizData.timeLimit - timeGLeft);
  };

  // Handle time up
  const handleTimeUp = () => {
    handleSubmit();
  };

  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true);
  };

  // Review answers
  const reviewAnswers = () => {
    setShowResults(true);
    setCurrentQuestion(0);
  };

  // Toggle view mode
  const toggleViewMode = (mode: "single" | "multiple") => {
    setViewMode(mode);
  };

  // Handle question selection from sidebar
  const handleQuestionSelect = (index: number) => {
    setCurrentQuestion(index);

    // If in multiple view mode, scroll to the selected question
    if (viewMode === "multiple" && questionRefs.current[index]) {
      questionRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Check if all questions have been answered
  const allQuestionsAnswered = answers.every((answer) => answer !== null);

  // Get answered questions indices
  const answeredQuestions = answers
    .map((answer, index) => (answer !== null ? index : -1))
    .filter((index) => index !== -1);

  if (!isMounted) {
    return null; // Prevent hydration errors
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Đang tải bài kiểm tra...
          </p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">
            Không tìm thấy bài kiểm tra
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Bài kiểm tra bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button className="w-full" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  // Quiz not started yet - show intro screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">
                {quizData.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {quizData.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Số câu hỏi
                  </div>
                  <div className="text-xl font-bold">
                    {quizData.quizzes.length} câu
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Thời gian làm bài
                  </div>
                  <div className="text-xl font-bold">
                    {Math.floor(quizData.timeLimit / 60)} phút
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Điểm đạt
                  </div>
                  <div className="text-xl font-bold">
                    {quizData.passingScore}%
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-4 mb-8">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Lưu ý:
                </h3>
                <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1 text-sm">
                  <li>
                    Bạn không thể tạm dừng bài kiểm tra sau khi đã bắt đầu
                  </li>
                  <li>
                    Đảm bảo bạn có đủ thời gian để hoàn thành bài kiểm tra
                  </li>
                  <li>Bài kiểm tra sẽ tự động nộp khi hết thời gian</li>
                  <li>Bạn cần trả lời tất cả các câu hỏi trước khi nộp bài</li>
                  <li>
                    Bạn có thể chọn xem từng câu hỏi hoặc nhiều câu hỏi cùng lúc
                  </li>
                  <li>
                    Danh sách câu hỏi luôn hiển thị ở bên phải để dễ dàng điều
                    hướng
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={startQuiz}
                  size="lg"
                  className="flex-1 min-h-10"
                >
                  Bắt đầu làm bài
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex-1 min-h-10"
                  onClick={() => window.history.back()}
                >
                  Quay lại
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz completed - show results
  if (quizCompleted && !showResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <QuizResult
            score={score}
            totalQuestions={quizData.quizzes.length}
            timeTaken={timeTaken}
            onReview={reviewAnswers}
          />
        </div>
      </div>
    );
  }

  // Quiz in progress or reviewing answers
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
            <h1 className="text-xl font-bold">{quizData.title}</h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {!quizCompleted && (
                <QuizTimer
                  duration={quizData.timeLimit}
                  onTimeUp={handleTimeUp}
                  isPaused={quizCompleted}
                  setTimeGLeft={setTimeGLeft}
                />
              )}

              <QuizViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4">
            {/* Main content area - takes 3/4 of the space on large screens */}
            <div className="lg:col-span-3 p-6 h-full overflow-hidden">
              {viewMode === "single" ? (
                // Single question view
                <div>
                  <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Câu hỏi {currentQuestion + 1} / {quizData.quizzes.length}
                  </div>

                  <div
                    key={`question-${currentQuestion}`}
                    ref={(el) => {
                      if (el) questionRefs.current[currentQuestion] = el;
                    }}
                  >
                    
                    <QuizQuestion
                      question={quizData.quizzes[currentQuestion]}
                      currentAnswer={answers[currentQuestion]}
                      onAnswerSelect={(answer) =>
                        handleAnswerSelect(currentQuestion, answer)
                      }
                      showResult={quizCompleted}
                      questionNumber={currentQuestion + 1}
                    />
                  </div>

                  <QuizNavigation
                    currentQuestion={currentQuestion}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    showResult={quizCompleted}
                  />
                </div>
              ) : (
                // Multiple questions view
                <div className="space-y-8">
                  <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Tất cả câu hỏi ({quizData.quizzes.length})
                  </div>

                  {quizData.quizzes.map((question, index) => (
                    <div
                      id={`all-question-${question.id}`}
                      key={`questions-${index}`}
                      ref={(el) => {
                        if (el) questionRefs.current[index] = el;
                      }}
                      className={cn(
                        "p-4 border border-gray-200 dark:border-gray-700 rounded-lg",
                        index === currentQuestion && "ring-2 ring-primary"
                      )}
                    >
                      <QuizQuestion
                        question={question}
                        currentAnswer={answers[index]}
                        onAnswerSelect={(answer) =>
                          handleAnswerSelect(index, answer)
                        }
                        showResult={quizCompleted}
                        questionNumber={index + 1}
                      />
                    </div>
                  ))}

                  {!quizCompleted && (
                    <div className="sticky bottom-4 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-medium">
                            {answeredQuestions.length}
                          </span>{" "}
                          / {quizData.quizzes.length} câu đã trả lời
                        </div>

                        <Button onClick={handleSubmit} className="ml-auto">
                          Nộp bài
                        </Button>
                      </div>

                      {!allQuestionsAnswered && (
                        <div className="mt-2 text-amber-600 dark:text-amber-400 text-sm">
                          Bạn cần trả lời tất cả {quizData.quizzes.length} câu
                          hỏi trước khi nộp bài
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar - takes 1/4 of the space on large screens */}
            <div className="hidden lg:block border-l border-gray-200 dark:border-gray-700 h-full">
              <QuizSidebar
                totalQuestions={quizData.quizzes.length}
                currentQuestion={currentQuestion}
                answeredQuestions={answeredQuestions}
                allQuestionsAnswered={allQuestionsAnswered}
                correctAnswers={quizCompleted ? correctAnswers : []}
                showResults={quizCompleted}
                onSubmit={handleSubmit}
                onQuestionSelect={handleQuestionSelect}
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>

        {quizCompleted && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại chương học
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
