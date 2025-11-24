"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";
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
import { handleDeleteQuiz, handleDuplicateQuiz } from "@/utils/action";
import { toast } from "sonner";

interface QuizRaw {
  id: string;
  author: string;
  lesson: string;
  title: string;
  description: string;
  difficulty: string;
  time_limit: number;
  passing_score: number;
  max_attempts: number;
  randomize_questions: boolean;
  show_results: boolean;
  show_correct_answers: boolean;
  show_explanations: boolean;
  status: string;
  category: string;
  questions: number;
  created_at: string;
  updated_at: string;
}

interface QuizTableProps {
  quizzes: QuizRaw[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function QuizTable({
  quizzes,
  currentPage,
  totalPages,
  onPageChange,
}: QuizTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId);
    setDeleteDialogOpen(true);
  };

  const handleDuplicateClick = async (quizId: string) => {
    const res = await handleDuplicateQuiz(quizId);
    console.log('>>>res duplicate: ', res);

    if(res.statusCode === 200) {
      toast("Quiz duplicated successfully!");
    } else {
      toast("Failed to duplicate quiz.");
    }
  }


  const handleDeleteConfirm = async () => {
    // Here you would implement the actual delete functionality
    // console.log(`Deleting quiz with ID: ${quizToDelete}`);
    const res = await handleDeleteQuiz(quizToDelete!);
    console.log('>>>res delete: ', res);
    if(res.statusCode === 200) {
      toast("Quiz deleted successfully!");
      setDeleteDialogOpen(false);
    }
    else {
      toast("Failed to delete quiz.");
    }
    // setQuizToDelete(null);
    // After successful deletion, you might want to refresh the data
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh", // nếu bạn muốn GMT+7
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Difficulty</TableHead>
              <TableHead className="hidden md:table-cell">Questions</TableHead>
              <TableHead className="hidden md:table-cell">Time Limit</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="hidden lg:table-cell">Attempts</TableHead>
              {/* <TableHead className="hidden lg:table-cell">Avg. Score</TableHead> */}
              <TableHead className="hidden lg:table-cell">Passing Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-muted-foreground"
                >
                  No quizzes found.
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {quiz.category}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {quiz.difficulty}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {quiz.questions}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {quiz.time_limit} min
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant={
                        quiz.status === "published" ? "default" : "outline"
                      }
                    >
                      {quiz.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDate(quiz.created_at)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {quiz.max_attempts}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {/* {quiz.status === "published" ? `${quiz.passing_score}%` : "-"} */}
                    {quiz.passing_score} %
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/quiz/${quiz.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/quiz/edit/${quiz.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicateClick(quiz.id)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(quiz.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {/* {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )} */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz and all associated questions and student attempts.
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
