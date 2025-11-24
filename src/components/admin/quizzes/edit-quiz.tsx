"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  ArrowLeft,
  FileText,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  handleDeleteQuestion,
  handleGetCategories,
  handleGetLessons,
  handleGetQuizLevels,
  handleUpdateQuestion,
  handleUpdateQuiz,
  type Quiz,
} from "@/utils/action";
import { sendRequest } from "@/utils/api";
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
import { v4 as uuidv4 } from "uuid";

// Mock data
const mockCategories = [
  { id: "1", name: "Programming" },
  { id: "2", name: "Mathematics" },
  { id: "3", name: "Science" },
  { id: "4", name: "Language" },
];

const mockDifficulties = [
  { id: "1", name: "Beginner", description: "Beginner level quizzes are designed for learners who are new to the subject. They cover basic concepts and terminology, providing a foundation for further learning." },
  { id: "2", name: "Intermediate", description: "Intermediate level quizzes are designed for learners who have a basic understanding of the subject. They cover more complex concepts and terminology, providing a foundation for further learning." },
  { id: "3", name: "Advanced", description: "Advanced level quizzes are designed for learners who have a strong understanding of the subject. They cover complex concepts and terminology, providing a foundation for further learning." },
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

type QuizQuestionContent =
  | { options: { id: string; text: string; is_correct: boolean }[] } // single-choice, multiple-choice
  | { correct_answer: boolean } // true-false
  | {
    items: { id: string; text: string }[];
    matches: { id: string; text: string }[];
    correct_matches: { item_id: string; match_id: string }[];
  } // matching
  | {
    labels: { id: string; text: string }[];
    image_urls: { id: string; url: string }[];
    correct_image_matches: { url_id: string; label_id: string }[];
    image_files?: File[]; // Temporary storage for new uploads
    preview_urls?: string[]; // Temporary storage for preview URLs
  } // image-matching
  | { answers: { id: string; text: string }[], correct_answers: string[] };
// | { answers: string[] }; // fill-blanks

interface QuizEdit {
  author: string;
  author_id: string;
  category: string;
  category_id: string;
  created_at: string;
  description: string;
  difficulty: string;
  difficulty_id: string;
  id: string;
  lesson: string;
  lesson_id: string;
  max_attempts: number;
  passing_score: number;
  questions: {
    id: string;
    question_type: string;
    question_text: string;
    content: QuizQuestionContent;
    explanation: string;
    points: number;
    question_order: number;
  }[];
  randomize_questions: boolean;
  show_correct_answers: boolean;
  show_explanations: boolean;
  show_results: boolean;
  status: string;
  time_limit: number;
  title: string;
  updated_at: string;
}

export default function EditQuizPage(props: any) {
  const { session } = props;
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<QuizEdit | null>(null);
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
  const [activeTab, setActiveTab] = useState("details");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
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
  const [lessons, setLessons] = useState(mockLessons);
  const [difficulties, setDifficulties] = useState(mockDifficulties);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle MathToolbar for a specific field
  const toggleMathToolbar = (field: string) => {
    setMathToolbarStates((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!quizId) return;

      setIsLoading(true);
      try {
        const quizData = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/${quizId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
          },
        });

        if (quizData.statusCode === 200) {
          const fetchedQuiz = quizData.data;
          setQuiz(fetchedQuiz);

          if (fetchedQuiz.questions && Array.isArray(fetchedQuiz.questions)) {
            try {
              const mappedQuestions = fetchedQuiz.questions.map((q: any) => ({
                id: q.id,
                type: q.question_type,
                text: q.question_text,
                content:
                  q.question_type === "single-choice" ||
                    q.question_type === "multiple-choice"
                    ? {
                      options: q.content.options.map((opt: any) => ({
                        ...opt,
                        text: opt.text,
                      })),
                    }
                    : q.question_type === "true-false"
                      ? { correct_answer: q.content.correct_answer }
                      : q.question_type === "matching"
                        ? {
                          items: q.content.items.map((item: any) => ({
                            id: item.id,
                            text: item.text,
                          })),
                          matches: q.content.matches.map((match: any) => ({
                            id: match.id,
                            text: match.text,
                          })),
                          correct_matches: q.content.correct_matches.map(
                            (cm: any) => ({
                              item_id: cm.item_id,
                              match_id: cm.match_id,
                            })
                          ),
                        }
                        : q.question_type === "image-matching"
                          ? {
                            labels: q.content.labels.map((label: any) => ({
                              id: label.id,
                              text: label.text,
                            })),
                            image_urls: q.content.image_urls.map((img: any) => ({
                              id: img.id,
                              url: img.url,
                            })),
                            correct_image_matches: q.content.correct_image_matches.map(
                              (cm: any) => ({
                                url_id: cm.url_id,
                                label_id: cm.label_id,
                              })
                            ),
                            preview_urls: q.content.image_urls.map((img: any) =>
                              img.url
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${img.url}`
                                : "/placeholder.svg?height=100&width=100"
                            ),
                          }
                          : q.content,
                explanation: q.explanation || "",
                points: q.points || 1,
                question_order: q.question_order || 0,
              }));
              setQuestions(mappedQuestions);
            } catch (error) {
              console.error("Error mapping questions:", error);
              setQuestions([]);
            }
          } else {
            setQuestions([]);
          }
        } else {
          throw new Error("Failed to fetch quiz data");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast("Failed to load quiz data");
        router.push("/admin/quizzes");
      } finally {
        setIsLoading(false);
      }
    };

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
          setCategories(
            mockCategories.map((c) => ({ label: c.name, value: c.id }))
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(
          mockCategories.map((c) => ({ label: c.name, value: c.id }))
        );
      }
    };

    fetchQuizData();
    fetchLessons();
    fetchCategories();
    fetchDifficulties();
  }, [quizId, session, router]);

  useEffect(() => {
    console.log("Questions state updated:", questions);
  }, [questions]);

  useEffect(() => {
    const fetchUpdatedQuestions = async () => {
      if (!quizId) return;

      try {
        const quizData = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/${quizId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
          },
        });

        if (quizData.statusCode === 200) {
          const fetchedQuiz = quizData.data;
          if (fetchedQuiz.questions && Array.isArray(fetchedQuiz.questions)) {
            const mappedQuestions = fetchedQuiz.questions.map((q: any) => ({
              id: q.id,
              type: q.question_type,
              text: q.question_text,
              content:
                q.question_type === "fill-blanks"
                  ? {
                      answers: Array.isArray(q.content.answers)
                        ? q.content.answers
                        : [],
                      correct_answers: Array.isArray(q.content.correct_answers)
                        ? q.content.correct_answers
                        : []
                    }
                  : q.content,
              explanation: q.explanation || "",
              points: q.points || 1,
              question_order: q.question_order || 0,
            }));
            setQuestions(mappedQuestions);
          }
        }
      } catch (error) {
        console.error("Error fetching updated questions:", error);
      }
    };

    if (editingQuestionId === null) {
      fetchUpdatedQuestions();
    }
  }, [editingQuestionId, quizId, session?.user?.access_token]);

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

  const handleQuizChange = (field: string, value: any) => {
    setQuiz((prevQuiz) =>
      prevQuiz ? { ...prevQuiz, [field]: value } : prevQuiz
    );
  };

  const handleSettingsChange = (field: string, value: any) => {
    setQuiz((prevQuiz) =>
      prevQuiz ? { ...prevQuiz, [field]: value } : prevQuiz
    );
  };

  const handleSaveQuiz = async (status: string) => {
    if (!quiz) {
      toast("Quiz data is not loaded");
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

      console.log(">>>quizId:", quizId);
      const updatedQuiz = await handleUpdateQuiz(quizId, quizData);
      console.log(">>>updatedQuiz:", updatedQuiz);

      if (questions.length > 0) {
        await updateQuestionsOrder(quizId, questions);
      }

      setQuiz(updatedQuiz);
      toast(
        `Quiz ${status === "published" ? "published" : "saved as draft"} successfully`
      );
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast("Failed to save quiz");
    } finally {
      setIsLoading(false);
    }
  };

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
    console.log(">>>Reordered questions:", updatedItems);

    if (quizId) {
      updateQuestionsOrder(quizId, updatedItems).catch((error) => {
        console.error("Failed to update question order:", error);
        toast("Failed to update question order");
      });
    }
  };

  const handleEditQuestion = async (question: any) => {
    if (editingQuestionId === question.id) {
      setEditingQuestionId(null);
      return;
    }
    setMathToolbarStates({
      description: false,
      questionText: false,
      explanation: false,
    });

    setEditingQuestionId(question.id);

    setNewQuestion({
      id: question.id,
      type: question.type,
      text: question.text,
      content:
        question.type === "fill-blanks"
          ? { answers: question.content.answers || [] }
          : JSON.parse(JSON.stringify(question.content)),
      explanation: question.explanation || "",
      points: question.points,
    });
  };

  interface ResFile {
    statusCode: number;
    message: string;
    data: {
      message: string;
      url: string;
    };
  }

  const uploadFileToServer = async (file: File): Promise<ResFile> => {
    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/single`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file");
    }

    const result = await uploadResponse.json();
    return result;
  };

  interface ResFiles {
    message: string;
    statusCode: number;
    data: {
      message: string;
      urls: string[];
    };
  }

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

  const handleDeleteClick = (questionId: string) => {
    // Nếu là question tạm thời (chưa lưu vào DB)
    if (questionId.startsWith('temp-')) {
      const updatedQuestions = questions
        .filter((q) => q.id !== questionId)
        .map((q, index) => ({
          ...q,
          question_order: index + 1,
        }));
      setQuestions(updatedQuestions);
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
      return;
    }

    setQuestionToDelete(questionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;

    try {
      setIsLoading(true);
      const res = await handleDeleteQuestion(questionToDelete);

      if (res && res.statusCode === 200) {
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
        throw new Error(res?.message || "Failed to delete question");
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
        content:
          question.type === "fill-blanks"
            ? { answers: question.content.answers || [] }
            : question.content,
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
        content:
          question.type === "fill-blanks"
            ? { answers: res.data.content.answers || [] }
            : res.data.content,
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

      if (newQuestion.type === "image-matching") {
        const content = newQuestion.content as {
          labels: { id: string; text: string }[];
          image_urls: { id: string; url: string }[];
          image_files?: File[];
          correct_image_matches: { url_id: string; label_id: string }[];
        };
        const imageFiles = content.image_files || [];
        if (imageFiles.length > 0) {
          const res = await uploadManyFileToServer(imageFiles);
          finalContent = {
            labels: content.labels,
            image_urls: content.image_urls.map((img, index) => ({
              id: img.id,
              url: imageFiles[index] ? res.data.urls[index] : img.url,
            })),
            correct_image_matches: content.labels.map((label, index) => ({
              url_id: content.image_urls[index].id,
              label_id: label.id
            }))
          };
        } else {
          // Keep existing images if no new files are uploaded
          finalContent = {
            labels: content.labels,
            image_urls: content.image_urls.filter(img => img.url), // Only keep images that have URLs
            correct_image_matches: content.labels.map((label, index) => ({
              url_id: content.image_urls[index].id,
              label_id: label.id
            }))
          };
        }
      } else if (newQuestion.type === "matching") {
        finalContent = {
          items: (newQuestion.content as any).items,
          matches: (newQuestion.content as any).matches,
          correct_matches: (newQuestion.content as any).correct_matches,
        };
      } else if (newQuestion.type === "fill-blanks") {
        finalContent = {
          answers: (newQuestion.content as { answers: { id: string; text: string }[] }).answers
            .map((answer) => ({
              id: answer.id || uuidv4(),
              text: answer.text ? String(answer.text).trim() : "",
            }))
            .filter((answer) => answer.text),
          correct_answers: (newQuestion.content as { answers: { id: string; text: string }[] }).answers
            .filter(answer => answer.text && answer.text.trim())
            .map(answer => answer.id)
        };
      }

      const questionData = {
        quiz_id: quizId,
        question_text: newQuestion.text,
        question_type: newQuestion.type,
        content: finalContent,
        explanation: newQuestion.explanation,
        points: newQuestion.points,
        question_order: editingQuestionId
          ? questions.find((q) => q.id === editingQuestionId)?.question_order ||
          questions.length
          : questions.length + 1,
      };

      // Validation based on question_type
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
        case "matching":
          const { items, matches, correct_matches } = newQuestion.content as any;
          if (
            items.some((item: any) => !item.text.trim()) ||
            matches.some((match: any) => !match.text.trim())
          ) {
            toast("All items and matches must have text");
            setIsLoading(false);
            return;
          }
          if (
            correct_matches.length !== items.length ||
            correct_matches.length !== matches.length
          ) {
            toast("Each item must have a corresponding match");
            setIsLoading(false);
            return;
          }
          break;
        case "image-matching":
          const { labels, image_urls } = newQuestion.content as any;
          if (labels.some((label: any) => !label.text.trim())) {
            toast("All labels must have text");
            setIsLoading(false);
            return;
          }
          if (
            image_urls.some(
              (img: any) => !img.url && !(newQuestion.content as any).image_files?.length
            )
          ) {
            toast("All images must be uploaded");
            setIsLoading(false);
            return;
          }
          break;
        case "fill-blanks":
          const blanks = (newQuestion.content as { answers: { id: string; text: string }[] }).answers;
          if (blanks.length === 0 || !blanks.some((answer) => answer.text && answer.text.trim())) {
            toast("Please add at least one valid blank using [[answer]] format");
            setIsLoading(false);
            return;
          }
          break;
      }

      const isTemporaryQuestion = editingQuestionId?.startsWith("temp-");

      if (editingQuestionId && !isTemporaryQuestion) {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz-questions/${editingQuestionId}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
          },
          body: { ...questionData, id: editingQuestionId },
        });

        if (res.statusCode === 200) {
          const updatedQuestion = res.data;
          setQuestions((prev) =>
            prev.map((q) =>
              q.id === editingQuestionId
                ? {
                  id: updatedQuestion.id,
                  type: updatedQuestion.question_type,
                  text: updatedQuestion.question_text,
                  content:
                    updatedQuestion.question_type === "fill-blanks"
                      ? {
                        answers: Array.isArray(updatedQuestion.content.answers)
                          ? updatedQuestion.content.answers
                            .map((answer: any) => (answer ? String(answer).trim() : ""))
                            .filter((answer: string) => answer)
                          : [],
                      }
                      : updatedQuestion.content,
                  explanation: updatedQuestion.explanation || "",
                  points: updatedQuestion.points,
                  question_order: updatedQuestion.question_order,
                }
                : q
            )
          );
          setEditingQuestionId(null);
          toast("Question updated successfully");
        } else {
          throw new Error(res.message || "Failed to update question");
        }
      } else {
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

          if (isTemporaryQuestion) {
            setQuestions((prev) =>
              prev.map((q) =>
                q.id === editingQuestionId
                  ? {
                    id: question.id,
                    type: question.question_type,
                    text: question.question_text,
                    content:
                      question.question_type === "fill-blanks"
                        ? {
                          answers: Array.isArray(question.content.answers)
                            ? question.content.answers
                              .map((answer: any) => (answer ? String(answer).trim() : ""))
                              .filter((answer: string) => answer)
                            : [],
                        }
                        : question.content,
                    explanation: question.explanation || "",
                    points: question.points,
                    question_order: question.question_order,
                  }
                  : q
              )
            );
          } else {
            setQuestions([
              ...questions,
              {
                id: question.id,
                type: question.question_type,
                text: question.question_text,
                content:
                  question.question_type === "fill-blanks"
                    ? {
                      answers: Array.isArray(question.content.answers)
                        ? question.content.answers
                          .map((answer: any) => (answer ? String(answer).trim() : ""))
                          .filter((answer: string) => answer)
                        : [],
                    }
                    : question.content,
                explanation: question.explanation || "",
                points: question.points,
                question_order: questions.length + 1,
              },
            ]);
          }

          setEditingQuestionId(null);
          toast("Question added successfully");
        } else {
          throw new Error(res.message || "Failed to add question");
        }
      }

      setMathToolbarStates({
        description: false,
        questionText: false,
        explanation: false,
      });
    } catch (error) {
      console.error("Error adding/updating question:", error);
      toast(
        editingQuestionId ? "Failed to update question" : "Failed to add question"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionType = (typeId: string) => {
    return questionTypes.find((type) => type.id === typeId) || questionTypes[0];
  };

  if (isLoading && !quiz) {
    return <div className="container mx-auto py-6">Loading...</div>;
  }

  if (!quiz) {
    return (
      <div className="container mx-auto py-6">Failed to load quiz data.</div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/quizzes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Quiz</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleSaveQuiz("draft")}
            disabled={isLoading}
          >
            <FileText size={16} />
            Save as Draft
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => handleSaveQuiz("published")}
            disabled={isLoading}
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
        <span className="text-sm text-muted-foreground">Quiz ID: {quizId}</span>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
                  onValueChange={(value) => handleQuizChange("lesson_id", value)}
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
                    onValueChange={(value) => handleQuizChange("category_id", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
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
                    onValueChange={(value) => handleQuizChange("difficulty_id", value)}
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
                  onClick={() => {
                    alert("Import from Excel would be implemented here");
                  }}
                >
                  <FileUp size={16} />
                  Import from Excel
                </Button>
                <Button
                  className="flex items-center gap-2"
                  onClick={() => {
                    setEditingQuestionId(null);
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

                    const tempId = `temp-${Date.now()}`;
                    const newTempQuestion = {
                      id: tempId,
                      type: "single-choice",
                      text: "<p>New question</p>",
                      content: {
                        options: [
                          { id: "1", text: "", is_correct: false },
                          { id: "2", text: "", is_correct: false },
                        ],
                      },
                      explanation: "",
                      points: 1,
                      question_order: questions.length + 1,
                    };

                    setQuestions([...questions, newTempQuestion]);
                    setEditingQuestionId(tempId);
                  }}
                >
                  <PlusCircle size={16} />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No questions added yet. Click "Add Question" to create your first question.
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
                              key={`question-${question.id}`}
                              draggableId={`question-${question.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <>
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
                                            <Badge className={`${questionType.color} text-white`}>
                                              {questionType.name}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                              {question.points} {question.points === 1 ? "point" : "points"}
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
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleEditQuestion(question)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDuplicateQuestion(question)}
                                        >
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-destructive hover:text-destructive"
                                          onClick={() => handleDeleteClick(question.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>

                                  {editingQuestionId === question.id && (
                                    <div className="mt-2 mb-4 border rounded-lg p-6 space-y-6 bg-card ml-8">
                                      <h3 className="font-semibold text-lg">Edit Question</h3>

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
                                                    { id: `item-${Date.now()}`, text: "" },
                                                    { id: `item-${Date.now() + 1}`, text: "" },
                                                  ],
                                                  matches: [
                                                    { id: `match-${Date.now()}`, text: "" },
                                                    { id: `match-${Date.now() + 1}`, text: "" },
                                                  ],
                                                  correct_matches: [],
                                                };
                                                break;
                                              case "image-matching":
                                                newContent = {
                                                  labels: [
                                                    { id: `label-${Date.now()}`, text: "" },
                                                    { id: `label-${Date.now() + 1}`, text: "" },
                                                  ],
                                                  image_urls: [
                                                    { id: `img-${Date.now()}`, url: "" },
                                                    { id: `img-${Date.now() + 1}`, url: "" },
                                                  ],
                                                  correct_image_matches: [],
                                                  preview_urls: [
                                                    "/placeholder.svg?height=100&width=100",
                                                    "/placeholder.svg?height=100&width=100",
                                                  ],
                                                };
                                                break;
                                              case "fill-blanks":
                                                newContent = { answers: [], correct_answers: [] };
                                                break;
                                              default:
                                                newContent = { options: [] };
                                            }
                                            setNewQuestion({
                                              ...newQuestion,
                                              type: value,
                                              text:
                                                value === "fill-blanks" && !editingQuestionId
                                                  ? "<p>Example: The capital of France is [[Paris]].</p>"
                                                  : newQuestion.text,
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
                                                ).map((match) => ({
                                                  id: uuidv4(),
                                                  text: match[1] ? String(match[1]).trim() : "",
                                                })).filter((answer) => answer.text);

                                                setNewQuestion({
                                                  ...newQuestion,
                                                  text: content,
                                                  content: { 
                                                    answers: blanks,
                                                    correct_answers: blanks.map(answer => answer.id)
                                                  },
                                                });
                                              } else {
                                                setNewQuestion({
                                                  ...newQuestion,
                                                  text: content,
                                                });
                                              }
                                            }}
                                            showMathToolbar={mathToolbarStates.questionText}
                                            setShowMathToolbar={() => toggleMathToolbar("questionText")}
                                          />
                                        </div>
                                        {newQuestion.type === "fill-blanks" && (
                                          <p className="text-xs text-muted-foreground">
                                            Use double square brackets to create blanks: [[answer]]. For example:
                                            "The capital of France is [[Paris]]."
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
                                                    showMathToolbar={mathToolbarStates[`option-${option.id}`]}
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
                                                          newQuestion.type === "single-choice" && checked
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
                                            Create pairs of items and matches that students will need to connect correctly.
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
                                              <span className="mx-2">↔</span>
                                              <Input
                                                placeholder={`Match ${index + 1}`}
                                                value={
                                                  (newQuestion.content as any).matches.find(
                                                    (match: any) =>
                                                      match.id ===
                                                      (newQuestion.content as any).correct_matches.find(
                                                        (cm: any) => cm.item_id === item.id
                                                      )?.match_id
                                                  )?.text || ""
                                                }
                                                onChange={(e) => {
                                                  const content = newQuestion.content as any;
                                                  const updatedMatches = [...content.matches];
                                                  const matchIndex = updatedMatches.findIndex(
                                                    (match: any) =>
                                                      match.id ===
                                                      content.correct_matches.find(
                                                        (cm: any) => cm.item_id === item.id
                                                      )?.match_id
                                                  );

                                                  if (matchIndex >= 0) {
                                                    updatedMatches[matchIndex].text = e.target.value;
                                                  } else {
                                                    const newMatch = {
                                                      id: uuidv4(),
                                                      text: e.target.value,
                                                    };
                                                    updatedMatches.push(newMatch);
                                                    const updatedCorrectMatches = [
                                                      ...content.correct_matches,
                                                    ];
                                                    updatedCorrectMatches.push({
                                                      item_id: item.id,
                                                      match_id: newMatch.id,
                                                    });
                                                    setNewQuestion({
                                                      ...newQuestion,
                                                      content: {
                                                        ...content,
                                                        matches: updatedMatches,
                                                        correct_matches: updatedCorrectMatches,
                                                      },
                                                    });
                                                    return;
                                                  }

                                                  setNewQuestion({
                                                    ...newQuestion,
                                                    content: {
                                                      ...content,
                                                      matches: updatedMatches,
                                                    },
                                                  });
                                                }}
                                              />
                                              {(newQuestion.content as any).items.length > 2 && (
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  onClick={() => {
                                                    const updatedItems = [
                                                      ...(newQuestion.content as any).items,
                                                    ];
                                                    const updatedMatches = [
                                                      ...(newQuestion.content as any).matches,
                                                    ];
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
                                              const newItemId = `item-${Date.now()}`;
                                              const newMatchId = `match-${Date.now()}`;
                                              const updatedItems = [
                                                ...(newQuestion.content as any).items,
                                                { id: newItemId, text: "" },
                                              ];
                                              const updatedMatches = [
                                                ...(newQuestion.content as any).matches,
                                                { id: newMatchId, text: "" },
                                              ];
                                              setNewQuestion({
                                                ...newQuestion,
                                                content: {
                                                  ...(newQuestion.content as any),
                                                  items: updatedItems,
                                                  matches: updatedMatches,
                                                },
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
                                            const content = newQuestion.content as any;
                                            const labels = content.labels || [];
                                            const image_urls = content.image_urls || [];
                                            const preview_urls = content.preview_urls || [];
                                            return labels.map((label: any, index: number) => (
                                              <div key={label.id} className="flex items-center gap-3">
                                                <div className="w-24 h-24 border border-muted rounded flex items-center justify-center relative bg-muted/10">
                                                  <img
                                                    src={
                                                      preview_urls[index] ||
                                                      (image_urls[index]
                                                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${image_urls[index].url}`
                                                        : "/placeholder.svg")
                                                    }
                                                    alt={`Image ${index + 1}`}
                                                    className="max-w-full max-h-full object-contain p-1"
                                                  />
                                                  <div className="absolute bottom-1 right-1">
                                                    <FileUploadArea
                                                      onFileSelect={(file: File, previewUrl: string) => {
                                                        const updatedImageFiles = [
                                                          ...(content.image_files || []),
                                                        ];
                                                        const updatedPreviewUrls = [
                                                          ...(content.preview_urls || []),
                                                        ];
                                                        const updatedImageUrls = [
                                                          ...(content.image_urls || []),
                                                        ];
                                                        updatedImageFiles[index] = file;
                                                        updatedPreviewUrls[index] = previewUrl;
                                                        if (!updatedImageUrls[index]) {
                                                          updatedImageUrls[index] = {
                                                            id: `img-${Date.now()}`,
                                                            url: "",
                                                          };
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
                                                    const updatedLabels = [...labels];
                                                    updatedLabels[index].text = e.target.value;
                                                    setNewQuestion({
                                                      ...newQuestion,
                                                      content: { ...content, labels: updatedLabels },
                                                    });
                                                  }}
                                                />
                                                {/* <Select
                                                  value={
                                                    (content.correct_image_matches || []).find(
                                                      (cm: any) => cm.label_id === label.id
                                                    )?.url_id || ""
                                                  }
                                                  onValueChange={(value) => {
                                                    const updatedCorrectMatches = [
                                                      ...(content.correct_image_matches || []),
                                                    ];
                                                    const existingIndex = updatedCorrectMatches.findIndex(
                                                      (cm: any) => cm.label_id === label.id
                                                    );
                                                    if (existingIndex >= 0) {
                                                      updatedCorrectMatches[existingIndex] = {
                                                        url_id: value,
                                                        label_id: label.id,
                                                      };
                                                    } else {
                                                      updatedCorrectMatches.push({
                                                        url_id: value,
                                                        label_id: label.id,
                                                      });
                                                    }
                                                    setNewQuestion({
                                                      ...newQuestion,
                                                      content: {
                                                        ...content,
                                                        correct_image_matches: updatedCorrectMatches,
                                                      },
                                                    });
                                                  }}
                                                >
                                                  <SelectTrigger>
                                                    <SelectValue
                                                      placeholder={`Select image for label ${index + 1}`}
                                                    />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {(content.image_urls || []).map(
                                                      (img: any, imgIndex: number) => (
                                                        <SelectItem key={img.id} value={img.id}>
                                                          {`Image ${imgIndex + 1}`}
                                                        </SelectItem>
                                                      )
                                                    )}
                                                  </SelectContent>
                                                </Select> */}
                                                {labels.length > 2 && (
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                      const updatedLabels = [...labels];
                                                      const updatedImageUrls = [
                                                        ...(content.image_urls || []),
                                                      ];
                                                      const updatedImageFiles = [
                                                        ...(content.image_files || []),
                                                      ];
                                                      const updatedPreviewUrls = [
                                                        ...(content.preview_urls || []),
                                                      ];
                                                      const updatedCorrectMatches = [
                                                        ...(content.correct_image_matches || []),
                                                      ].filter((cm: any) => cm.label_id !== label.id);
                                                      updatedLabels.splice(index, 1);
                                                      if (updatedImageUrls[index]) {
                                                        updatedImageUrls.splice(index, 1);
                                                      }
                                                      if (updatedImageFiles[index]) {
                                                        updatedImageFiles.splice(index, 1);
                                                      }
                                                      if (updatedPreviewUrls[index]) {
                                                        updatedPreviewUrls.splice(index, 1);
                                                      }
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
                                              const newLabelId = `label-${Date.now()}`;
                                              const newImageId = `img-${Date.now()}`;
                                              const updatedLabels = [
                                                ...(content.labels || []),
                                                { id: newLabelId, text: "" },
                                              ];
                                              const updatedImageUrls = [
                                                ...(content.image_urls || []),
                                                { id: newImageId, url: "" },
                                              ];
                                              const updatedPreviewUrls = [
                                                ...(content.preview_urls || []),
                                                "/placeholder.svg?height=100&width=100",
                                              ];
                                              setNewQuestion({
                                                ...newQuestion,
                                                content: {
                                                  ...content,
                                                  labels: updatedLabels,
                                                  image_urls: updatedImageUrls,
                                                  preview_urls: updatedPreviewUrls,
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
                                            <Label className="block mb-2">Question Preview</Label>
                                            <p
                                              dangerouslySetInnerHTML={{
                                                __html: newQuestion.text.replace(
                                                  /\[\[(.*?)\]\]/g,
                                                  '<span class="bg-primary/20 px-2 py-1 rounded">______</span>'
                                                ),
                                              }}
                                            />
                                          </div>
                                          <div>
                                            <Label className="block mb-2">Correct Answers</Label>
                                            <div className="flex flex-wrap gap-2">
                                              {(
                                                newQuestion.content as { answers: { id: string; text: string }[] }
                                              ).answers.map((answer, index) => (
                                                <div
                                                  key={answer.id}
                                                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                                                >
                                                  {answer.text || "(Empty)"}
                                                </div>
                                              ))}
                                            </div>
                                            {(
                                              newQuestion.content as { answers: { id: string; text: string }[] }
                                            ).answers.length === 0 && (
                                                <p className="text-sm text-amber-600 mt-2">
                                                  No valid blanks detected. Use [[answer]] format to create blanks, e.g.,
                                                  [[Paris]].
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
                                          onClick={() => {
                                            setEditingQuestionId(null);
                                          }}
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
                                              !(newQuestion.content as any).items.length) ||
                                            (newQuestion.type === "image-matching" &&
                                              !(newQuestion.content as any).labels.length) ||
                                            (newQuestion.type === "fill-blanks" &&
                                              !(newQuestion.content as { answers: { id: string; text: string }[] })
                                                .answers.some((answer) => answer.text && answer.text.trim()))
                                          }
                                        >
                                          {editingQuestionId ? "Update Question" : "Add Question"}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </>
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

              {!editingQuestionId && (
                <div className="mt-4 flex justify-center">
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => {
                      setEditingQuestionId(null);
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

                      const tempId = `temp-${Date.now()}`;
                      const newTempQuestion = {
                        id: tempId,
                        type: "single-choice",
                        text: "<p>New question</p>",
                        content: {
                          options: [
                            { id: "1", text: "", is_correct: false },
                            { id: "2", text: "", is_correct: false },
                          ],
                        },
                        explanation: "",
                        points: 1,
                        question_order: questions.length + 1,
                      };

                      setQuestions([...questions, newTempQuestion]);
                      setEditingQuestionId(tempId);
                    }}
                  >
                    <PlusCircle size={16} />
                    Add New Question
                  </Button>
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
                          Number.parseInt(e.target.value, 10) || 30
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
                          Number.parseInt(e.target.value, 10) || 70
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
                          Number.parseInt(e.target.value, 10) || 1
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
                      <Label htmlFor="randomizeQuestions">Randomize Questions</Label>
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
                      <Label htmlFor="showCorrectAnswers">Show Correct Answers</Label>
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
                      <Label htmlFor="showExplanations">Show Explanations</Label>
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
              This action cannot be undone. This will permanently delete the question.
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