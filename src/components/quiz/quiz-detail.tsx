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
import { getQuizDataByQuizId, handleSubmitQuiz } from "@/utils/action";


const QuizDetail = (props: any) => {
  const { quizId, quizStarted } = props;

  const [quizData, setQuizData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(Answer | null)[]>([]);
  // const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timeGLeft, setTimeGLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [percentageScore, setPercentageScore] = useState(0);
  const [isPassed, setIsPassed] = useState(false);


  // View mode: "single" for one question at a time, "multiple" for all questions
  const [viewMode, setViewMode] = useState<"single" | "multiple">("single");

  // Use a ref to track the current question for cleanup
  const questionRefs = useRef<HTMLDivElement[]>([]);

  const [attemptId, setAttemptId] = useState<string>("");
  const dataFetchedRef = useRef(false);


  // useEffect(() => {
  //   console.log("answers:", answers);
  // }, [answers]);

  useEffect(() => {
    setIsMounted(true);

    const fetchData = async () => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;

      setIsLoading(true);
      try {
        const data = await getQuizDataByQuizId(quizId);
        console.log('>>>quiz data: ', data)
        setQuizData(data);
        setAttemptId(data.attempt.attempt_id);

        if (data) {
          // Initialize answers array with nulls
          setAnswers(new Array(data.questions.length).fill(null));
          setCorrectAnswers(new Array(data.questions.length).fill(false));
        }
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
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Handle quiz submission
  // const handleSubmit = () => {
  //   // Calculate score and mark correct/incorrect answers
  //   let correctCount = 0;
  //   const newCorrectAnswers = [...correctAnswers];

  //   quizData.content.forEach((question: any, index: any) => {
  //     const isCorrect = newCorrectAnswers[index] = answers[index] === question.correctAnswer;
  //     if (isCorrect) {
  //       correctCount++;
  //     }
  //   });

  //   setCorrectAnswers(newCorrectAnswers);
  //   setScore(correctCount);
  //   setQuizCompleted(true);
  //   setTimeTaken(quizData.timeLimit - timeGLeft);
  // };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = quizData.questions.map((question: any, index: number) => {
        const answer = answers[index];
        if (!answer) return null;
        const baseAnswer = {
          question_id: question.id,
          question_type: question.question_type,
        };
        switch (question.question_type) {
          case 'single-choice':
            return {
              ...baseAnswer,
              answer: answer.answer as string,
            };
          case 'multiple-choice':
            return {
              ...baseAnswer,
              answer: answer.answer as string[],
            };
          case 'true-false':
            return {
              ...baseAnswer,
              answer: answer.answer as boolean,
            };
          case 'matching':
          case 'image-matching':
            return {
              ...baseAnswer,
              answer: Object.entries(answer.answer as Record<string, string>).map(([key, value]) => ({ key, value })),
            };
          case 'fill-blanks':
            return {
              ...baseAnswer,
              answer: answer.answer as string[],
            };
          default:
            return null;
        }
      }).filter(Boolean);
  
      const submitData = { answers: formattedAnswers };
      console.log('>>>submitData: ', submitData)
      const res = await handleSubmitQuiz(attemptId, quizId, submitData);
  
      if (res.statusCode === 200 || res.statusCode === 201) {
        const { attempt_id, total_score, percentage_score, is_passed, total_questions, correct_answers, results } = res.data;
  
        // Tạo mảng correctAnswers cho từng câu hỏi
        const questionCorrectAnswers = quizData.questions.map((question: any) => {
          const result = results.find((r: any) => r.question_id === question.id);
          return result ? result.correctAnswers : null;
        });
  
        setScore(correct_answers);
        setTotalQuestions(total_questions);
        setPercentageScore(percentage_score);
        setIsPassed(is_passed);
        setQuizCompleted(true);
        setTimeTaken(quizData.quiz.time_limit - timeGLeft);

        console.log('>>>quizData: ', quizData)
  
        // Cập nhật correctAnswers và kiểm tra đúng/sai
        setCorrectAnswers(
          quizData.questions.map((question: any, index: number) => {
            const answer = answers[index];
            const correctAns = questionCorrectAnswers[index];
            if (!answer || !correctAns) return false;

            console.log('>>>answer: ', answer)
            console.log('>>>correctAns: ', correctAns)
  
            switch (question.question_type) {
              case 'multiple-choice':
                // So sánh mảng ID
                return Array.isArray(answer.answer) && Array.isArray(correctAns) && 
                  JSON.stringify([...answer.answer].sort()) === JSON.stringify([...correctAns].sort());
              case 'single-choice':
                return answer.answer === correctAns;
              case 'true-false':
                // Chuyển đổi cả hai giá trị về boolean để so sánh
                const userAnswer = Boolean(answer.answer);
                const correctAnswer = Boolean(correctAns);
                console.log('>>>userAnswer: ', userAnswer)
                console.log('>>>correctAnswer: ', correctAnswer)
                return userAnswer === correctAnswer;
              case 'matching':
              case 'image-matching':
                // Chuyển đổi answer.answer (object) thành array để so sánh với correctAns (array)
                const answerArray = Object.entries(answer.answer as Record<string, string>)
                  .map(([key, value]) => ({ key, value }))
                  .sort((a, b) => a.key.localeCompare(b.key));
                const correctArray = (correctAns as Array<{key: string, value: string}>)
                  .sort((a, b) => a.key.localeCompare(b.key));
                return JSON.stringify(answerArray) === JSON.stringify(correctArray);
              case 'fill-blanks':
                return Array.isArray(answer.answer) && Array.isArray(correctAns) && 
                  JSON.stringify([...answer.answer].sort()) === JSON.stringify([...correctAns].sort());
              default:
                return false;
            }
          })
        );
  
        // Lưu correctAnswers vào quizData để truyền xuống QuizQuestion
        setQuizData({
          ...quizData,
          questions: quizData.questions.map((question: any, index: number) => {
            const correctAns = questionCorrectAnswers[index];
            if (question.question_type === 'multiple-choice' || 
                question.question_type === 'matching' || 
                question.question_type === 'image-matching') {
              return {
                ...question,
                correctAnswers: correctAns
              };
            }
            return {
              ...question,
              correctAnswer: correctAns
            };
          }),
        });
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  // Handle time up
  const handleTimeUp = () => {
    handleSubmit();
  };

  // Start the quiz
  // const startQuiz = () => {
  //   setQuizStarted(true);
  // };

  // Review answers
  const reviewAnswers = () => {
    setShowResults(true);
    setCurrentQuestion(0);
    setQuizCompleted(false); // Reset quizCompleted to show the quiz interface
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
  // if (!quizStarted) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
  //       <div className="max-w-4xl mx-auto">
  //         <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
  //           <div className="p-6 md:p-8">
  //             <h1 className="text-2xl md:text-3xl font-bold mb-4">
  //               {quizData.title}
  //             </h1>
  //             <p className="text-gray-600 dark:text-gray-300 mb-6">
  //               {quizData.description}
  //             </p>

  //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
  //               <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
  //                 <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
  //                   Số câu hỏi
  //                 </div>
  //                 <div className="text-xl font-bold">
  //                   {quizData.questions.length} câu
  //                 </div>
  //               </div>
  //               <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
  //                 <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
  //                   Thời gian làm bài
  //                 </div>
  //                 <div className="text-xl font-bold">
  //                   {Math.floor(quizData.quiz.time_limit / 60)} phút {quizData.quiz.time_limit % 60} giây
  //                 </div>
  //               </div>
  //               <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
  //                 <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
  //                   Điểm đạt
  //                 </div>
  //                 <div className="text-xl font-bold">
  //                   {quizData.quiz.passing_score}%
  //                 </div>
  //               </div>
  //             </div>

  //             <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-4 mb-8">
  //               <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
  //                 Lưu ý:
  //               </h3>
  //               <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1 text-sm">
  //                 <li>
  //                   Bạn không thể tạm dừng bài kiểm tra sau khi đã bắt đầu
  //                 </li>
  //                 <li>
  //                   Đảm bảo bạn có đủ thời gian để hoàn thành bài kiểm tra
  //                 </li>
  //                 <li>Bài kiểm tra sẽ tự động nộp khi hết thời gian</li>
  //                 <li>Bạn cần trả lời tất cả các câu hỏi trước khi nộp bài</li>
  //                 <li>
  //                   Bạn có thể chọn xem từng câu hỏi hoặc nhiều câu hỏi cùng lúc
  //                 </li>
  //                 <li>
  //                   Danh sách câu hỏi luôn hiển thị ở bên phải để dễ dàng điều
  //                   hướng
  //                 </li>
  //               </ul>
  //             </div>

  //             <div className="flex flex-col sm:flex-row gap-4">
  //               <Button
  //                 onClick={startQuiz}
  //                 size="lg"
  //                 className="flex-1 min-h-10"
  //               >
  //                 Bắt đầu làm bài
  //               </Button>
  //               <Button
  //                 variant="outline"
  //                 size="lg"
  //                 className="w-full flex-1 min-h-10"
  //                 onClick={() => window.history.back()}
  //               >
  //                 Quay lại
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Quiz completed - show results
  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <QuizResult
            score={score}
            totalQuestions={totalQuestions}
            percentageScore={percentageScore}
            isPassed={isPassed}
            timeTaken={timeTaken}
            onReview={reviewAnswers}
          />
        </div>
      </div>
    );
  }


  // // Quiz in progress or reviewing answers
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
            <h1 className="text-xl font-bold">{quizData.title}</h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {!quizCompleted && !showResults && (
                <QuizTimer
                  duration={quizData.quiz.time_limit}
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
                    Câu hỏi {currentQuestion + 1} / {quizData.questions.length}
                  </div>

                  <div
                    key={`question-${currentQuestion}`}
                    ref={(el) => {
                      if (el) questionRefs.current[currentQuestion] = el;
                    }}
                  >
                    <QuizQuestion
                      question={quizData.questions[currentQuestion]}
                      currentAnswer={answers[currentQuestion]}
                      onAnswerSelect={(answer) =>
                        handleAnswerSelect(currentQuestion, answer)
                      }
                      showResult={showResults}
                      questionNumber={currentQuestion + 1}
                    />
                  </div>

                  <QuizNavigation
                    totalQuestions={quizData.questions.length}
                    allQuestionsAnswered={allQuestionsAnswered}
                    currentQuestion={currentQuestion}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    showResult={showResults}
                  />
                </div>
              ) : (
                // Multiple questions view
                <div className="space-y-8">
                  <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Tất cả câu hỏi ({quizData.questions.length})
                  </div>

                  {quizData.questions.map((question: any, index: any) => (
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
                        showResult={showResults}
                        questionNumber={index + 1}
                      />
                    </div>
                  ))}

                  {!showResults && (
                    <div className="sticky bottom-4 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-medium">
                            {answeredQuestions.length}
                          </span>{" "}
                          / {quizData.questions.length} câu đã trả lời
                        </div>

                        <Button onClick={handleSubmit} className="ml-auto">
                          Nộp bài
                        </Button>
                      </div>

                      {!allQuestionsAnswered && (
                        <div className="mt-2 text-amber-600 dark:text-amber-400 text-sm">
                          Bạn cần trả lời tất cả {quizData.questions.length} câu
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
                totalQuestions={quizData.questions.length}
                currentQuestion={currentQuestion}
                answeredQuestions={answeredQuestions}
                allQuestionsAnswered={allQuestionsAnswered}
                correctAnswers={showResults ? correctAnswers : []}
                showResults={showResults}
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


export default QuizDetail;