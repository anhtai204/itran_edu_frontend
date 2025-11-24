"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  PlusCircle,
  GripVertical,
  Trash2,
  Copy,
  Edit,
  Eye,
  FileUp,
  Save,
  ArrowLeft,
  FileText,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  handleCreateQuiz,
  handleDeleteQuestion,
  handleGetCategories,
  handleGetLessons,
  handleGetQuizLevels,
  handleUpdateQuiz,
  Quiz,
} from "@/utils/action";
import { sendRequest } from "@/utils/api";
import { debounce } from "lodash";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Tiptap from "@/components/tiptap";
import { FileUploadArea } from "./file-upload-area";
import { generateId } from "@/utils/generatedId";
import { v4 as uuidv4 } from 'uuid';
import { string } from "zod";

// Mock data
const mockCategories = [
  { id: "1", name: "Programming" },
  { id: "2", name: "Mathematics" },
  { id: "3", name: "Science" },
  { id: "4", name: "Language" },
];

const mockDifficulties = [
  { id: "1", name: "Beginner" },
  { id: "2", name: "Intermediate" },
  { id: "3", name: "Advanced" },
];

const mockLessons = [
  { id: "1", title: "Introduction to JavaScript" },
  { id: "2", title: "Variables and Data Types" },
  { id: "3", title: "Functions and Scope" },
  { id: "4", title: "DOM Manipulation" },
  { id: "5", title: "Asynchronous JavaScript" },
];

// Question type definitions
const questionTypes = [
  { id: "single-choice", name: "Single Choice", color: "bg-blue-500" },
  { id: "multiple-choice", name: "Multiple Choice", color: "bg-green-500" },
  { id: "true-false", name: "True/False", color: "bg-amber-500" },
  { id: "matching", name: "Matching", color: "bg-purple-500" },
  { id: "image-matching", name: "Image Matching", color: "bg-pink-500" },
  { id: "fill-blanks", name: "Fill in the Blanks", color: "bg-cyan-500" },
];

// Initial quiz state
const initialQuiz = {
  title: "",
  description: "",
  lesson_id: "",
  category_id: "",
  difficulty_id: "",
  status: "draft",
  time_limit: 30,
  passing_score: 70,
  max_attempts: 3,
  randomize_questions: false,
  show_results: true,
  show_correct_answers: true,
  show_explanations: true,
};

// Định nghĩa kiểu cho content
type QuizQuestionContent =
  | { options: { id: string; text: string; is_correct: boolean }[] } // single-choice, multiple-choice
  | { correct_answer: boolean } // true-false
  | { pairs: { item: string; match: string }[] } // matching ui
  | { items: { id: string, text: string }[], matches: { id: string, text: string }[], correct_matches: { item_id: string, match_id: string }[] } // matching save
  | { pairs: { image_file?: File; preview_url?: string; image_url?: string; label: string }[] } // image-matching ui
  | {
    labels: { id: string, text: string }[],
    image_urls: { id: string, url: string }[],
    correct_image_matches: { label_id: string, url_id: string }[],
    image_files?: File[],
    preview_urls?: string[]
  } // image matching save
  | { answers: string[] }; // fill-blanks

interface ResFiles {
  message: string;
  statusCode: number;
  data: {
    message: string;
    urls: string[];
  };
}

export default function CreateQuizPage(props: any) {
  const { session } = props;
  const [quiz, setQuiz] = useState(initialQuiz);
  const [activeTab, setActiveTab] = useState("details");
  const [questions, setQuestions] = useState<
    {
      id: string;
      type: string;
      text: string;
      content: QuizQuestionContent;
      explanation: string;
      points: number;
      question_order: number;
    }[]
  >([]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    id: "",
    type: "single-choice",
    text: "",
    content: {
      options: [
        { id: "1", text: "", is_correct: false },
        { id: "2", text: "", is_correct: false },
      ],
    } as QuizQuestionContent,
    explanation: "",
    points: 1,
  });
  const [mathToolbarStates, setMathToolbarStates] = useState<{
    [key: string]: boolean;
  }>({
    description: false,
    questionText: false,
    explanation: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [lessons, setLessons] = useState(mockLessons);
  const [difficulties, setDifficulties] = useState(mockDifficulties);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  // Toggle MathToolbar for a specific field
  const toggleMathToolbar = (field: string) => {
    setMathToolbarStates((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    const fetchLessons = async () => {
      const lessons = await handleGetLessons();
      setLessons(lessons);
    };

    const fetchDifficulties = async () => {
      const difficulties = await handleGetQuizLevels();
      setDifficulties(difficulties);
    };

    const fetchCategories = async () => {
      try {
        const items = await handleGetCategories();
        if (Array.isArray(items)) {
          const formattedCategories = items.map((item) => ({
            label: item.label,
            value: item.key,
          }));
          setCategories(formattedCategories);
        } else {
          console.error("Categories data is not an array:", items);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchLessons();
    fetchCategories();
    fetchDifficulties();
  }, []);

  // Handle quiz details change
  const handleQuizChange = (field: string, value: any) => {
    setQuiz((prevQuiz) => ({ ...prevQuiz, [field]: value }));
  };

  // Handle quiz settings change
  const handleSettingsChange = (field: string, value: any) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [field]: value,
    }));
  };

  // Update questions in the backend
  const updateQuestionsOrder = async (quizId: string, questions: any[]) => {
    try {
      const questionUpdates = questions.map((q, index) => ({
        id: q.id,
        quiz_id: quizId,
        question_text: q.text,
        question_type: q.type,
        content: q.content,
        explanation: q.explanation,
        points: q.points,
        question_order: index + 1,
      }));

      console.log(">>>Updating questions order:", questionUpdates);

      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz-questions/bulk-update`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: questionUpdates,
      });

      if (res.statusCode === 200) {
        console.log(">>>Questions order updated successfully:", res.data);
        return res.data;
      } else {
        throw new Error("Failed to update questions order");
      }
    } catch (error) {
      console.error("Error updating questions order:", error);
      throw error;
    }
  };

  // Upload multiple files to server
  const uploadManyFileToServer = async (files: File[]): Promise<ResFiles> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/multiple`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: formData,
      }
    );

    const result = await uploadResponse.json();
    return result;
  };

  // Debounced save function
  const debouncedSaveQuiz = debounce(async (status: string) => {
    if (isSaving) {
      console.log("Save already in progress, skipping...");
      return;
    }
    if (!quiz.title.trim()) {
      toast("Quiz title is required");
      return;
    }
    if (!quiz.description.trim()) {
      toast("Quiz description is required");
      return;
    }
    if (!quiz.lesson_id) {
      toast("Lesson is required");
      return;
    }
    if (!quiz.category_id) {
      toast("Category is required");
      return;
    }
    if (!quiz.difficulty_id) {
      toast("Difficulty is required");
      return;
    }
    try {
      setIsLoading(true);
      setIsSaving(true);
      console.log(`Attempting to save quiz with status: ${status}`);
      const quizData: Quiz = {
        title: quiz.title,
        description: quiz.description,
        lesson_id: quiz.lesson_id,
        category_id: quiz.category_id,
        difficulty_id: quiz.difficulty_id,
        time_limit: quiz.time_limit,
        status,
        passing_score: quiz.passing_score,
        max_attempts: quiz.max_attempts,
        randomize_questions: quiz.randomize_questions,
        show_results: quiz.show_results,
        show_correct_answers: quiz.show_correct_answers,
        show_explanations: quiz.show_explanations,
        author_id: session?.user?.id || "",
      };
      let updatedQuiz: Quiz;
      if (quizId) {
        updatedQuiz = await handleUpdateQuiz(quizId, quizData);
        setQuiz(updatedQuiz);
        if (questions.length > 0) {
          await updateQuestionsOrder(quizId, questions);
        }
        toast(
          `Quiz ${status === "published" ? "published" : "saved as draft"
          } successfully`
        );
      } else {
        const newQuiz = await handleCreateQuiz(quizData);
        console.log("Created quiz:", newQuiz);
        if (!newQuiz || !newQuiz.id) {
          throw new Error("Invalid response from server: Quiz ID is missing");
        }
        setQuiz(newQuiz);
        setQuizId(newQuiz.id);
        if (questions.length > 0) {
          await updateQuestionsOrder(newQuiz.id, questions);
        }
        toast(
          `Quiz ${status === "published" ? "published" : "saved as draft"
          } successfully`
        );
        setActiveTab("questions");
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast("Failed to save quiz");
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  }, 1000);

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updatedItems = items.map((item, index) => ({
      ...item,
      question_order: index + 1,
    }));
    setQuestions(updatedItems);
    if (quizId) {
      updateQuestionsOrder(quizId, updatedItems).catch((error) => {
        console.error("Failed to update question order:", error);
        toast("Failed to update question order");
      });
    }
  };

  // Add a new question
  const handleAddQuestion = async () => {
    if (!quizId) {
      toast("Please save the quiz details first");
      return;
    }

    if (!newQuestion.text.trim()) {
      toast("Question text cannot be empty");
      return;
    }

    try {
      setIsLoading(true);

      let finalContent = { ...newQuestion.content };

      // Xử lý câu hỏi dạng matching
      if (newQuestion.type === "matching") {
        const content = newQuestion.content as {
          items: { id: string; text: string }[];
          matches: { id: string; text: string }[];
          correct_matches: { item_id: string; match_id: string }[];
        };

        console.log('>>> content: ', content);

        // Lọc bỏ các items và matches rỗng
        const validItems = content.items.filter((item) => item.text.trim());
        const validMatches = content.matches.filter((match) => match.text.trim());

        // Kiểm tra xem có ít nhất một cặp hợp lệ
        if (validItems.length === 0 || validMatches.length === 0) {
          toast("At least one valid item and match are required");
          setIsLoading(false);
          return;
        }

        // Lọc correct_matches để chỉ giữ lại các cặp hợp lệ
        const validCorrectMatches = content.correct_matches.filter((cm) =>
          validItems.some((item) => item.id === cm.item_id) &&
          validMatches.some((match) => match.id === cm.match_id)
        );

        // Kiểm tra xem mỗi item có một match tương ứng
        if (validCorrectMatches.length !== validItems.length) {
          toast("Each item must have a corresponding match");
          setIsLoading(false);
          return;
        }

        finalContent = {
          items: validItems,
          matches: validMatches,
          correct_matches: validCorrectMatches,
        };
      }

      // Xử lý câu hỏi dạng image-matching
      // if (newQuestion.type === "image-matching") {
      //   const content = newQuestion.content as {
      //     labels: { id: string; text: string }[];
      //     image_urls: { id: string; url: string }[];
      //     image_files?: File[];
      //     preview_urls?: string[];
      //     correct_image_matches: { label_id: string; url_id: string }[];
      //   };


      //   // Lọc bỏ các labels và image_urls rỗng
      //   const validLabels = content.labels.filter((label) => label.text.trim());
      //   const validImageUrls = content.image_urls.filter((img) => img.url);

        
      //   // Upload hình ảnh nếu có
      //   const imageFiles = content.image_files?.filter((file) => file) || [];
      //   console.log('>>>imageFiles: ', imageFiles)
      //   let uploadedUrls: string[] = [];
      //   if (imageFiles.length > 0) {
      //     const res = await uploadManyFileToServer(imageFiles);
      //     uploadedUrls = res.data.urls;

      //     console.log('>>>uploadedUrls: ', uploadedUrls)
          
      //     // Update image_urls with new uploaded URLs
      //     const updatedImageUrls = content.image_urls.map((img, index) => ({
      //       ...img,
      //       url: uploadedUrls[index] || img.url
      //     }));

      //     // Update correct_image_matches to match with new image_urls
      //     const updatedCorrectImageMatches = content.correct_image_matches.map((match) => {
      //       const imageIndex = content.image_urls.findIndex(img => img.id === match.url_id);
      //       if (imageIndex >= 0 && uploadedUrls[imageIndex]) {
      //         return {
      //           ...match,
      //           url_id: updatedImageUrls[imageIndex].id
      //         };
      //       }
      //       return match;
      //     });

      //     // Update the content with new image_urls and correct_image_matches
      //     setNewQuestion({
      //       ...newQuestion,
      //       content: {
      //         ...content,
      //         image_urls: updatedImageUrls,
      //         correct_image_matches: updatedCorrectImageMatches
      //       }
      //     });
      //   }

      //   // Tạo danh sách image_urls mới dựa trên các URL đã upload
      //   const updatedImageUrls = validImageUrls.map((img, index) => ({
      //     id: img.id,
      //     url: uploadedUrls[index] || img.url,
      //   }));

      //   console.log('>>content imagge matching update: ', content);


      //   // Kiểm tra xem có ít nhất một cặp hợp lệ
      //   if (validLabels.length === 0 || validImageUrls.length === 0) {
      //     toast("At least one valid label and image are required");
      //     setIsLoading(false);
      //     return;
      //   }


      //   // Lọc correct_image_matches để chỉ giữ lại các cặp hợp lệ
      //   const validCorrectImageMatches = content.correct_image_matches.filter((cm) =>
      //     validLabels.some((label) => label.id === cm.label_id) &&
      //     updatedImageUrls.some((img) => img.id === cm.url_id)
      //   );


      //   // Kiểm tra xem mỗi label có một image tương ứng
      //   if (validCorrectImageMatches.length !== validLabels.length) {
      //     toast("Each label must have a corresponding image");
      //     setIsLoading(false);
      //     return;
      //   }

      //   finalContent = {
      //     labels: validLabels,
      //     image_urls: updatedImageUrls,
      //     correct_image_matches: validCorrectImageMatches,
      //   };
      // }

      if (newQuestion.type === "image-matching") {
        const content = newQuestion.content as {
          labels: { id: string; text: string }[];
          image_urls: { id: string; url: string }[];
          image_files?: File[];
          preview_urls?: string[];
          correct_image_matches: { label_id: string; url_id: string }[];
        };
      
        // Lọc bỏ các labels và image_urls rỗng
        const validLabels = content.labels.filter((label) => label.text.trim());
        const validImageUrls = content.image_urls.filter((img) => img.url);
      
        // Kiểm tra xem có ít nhất một cặp hợp lệ
        if (validLabels.length === 0 || validImageUrls.length === 0) {
          toast("At least one valid label and image are required");
          setIsLoading(false);
          return;
        }
      
        // Upload hình ảnh nếu có
        const imageFiles = content.image_files?.filter((file) => file) || [];
        let uploadedUrls: string[] = [];
        if (imageFiles.length > 0) {
          const res = await uploadManyFileToServer(imageFiles);
          uploadedUrls = res.data.urls;
          console.log('>>>uploadedUrls: ', uploadedUrls);
        }
      
        // Cập nhật image_urls với các URL đã upload
        const updatedImageUrls = validLabels.map((label, index) => ({
          id: content.image_urls[index]?.id || uuidv4(),
          url: uploadedUrls[index] || content.image_urls[index]?.url || "",
        })).filter((img) => img.url); // Chỉ giữ các image_urls có url hợp lệ
      
        // Tạo lại correct_image_matches dựa trên validLabels và updatedImageUrls
        const validCorrectImageMatches = validLabels
          .map((label, index) => {
            const image = updatedImageUrls[index];
            if (image) {
              return {
                label_id: label.id,
                url_id: image.id,
              };
            }
            return null;
          })
          .filter((cm): cm is { label_id: string; url_id: string } => cm !== null);
      
        // Kiểm tra xem mỗi label có một image tương ứng
        if (validCorrectImageMatches.length !== validLabels.length) {
          toast("Each label must have a corresponding image");
          setIsLoading(false);
          return;
        }
      
        // Cập nhật state newQuestion để phản ánh thay đổi
        setNewQuestion({
          ...newQuestion,
          content: {
            ...content,
            labels: validLabels,
            image_urls: updatedImageUrls,
            correct_image_matches: validCorrectImageMatches,
          },
        });
      
        finalContent = {
          labels: validLabels,
          image_urls: updatedImageUrls,
          correct_image_matches: validCorrectImageMatches,
        };
      
        console.log('>>content image matching update: ', finalContent);
      }

      // Validation dựa trên question_type
      switch (newQuestion.type) {
        case "single-choice":
        case "multiple-choice":
          const options = (
            newQuestion.content as {
              options: { id: string; text: string; is_correct: boolean }[];
            }
          ).options;
          if (!options.some((opt) => opt.is_correct)) {
            toast("Please select at least one correct answer");
            setIsLoading(false);
            return;
          }
          if (options.some((opt) => !opt.text.trim())) {
            toast("All options must have text");
            setIsLoading(false);
            return;
          }
          break;
        case "true-false":
          // Không cần kiểm tra thêm vì đã có giá trị mặc định
          break;
        case "fill-blanks":
          const blanks = (newQuestion.content as { answers: string[] }).answers;
          if (blanks.length === 0) {
            toast("Please add at least one blank using [[answer]] format");
            setIsLoading(false);
            return;
          }
          break;
      }

      const questionData = {
        quiz_id: quizId,
        question_text: newQuestion.text,
        question_type: newQuestion.type,
        content: finalContent,
        explanation: newQuestion.explanation,
        points: newQuestion.points,
        question_order: questions.length + 1,
      };

      console.log(">>>questionData: ", questionData);

      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz-questions/create`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: questionData,
      });

      if (res.statusCode === 201) {
        const question = res.data;
        setQuestions([
          ...questions,
          {
            id: question.id,
            type: question.question_type,
            text: question.question_text,
            content: question.content,
            explanation: question.explanation || "",
            points: question.points,
            question_order: questions.length + 1,
          },
        ]);
        setShowAddQuestion(false);

        // Reset form
        setNewQuestion({
          id: "",
          type: "single-choice",
          text: "",
          content: {
            options: [
              { id: "1", text: "", is_correct: false },
              { id: "2", text: "", is_correct: false },
            ],
          },
          explanation: "",
          points: 1,
        });
        setMathToolbarStates({
          description: false,
          questionText: false,
          explanation: false,
        });

        toast("Question added successfully");
      } else {
        throw new Error(res.message || "Failed to add question");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      toast("Failed to add question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (questionId: string) => {
    setQuestionToDelete(questionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;

    try {
      setIsLoading(true);
      const res = await handleDeleteQuestion(questionToDelete);
      console.log(">>>res delete: ", res);

      if (res.statusCode === 200) {
        const updatedQuestions = questions
          .filter((q) => q.id !== questionToDelete)
          .map((q, index) => ({
            ...q,
            question_order: index + 1,
          }));
        setQuestions(updatedQuestions);

        if (quizId && updatedQuestions.length > 0) {
          await updateQuestionsOrder(quizId, updatedQuestions);
        }

        toast("Question deleted successfully!");
        setDeleteDialogOpen(false);
        setQuestionToDelete(null);
      } else {
        throw new Error(res.message || "Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast("Failed to delete question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateQuestion = async (question: any) => {
    if (!quizId) {
      toast("Quiz must be saved before duplicating questions");
      return;
    }

    try {
      setIsLoading(true);

      const questionData = {
        quiz_id: quizId,
        question_text: `${question.text} (Copy)`,
        question_type: question.type,
        content: question.content,
        explanation: question.explanation,
        points: question.points,
        question_order: questions.length + 1,
      };

      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz-questions/create`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: questionData,
      });

      if (res.statusCode !== 201) {
        throw new Error("Failed to duplicate question");
      }

      const duplicatedQuestion = {
        ...question,
        id: res.data.id,
        text: `${question.text} (Copy)`,
        question_order: questions.length + 1,
      };
      const updatedQuestions = [...questions, duplicatedQuestion];
      setQuestions(updatedQuestions);

      await updateQuestionsOrder(quizId, updatedQuestions);

      toast("Question duplicated successfully");
    } catch (error) {
      console.error("Error duplicating question:", error);
      toast("Failed to duplicate question");
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionType = (typeId: string) => {
    return questionTypes.find((type) => type.id === typeId) || questionTypes[0];
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/quizzes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Quiz</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => debouncedSaveQuiz("draft")}
            disabled={isLoading || isSaving}
          >
            <FileText size={16} />
            Save as Draft
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => debouncedSaveQuiz("published")}
            disabled={isLoading || isSaving}
          >
            <Send size={16} />
            Publish Quiz
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={quiz.status === "published" ? "default" : "secondary"}>
          {quiz.status === "published" ? "Published" : "Draft"}
        </Badge>
        {quizId && (
          <span className="text-sm text-muted-foreground">
            Quiz ID: {quizId}
          </span>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="details">Quiz Details</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  placeholder="Enter quiz title"
                  value={quiz.title}
                  onChange={(e) => handleQuizChange("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <div className="border rounded-md shadow-sm">
                  <Tiptap
                    content={quiz.description}
                    onChange={(content) => handleQuizChange("description", content)}
                    showMathToolbar={mathToolbarStates.description}
                    setShowMathToolbar={() => toggleMathToolbar("description")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lesson">Lesson</Label>
                <Select
                  value={quiz.lesson_id}
                  onValueChange={(value) =>
                    handleQuizChange("lesson_id", value)
                  }
                >
                  <SelectTrigger id="lesson">
                    <SelectValue placeholder="Select lesson" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={quiz.category_id}
                    onValueChange={(value) =>
                      handleQuizChange("category_id", value)
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.label} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={quiz.difficulty_id}
                    onValueChange={(value) =>
                      handleQuizChange("difficulty_id", value)
                    }
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty.id} value={difficulty.id}>
                          {difficulty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quiz Questions</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setShowAddQuestion(true)}
                >
                  <FileUp size={16} />
                  Import from Excel
                </Button>
                <Button
                  className="flex items-center gap-2"
                  onClick={() => setShowAddQuestion(true)}
                >
                  <PlusCircle size={16} />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!quizId ? (
                <div className="text-center py-8 text-muted-foreground">
                  Please save the quiz details first before adding questions.
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No questions added yet. Click "Add Question" to create your
                  first question.
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="questions">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {questions.map((question, index) => {
                          const questionType = getQuestionType(question.type);
                          return (
                            <Draggable
                              key={question.id}
                              draggableId={question.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="border rounded-lg p-4 bg-card"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                      <div
                                        {...provided.dragHandleProps}
                                        className="mt-1 cursor-grab"
                                      >
                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            className={`${questionType.color} text-white`}
                                          >
                                            {questionType.name}
                                          </Badge>
                                          <span className="text-sm text-muted-foreground">
                                            {question.points}{" "}
                                            {question.points === 1
                                              ? "point"
                                              : "points"}
                                          </span>
                                          <span className="text-sm text-muted-foreground">
                                            Order: {question.question_order}
                                          </span>
                                        </div>
                                        <div
                                          className="font-medium"
                                          dangerouslySetInnerHTML={{ __html: question.text }}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleDuplicateQuestion(question)
                                        }
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() =>
                                          handleDeleteClick(question.id)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}

              {showAddQuestion && (
                <div className="mt-6 border rounded-lg p-6 space-y-6 bg-card">
                  <h3 className="font-semibold text-lg">Add New Question</h3>
                  <div className="space-y-2">
                    <Label htmlFor="questionType">Question Type</Label>
                    <Select
                      value={newQuestion.type}
                      onValueChange={(value) => {
                        let newContent: QuizQuestionContent;
                        switch (value) {
                          case "single-choice":
                          case "multiple-choice":
                            newContent = {
                              options: [
                                { id: "1", text: "", is_correct: false },
                                { id: "2", text: "", is_correct: false },
                              ],
                            };
                            break;
                          case "true-false":
                            newContent = { correct_answer: true };
                            break;
                          case "matching":
                            newContent = {
                              items: [
                                {
                                  id: uuidv4(),
                                  text: ""
                                },
                                {
                                  id: uuidv4(),
                                  text: ""
                                }
                              ],
                              matches: [
                                {
                                  id: uuidv4(),
                                  text: ""
                                },
                                {
                                  id: uuidv4(),
                                  text: ""
                                }
                              ],
                              correct_matches: []
                            };
                            break;

                            // newContent = {
                            //   pairs: [
                            //     { item: "", match: "" },
                            //     { item: "", match: "" },
                            //   ],
                            // };
                            break;
                          case "image-matching":
                            newContent = {
                              labels: [
                                { id: uuidv4(), text: "" },
                                { id: uuidv4(), text: "" },
                              ],
                              image_urls: [
                                { id: uuidv4(), url: "" },
                                { id: uuidv4(), url: "" },
                              ],
                              correct_image_matches: []
                            };
                            break;

                          case "fill-blanks":
                            newContent = { answers: [] };
                            break;
                          default:
                            newContent = { options: [] };
                        }
                        setNewQuestion({
                          ...newQuestion,
                          type: value,
                          text:
                            value === "fill-blanks"
                              ? "<p>Example: The capital of France is [[Paris]].</p>"
                              : "",
                          content: newContent,
                        });
                        setMathToolbarStates((prev) => ({
                          ...prev,
                          questionText: true,
                          explanation: true,
                          ...Object.fromEntries(
                            (newContent as any).options?.map((opt: any) => [
                              `option-${opt.id}`,
                              true,
                            ]) || []
                          ),
                        }));
                      }}
                    >
                      <SelectTrigger id="questionType">
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="questionText">Question Text</Label>
                    <div className="border rounded-md shadow-sm">
                      <Tiptap
                        content={newQuestion.text}
                        onChange={(content) => {
                          if (newQuestion.type === "fill-blanks") {
                            const tempDiv = document.createElement("div");
                            tempDiv.innerHTML = content;
                            const textContent = tempDiv.textContent || "";
                            const blanks = Array.from(
                              textContent.matchAll(/\[\[(.*?)\]\]/g)
                            ).map((match) => match[1]);
                            setNewQuestion({
                              ...newQuestion,
                              text: content,
                              content: { answers: blanks },
                            });
                          } else {
                            setNewQuestion({ ...newQuestion, text: content });
                          }
                        }}
                        showMathToolbar={mathToolbarStates.questionText}
                        setShowMathToolbar={() => toggleMathToolbar("questionText")}
                      />
                    </div>
                    {newQuestion.type === "fill-blanks" && (
                      <p className="text-xs text-muted-foreground">
                        Use double square brackets to create blanks: [[answer]]. For example: "The capital of France is [[Paris]]."
                      </p>
                    )}
                  </div>
                  {(newQuestion.type === "single-choice" ||
                    newQuestion.type === "multiple-choice") && (
                      <div className="space-y-4">
                        <Label>Options</Label>
                        {(
                          newQuestion.content as {
                            options: {
                              id: string;
                              text: string;
                              is_correct: boolean;
                            }[];
                          }
                        ).options.map((option, index) => (
                          <div
                            key={option.id}
                            className="flex items-center gap-3 border rounded-md p-4 bg-background"
                          >
                            <div className="flex-1">
                              <Tiptap
                                content={option.text}
                                onChange={(content) => {
                                  const updatedOptions = [
                                    ...(newQuestion.content as any).options,
                                  ];
                                  updatedOptions[index].text = content;
                                  setNewQuestion({
                                    ...newQuestion,
                                    content: { options: updatedOptions },
                                  });
                                }}
                                showMathToolbar={
                                  mathToolbarStates[`option-${option.id}`]
                                }
                                setShowMathToolbar={() =>
                                  toggleMathToolbar(`option-${option.id}`)
                                }
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor={`correct-${option.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  Correct
                                </Label>
                                <Switch
                                  id={`correct-${option.id}`}
                                  checked={option.is_correct}
                                  onCheckedChange={(checked) => {
                                    const updatedOptions = [
                                      ...(newQuestion.content as any).options,
                                    ];
                                    if (
                                      newQuestion.type === "single-choice" &&
                                      checked
                                    ) {
                                      updatedOptions.forEach(
                                        (opt) => (opt.is_correct = false)
                                      );
                                    }
                                    updatedOptions[index].is_correct = checked;
                                    setNewQuestion({
                                      ...newQuestion,
                                      content: { options: updatedOptions },
                                    });
                                  }}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (
                                    (newQuestion.content as any).options.length > 2
                                  ) {
                                    const updatedOptions = [
                                      ...(newQuestion.content as any).options,
                                    ];
                                    updatedOptions.splice(index, 1);
                                    setNewQuestion({
                                      ...newQuestion,
                                      content: { options: updatedOptions },
                                    });
                                    setMathToolbarStates((prev) => {
                                      const newState = { ...prev };
                                      delete newState[`option-${option.id}`];
                                      return newState;
                                    });
                                  }
                                }}
                                disabled={
                                  (newQuestion.content as any).options.length <= 2
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() => {
                            const newOption = {
                              id: `option-${Date.now()}`,
                              text: "",
                              is_correct: false,
                            };
                            const updatedOptions = [
                              ...(newQuestion.content as any).options,
                              newOption,
                            ];
                            setNewQuestion({
                              ...newQuestion,
                              content: { options: updatedOptions },
                            });
                            setMathToolbarStates((prev) => ({
                              ...prev,
                              [`option-${newOption.id}`]: true,
                            }));
                          }}
                        >
                          Add Option
                        </Button>
                      </div>
                    )}
                  {newQuestion.type === "true-false" && (
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="true-option"
                            checked={
                              (
                                newQuestion.content as {
                                  correct_answer: boolean;
                                }
                              ).correct_answer === true
                            }
                            onChange={() =>
                              setNewQuestion({
                                ...newQuestion,
                                content: { correct_answer: true },
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="true-option">True</Label>
                        </div>
                        <div className="flex items-center space-x-2 ml-6">
                          <input
                            type="radio"
                            id="false-option"
                            checked={
                              (
                                newQuestion.content as {
                                  correct_answer: boolean;
                                }
                              ).correct_answer === false
                            }
                            onChange={() =>
                              setNewQuestion({
                                ...newQuestion,
                                content: { correct_answer: false },
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="false-option">False</Label>
                        </div>
                      </div>
                    </div>
                  )}
                  {newQuestion.type === "matching" && (
                    <div className="space-y-4">
                      <Label>Matching Pairs</Label>
                      <p className="text-sm text-muted-foreground">
                        Create pairs of items that students will need to match
                        correctly.
                      </p>
                      {(
                        newQuestion.content as {
                          items: { id: string; text: string }[];
                          matches: { id: string; text: string }[];
                          correct_matches: { item_id: string; match_id: string }[];
                        }
                      ).items.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <Input
                            placeholder={`Item ${index + 1}`}
                            value={item.text}
                            onChange={(e) => {
                              const updatedItems = [
                                ...(newQuestion.content as any).items,
                              ];
                              updatedItems[index].text = e.target.value;
                              setNewQuestion({
                                ...newQuestion,
                                content: {
                                  ...(newQuestion.content as any),
                                  items: updatedItems,
                                },
                              });
                            }}
                          />
                          <span className="mx-2">→</span>
                          <Input
                            placeholder={`Match ${index + 1}`}
                            value={
                              (newQuestion.content as any).matches.find(
                                (match: any) => match.id === (newQuestion.content as any).correct_matches.find(
                                  (cm: any) => cm.item_id === item.id
                                )?.match_id
                              )?.text || ""
                            }
                            onChange={(e) => {
                              const content = newQuestion.content as any;
                              const updatedMatches = [...content.matches];
                              const matchIndex = updatedMatches.findIndex(
                                (match: any) => match.id === content.correct_matches.find(
                                  (cm: any) => cm.item_id === item.id
                                )?.match_id
                              );

                              if (matchIndex >= 0) {
                                updatedMatches[matchIndex].text = e.target.value;
                              } else {
                                const newMatch = {
                                  id: uuidv4(),
                                  text: e.target.value
                                };
                                updatedMatches.push(newMatch);
                                const updatedCorrectMatches = [...content.correct_matches];
                                updatedCorrectMatches.push({
                                  item_id: item.id,
                                  match_id: newMatch.id
                                });
                                setNewQuestion({
                                  ...newQuestion,
                                  content: {
                                    ...content,
                                    matches: updatedMatches,
                                    correct_matches: updatedCorrectMatches
                                  }
                                });
                                return;
                              }

                              setNewQuestion({
                                ...newQuestion,
                                content: {
                                  ...content,
                                  matches: updatedMatches
                                }
                              });
                            }}
                          />
                          {(newQuestion.content as any).items.length > 2 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const updatedItems = [...(newQuestion.content as any).items];
                                const updatedMatches = [...(newQuestion.content as any).matches];
                                const updatedCorrectMatches = [
                                  ...(newQuestion.content as any).correct_matches,
                                ].filter((cm: any) => cm.item_id !== item.id);
                                updatedItems.splice(index, 1);
                                if (updatedMatches[index]) {
                                  updatedMatches.splice(index, 1);
                                }
                                setNewQuestion({
                                  ...newQuestion,
                                  content: {
                                    items: updatedItems,
                                    matches: updatedMatches,
                                    correct_matches: updatedCorrectMatches,
                                  },
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const content = newQuestion.content as any;
                          const newItemId = uuidv4();
                          const newMatchId = uuidv4();

                          setNewQuestion({
                            ...newQuestion,
                            content: {
                              ...content,
                              items: [
                                ...content.items,
                                { id: newItemId, text: "" }
                              ],
                              matches: [
                                ...content.matches,
                                { id: newMatchId, text: "" }
                              ],
                              correct_matches: [
                                ...content.correct_matches,
                                { item_id: newItemId, match_id: newMatchId }
                              ]
                            }
                          });
                        }}
                      >
                        Add Pair
                      </Button>
                    </div>
                  )}
                  {newQuestion.type === "image-matching" && (
                    <div className="space-y-4">
                      <Label>Image-Label Pairs</Label>
                      <p className="text-sm text-muted-foreground">
                        Create pairs of images and labels that students will need to match correctly.
                      </p>
                      {(() => {
                        const content = newQuestion.content as {
                          labels: { id: string; text: string }[];
                          image_urls: { id: string; url: string }[];
                          image_files?: File[];
                          preview_urls?: string[];
                          correct_image_matches: { label_id: string; url_id: string }[];
                        };
                        return content.labels.map((label, index) => (
                          <div key={label.id} className="flex items-center gap-3">
                            <div className="w-24 h-24 border border-muted rounded flex items-center justify-center relative bg-muted/10">
                              <img
                                src={
                                  content.preview_urls?.[index] ||
                                  (content.image_urls[index]?.url
                                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${content.image_urls[index].url}`
                                    : "/placeholder.svg")
                                }
                                alt={`Image ${index + 1}`}
                                className="max-w-full max-h-full object-contain p-1"
                              />
                              <div className="absolute bottom-1 right-1">
                                <FileUploadArea
                                  onFileSelect={(file: File, previewUrl: string) => {
                                    const updatedImageFiles = [...(content.image_files || [])];
                                    const updatedPreviewUrls = [...(content.preview_urls || [])];
                                    const updatedImageUrls = [...(content.image_urls || [])];
                                    updatedImageFiles[index] = file;
                                    updatedPreviewUrls[index] = previewUrl;
                                    if (!updatedImageUrls[index]) {
                                      updatedImageUrls[index] = { id: uuidv4(), url: "" };
                                    }
                                    setNewQuestion({
                                      ...newQuestion,
                                      content: {
                                        ...content,
                                        image_files: updatedImageFiles,
                                        preview_urls: updatedPreviewUrls,
                                        image_urls: updatedImageUrls,
                                      },
                                    });
                                  }}
                                  accept="image/*"
                                  size="compact"
                                  className="w-8 h-8 bg-background/80 hover:bg-background/90 rounded-full flex items-center justify-center transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-1"
                                />
                              </div>
                            </div>
                            <Input
                              placeholder={`Label for image ${index + 1}`}
                              value={label.text}
                              onChange={(e) => {
                                const updatedLabels = [...content.labels];
                                updatedLabels[index].text = e.target.value;
                                setNewQuestion({
                                  ...newQuestion,
                                  content: { ...content, labels: updatedLabels },
                                });
                              }}
                            />
                            {content.labels.length > 2 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const updatedLabels = [...content.labels];
                                  const updatedImageUrls = [...content.image_urls];
                                  const updatedImageFiles = [...(content.image_files || [])];
                                  const updatedPreviewUrls = [...(content.preview_urls || [])];
                                  const updatedCorrectMatches = [
                                    ...content.correct_image_matches,
                                  ].filter((cm) => cm.label_id !== label.id);
                                  updatedLabels.splice(index, 1);
                                  updatedImageUrls.splice(index, 1);
                                  updatedImageFiles.splice(index, 1);
                                  updatedPreviewUrls.splice(index, 1);
                                  setNewQuestion({
                                    ...newQuestion,
                                    content: {
                                      ...content,
                                      labels: updatedLabels,
                                      image_urls: updatedImageUrls,
                                      image_files: updatedImageFiles,
                                      preview_urls: updatedPreviewUrls,
                                      correct_image_matches: updatedCorrectMatches,
                                    },
                                  });
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ));
                      })()}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const content = newQuestion.content as any;
                          const newLabelId = uuidv4();
                          const newImageId = uuidv4();
                          setNewQuestion({
                            ...newQuestion,
                            content: {
                              ...content,
                              labels: [...content.labels, { id: newLabelId, text: "" }],
                              image_urls: [...content.image_urls, { id: newImageId, url: "" }],
                              image_files: [...(content.image_files || [])],
                              preview_urls: [...(content.preview_urls || []), "/placeholder.svg"],
                              correct_image_matches: [
                                ...content.correct_image_matches,
                                { label_id: newLabelId, url_id: newImageId },
                              ],
                            },
                          });
                        }}
                      >
                        Add Image-Label Pair
                      </Button>
                    </div>
                  )}



                  {newQuestion.type === "fill-blanks" && (
                    <div className="space-y-4">
                      <div className="border p-4 rounded-md bg-muted/30">
                        <Label className="block mb-2">Preview</Label>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: newQuestion.text.replace(
                              /\[\[(.*?)\]\]/g,
                              '<span class="bg-primary/20 px-1 rounded">______</span>'
                            ),
                          }}
                        />
                      </div>
                      <div>
                        <Label className="block mb-2">Detected Answers</Label>
                        <div className="flex flex-wrap gap-2">
                          {(
                            newQuestion.content as { answers: string[] }
                          ).answers.map((answer, index) => (
                            <div
                              key={index}
                              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                            >
                              {answer}
                            </div>
                          ))}
                        </div>
                        {(newQuestion.content as { answers: string[] }).answers
                          .length === 0 && (
                            <p className="text-sm text-amber-600 mt-2">
                              No blanks detected. Use [[answer]] format to create
                              blanks.
                            </p>
                          )}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="explanation">Explanation (Optional)</Label>
                    <div className="border rounded-md shadow-sm">
                      <Tiptap
                        content={newQuestion.explanation || ""}
                        onChange={(content) =>
                          setNewQuestion({
                            ...newQuestion,
                            explanation: content,
                          })
                        }
                        showMathToolbar={mathToolbarStates.explanation}
                        setShowMathToolbar={() => toggleMathToolbar("explanation")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={newQuestion.points}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          points: Number.parseInt(e.target.value, 10) || 1,
                        })
                      }
                      className="w-24"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddQuestion(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddQuestion}
                      disabled={
                        isLoading ||
                        !newQuestion.text.trim() ||
                        (["single-choice", "multiple-choice"].includes(
                          newQuestion.type
                        ) &&
                          !(newQuestion.content as any).options.some(
                            (o: any) => o.is_correct
                          )) ||
                        (newQuestion.type === "matching" &&
                          // (!(newQuestion.content as any).items?.length || !(newQuestion.content as any).matches?.length)) ||
                          !(newQuestion.content as any).items?.length) ||
                        (newQuestion.type === "image-matching" &&
                          // (!(newQuestion.content as any).labels?.length || !(newQuestion.content as any).image_urls?.length)) ||
                          !(newQuestion.content as any).labels?.length) ||
                        (newQuestion.type === "fill-blanks" &&
                          !(newQuestion.content as any).answers.length)
                      }
                    >
                      Add Question
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      min="1"
                      value={quiz.time_limit}
                      onChange={(e) =>
                        handleSettingsChange(
                          "time_limit",
                          parseInt(e.target.value, 10) || 30
                        )
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Set to 0 for no time limit
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                      id="passingScore"
                      type="number"
                      min="0"
                      max="100"
                      value={quiz.passing_score}
                      onChange={(e) =>
                        handleSettingsChange(
                          "passing_score",
                          parseInt(e.target.value, 10) || 70
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Maximum Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      min="1"
                      value={quiz.max_attempts}
                      onChange={(e) =>
                        handleSettingsChange(
                          "max_attempts",
                          parseInt(e.target.value, 10) || 1
                        )
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Set to 0 for unlimited attempts
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium">Display Options</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="randomizeQuestions">
                        Randomize Questions
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Present questions in random order for each attempt
                      </p>
                    </div>
                    <Switch
                      id="randomizeQuestions"
                      checked={quiz.randomize_questions}
                      onCheckedChange={(checked) =>
                        handleSettingsChange("randomize_questions", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showResults">Show Results</Label>
                      <p className="text-sm text-muted-foreground">
                        Display score and results after quiz completion
                      </p>
                    </div>
                    <Switch
                      id="showResults"
                      checked={quiz.show_results}
                      onCheckedChange={(checked) =>
                        handleSettingsChange("show_results", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showCorrectAnswers">
                        Show Correct Answers
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Display correct answers after quiz completion
                      </p>
                    </div>
                    <Switch
                      id="showCorrectAnswers"
                      checked={quiz.show_correct_answers}
                      onCheckedChange={(checked) =>
                        handleSettingsChange("show_correct_answers", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showExplanations">
                        Show Explanations
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Display explanations for answers after quiz completion
                      </p>
                    </div>
                    <Switch
                      id="showExplanations"
                      checked={quiz.show_explanations}
                      onCheckedChange={(checked) =>
                        handleSettingsChange("show_explanations", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              question.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}