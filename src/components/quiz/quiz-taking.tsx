"use client"
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Clock, AlertTriangle, ArrowLeft } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  content: any;
  points: number;
  question_order: number;
}

interface QuizTakingProps {
  questions: Question[];
  quizId: string;
  timeLimit: number;
}

interface SavedProgress {
  answers: Record<string, any>;
  currentIndex: number;
  timeLeft: number;
}

const fakeQuestions: Question[] = [
  {
    id: "7f4e2230-335d-4346-a5c7-870612b1c60c",
    question_text: "av",
    question_type: "image-matching",
    content: {
      pairs: [
        { label: "d", image_url: "uploads/images/1745650505208-676649953.jpg" },
        { label: "f", image_url: "uploads/images/1745650505210-505358662.jpg" }
      ]
    },
    points: 1,
    question_order: 1,
  },
  {
    id: "6e7179c5-3e33-4f79-aebf-497ca68fb1b1",
    question_text: "aaaabbbb",
    question_type: "multiple-choice",
    content: {
      options: [
        { id: "1", text: "fs", is_correct: true },
        { id: "2", text: "ess", is_correct: false },
        { id: "option-1745382748889", text: "nh", is_correct: true }
      ]
    },
    points: 1,
    question_order: 2,
  },
  {
    id: "44d6f9b2-44aa-45a4-9c72-bcd572f2a694",
    question_text: "fsgt",
    question_type: "true-false",
    content: {
      correct_answer: true
    },
    points: 1,
    question_order: 3,
  },
  {
    id: "7a53a5a5-64af-4526-aa2b-8d024f1195c0",
    question_text: "fes",
    question_type: "matching",
    content: {
      pairs: [
        { item: "av", match: "1" },
        { item: "bg", match: "2" }
      ]
    },
    points: 1,
    question_order: 4,
  },
  {
    id: "0d857182-d250-4970-8bd1-e7fb4cb303c4",
    question_text: "fe",
    question_type: "image-matching",
    content: {
      pairs: [
        { label: "e", image_url: "uploads/images/1745383468106-105221558.jpg" },
        { label: "b", image_url: "uploads/images/1745383468108-722243549.jpg" }
      ]
    },
    points: 1,
    question_order: 5,
  },
  {
    id: "d726e1ba-0586-43ba-b110-b7f829689bf5",
    question_text: "Hà nội is the capital of [[Việt Nam]]",
    question_type: "fill-blanks",
    content: {
      answers: ["Việt Nam"]
    },
    points: 1,
    question_order: 6,
  },
  {
    id: "3f8c140c-fd7e-4ab9-b4c3-3bd7d59af291",
    question_text: "fds",
    question_type: "true-false",
    content: {
      correct_answer: true
    },
    points: 1,
    question_order: 1,
  },
  {
    id: "99e0488d-c07d-4ed8-8ed3-43032431e93c",
    question_text: "a",
    question_type: "single-choice",
    content: {
      options: [
        { id: "1", text: "v", is_correct: false },
        { id: "2", text: "f", is_correct: true }
      ]
    },
    points: 1,
    question_order: 2,
  },
  {
    id: "9f9c553a-afe0-4aa0-b5da-1af41393e248",
    question_text: "single choice",
    question_type: "single-choice",
    content: {
      options: [
        { id: "1", text: "av", is_correct: true },
        { id: "2", text: "fr", is_correct: false }
      ]
    },
    points: 1,
    question_order: 1,
  }
];

const ImageMatchingQuestion = ({ question, answer, onAnswerChange }: any) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (label: string) => {
    setDraggedItem(label);
  };

  const handleDrop = (imageId: string) => {
    if (draggedItem) {
      const newAnswers = { ...answer };
      newAnswers[imageId] = draggedItem;
      onAnswerChange(newAnswers);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <h3 className="font-medium">Labels:</h3>
        <div className="flex flex-wrap gap-2">
          {question.content.pairs.map((pair: any) => (
            <Draggable key={pair.label} draggableId={pair.label} index={0}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded cursor-move"
                  onDragStart={() => handleDragStart(pair.label)}
                >
                  {pair.label}
                </div>
              )}
            </Draggable>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Images:</h3>
        <div className="grid grid-cols-2 gap-4">
          {question.content.pairs.map((pair: any) => (
            <Droppable key={pair.image_url} droppableId={pair.image_url}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="relative h-48 w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg"
                  onDrop={() => handleDrop(pair.image_url)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${pair.image_url}`}
                    alt={`Image ${pair.label}`}
                    className="object-cover rounded-lg w-full h-full"
                  />
                  {answer[pair.image_url] && (
                    <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                      {answer[pair.image_url]}
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </div>
  );
};

const MatchingQuestion = ({ question, answer, onAnswerChange }: any) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (item: string) => {
    setDraggedItem(item);
  };

  const handleDrop = (matchId: string) => {
    if (draggedItem) {
      const newAnswers = { ...answer };
      newAnswers[matchId] = draggedItem;
      onAnswerChange(newAnswers);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="font-medium">Items:</h3>
        <div className="flex flex-wrap gap-2">
          {question.content.pairs.map((pair: any) => (
            <Draggable key={pair.item} draggableId={pair.item} index={0}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded cursor-move"
                  onDragStart={() => handleDragStart(pair.item)}
                >
                  {pair.item}
                </div>
              )}
            </Draggable>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Matches:</h3>
        <div className="space-y-2">
          {question.content.pairs.map((pair: any) => (
            <Droppable key={pair.match} droppableId={pair.match}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded"
                  onDrop={() => handleDrop(pair.match)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {answer[pair.match] ? (
                    <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded">
                      {answer[pair.match]}
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">
                      Kéo đáp án vào đây
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </div>
  );
};

const FillBlanksQuestion = ({ question, answer, onAnswerChange }: any) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [blanks, setBlanks] = useState<string[]>([]);

  useEffect(() => {
    // Extract blanks from question text
    const matches = question.question_text.match(/\[\[(.*?)\]\]/g) || [];
    setBlanks(matches.map((match: string) => match.slice(2, -2)));
  }, [question.question_text]);

  const handleDragStart = (option: string) => {
    setDraggedItem(option);
  };

  const handleDrop = (blankId: string) => {
    if (draggedItem) {
      const newAnswers = { ...answer };
      newAnswers[blankId] = draggedItem;
      onAnswerChange(newAnswers);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {question.content.options.map((option: string) => (
          <Draggable key={option} draggableId={option} index={0}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded cursor-move"
                onDragStart={() => handleDragStart(option)}
              >
                {option}
              </div>
            )}
          </Draggable>
        ))}
      </div>
      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{
          __html: question.question_text.replace(
            /\[\[(.*?)\]\]/g,
            (match: string, blankId: string) => {
              const currentAnswer = answer[blankId];
              return `<span class="inline-block min-w-[100px] p-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded" ondrop="handleDrop('${blankId}')" ondragover="event.preventDefault()">${
                currentAnswer || "Kéo đáp án vào đây"
              }</span>`;
            }
          ),
        }}
      />
    </div>
  );
};

// const QuizTaking = ({ questions, quizId, timeLimit }: QuizTakingProps) => {
const QuizTaking = (quizId: any) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"single" | "multiple">("single");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionRefs = useRef<HTMLDivElement[]>([]);
  const router = useRouter();

  // Timer effect
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizStarted, quizCompleted, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (value: any) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setQuizCompleted(true);
    setShowResults(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleExit = () => {
    router.push("/quiz");
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "single" ? "multiple" : "single");
  };

  const handleDragEnd = () => {
    // Reset dragged item state
    setDraggedItem(null);
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    switch (question.question_type) {
      case "single-choice":
        return (
          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={handleAnswerChange}
          >
            {question.content.options.map((option: any) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label
                  htmlFor={option.id}
                  dangerouslySetInnerHTML={{ __html: option.text }}
                />
              </div>
            ))}
          </RadioGroup>
        );

      case "multiple-choice":
        return (
          <div className="space-y-2">
            {question.content.options.map((option: any) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={answers[question.id]?.includes(option.id) || false}
                  onCheckedChange={(checked) => {
                    const currentAnswers = answers[question.id] || [];
                    const newAnswers = checked
                      ? [...currentAnswers, option.id]
                      : currentAnswers.filter((id: string) => id !== option.id);
                    handleAnswerChange(newAnswers);
                  }}
                />
                <Label
                  htmlFor={option.id}
                  dangerouslySetInnerHTML={{ __html: option.text }}
                />
              </div>
            ))}
          </div>
        );

      case "true-false":
        return (
          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={handleAnswerChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true">Đúng</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false">Sai</Label>
            </div>
          </RadioGroup>
        );

      case "matching":
        return (
          <DragDropContext onDragEnd={handleDragEnd}>
            <MatchingQuestion
              question={question}
              answer={answers[question.id] || {}}
              onAnswerChange={(newAnswer: any) =>
                handleAnswerChange(newAnswer)
              }
            />
          </DragDropContext>
        );

      case "image-matching":
        return (
          <DragDropContext onDragEnd={handleDragEnd}>
            <ImageMatchingQuestion
              question={question}
              answer={answers[question.id] || {}}
              onAnswerChange={(newAnswer: any) =>
                handleAnswerChange(newAnswer)
              }
            />
          </DragDropContext>
        );

      case "fill-blanks":
        return (
          <DragDropContext onDragEnd={handleDragEnd}>
            <FillBlanksQuestion
              question={question}
              answer={answers[question.id] || {}}
              onAnswerChange={(newAnswer: any) =>
                handleAnswerChange(newAnswer)
              }
            />
          </DragDropContext>
        );

      default:
        return <div>Loại câu hỏi không được hỗ trợ</div>;
    }
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Bắt đầu làm bài</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Thời gian: {60} phút</p>
                <p>Số câu hỏi: {questions.length}</p>
                <div className="flex gap-4">
                  <Button onClick={handleStartQuiz}>Bắt đầu</Button>
                  <Button variant="outline" onClick={handleExit}>
                    Thoát
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Kết quả bài kiểm tra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Tổng số câu hỏi: {questions.length}</p>
            <p>Số câu đã trả lời: {Object.keys(answers).length}</p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleExit}>
                Thoát
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Câu hỏi {currentQuestionIndex + 1}/{questions.length}
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
                <Button variant="outline" onClick={toggleViewMode}>
                  {viewMode === "single" ? "Xem tất cả" : "Xem từng câu"}
                </Button>
              </div>
            </div>
            <Progress
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              className="h-2"
            />
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="text-lg font-medium mb-4"
                  dangerouslySetInnerHTML={{
                    __html: questions[currentQuestionIndex].question_text,
                  }}
                />
                {renderQuestion()}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Câu trước
                  </Button>
                  {currentQuestionIndex === questions.length - 1 ? (
                    <Button onClick={handleSubmit}>Nộp bài</Button>
                  ) : (
                    <Button onClick={handleNext}>Câu tiếp</Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizTaking; 