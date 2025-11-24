"use client"
import { handleGetQuizOverview } from "@/utils/action";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import QuizDetail from "./quiz-detail";

const QuizOverview = (props: any) => {
    const { quizId } = props;
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizDataOverview, setQuizDataOverview] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleStartQuiz = () => {
        setQuizStarted(true);
    }

    useEffect(() => {
        const fetchQuizOverview = async () => {
            try {
                setIsLoading(true);
                const res = await handleGetQuizOverview(quizId);
                console.log('>>>res: ', res);
                if (res) {
                    setQuizDataOverview(res);
                }
            } catch (error) {
                console.error('Error fetching quiz overview:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchQuizOverview();
    }, [quizId]);

    if (quizStarted) {
        return <QuizDetail quizId={quizId} quizStarted={quizStarted} />;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                        Đang tải thông tin bài kiểm tra...
                    </p>
                </div>
            </div>
        );
    }

    if (!quizDataOverview) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-2">
                        Không tìm thấy thông tin bài kiểm tra
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Vui lòng thử lại sau hoặc liên hệ với quản trị viên.
                    </p>
                    <Button onClick={() => window.history.back()}>
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="p-6 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold mb-4">
                            {quizDataOverview.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            {quizDataOverview.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Số câu hỏi
                                </div>
                                <div className="text-xl font-bold">
                                    {quizDataOverview.total_questions || 0} câu
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Thời gian làm bài
                                </div>
                                <div className="text-xl font-bold">
                                    {Math.floor(quizDataOverview.time_limit / 60) || 0} phút {(quizDataOverview.time_limit % 60) || 0} giây
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Điểm đạt
                                </div>
                                <div className="text-xl font-bold">
                                    {quizDataOverview.passing_score || 0}%
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
                                onClick={handleStartQuiz}
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

export default QuizOverview;
