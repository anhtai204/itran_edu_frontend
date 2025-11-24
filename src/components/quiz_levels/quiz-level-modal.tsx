"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Pagination } from "@/components/ui/pagination";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { handleDeleteNewsTagAction, handleDeleteQuizLevelAction } from "@/utils/action";
import QuizLevelCreateModal from "./quiz-level-create-modal";
import QuizLevelUpdateModal from "./quiz-level-update-modal";

// Level data structure
interface Level {
  id: string;
  name: string;
  description: string;
}

interface IProps {
  levels: Level[];
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

const QuizLevelsModal = (props: IProps) => {
  const { levels, meta } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<any>(null);
  const [dataDetail, setDataDetail] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<string | null>(null);

  const handleDeleteLevel = async (levelId: string) => {
    const res = await handleDeleteQuizLevelAction(levelId);
    if (res?.data) {
      toast.success("Level deleted successfully");
    } else {
      toast.error("Error while deleting tag");
    }
    setDeleteConfirmOpen(false);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("current", page.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Quiz Levels
        </h2>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white dark:text-black"
        >
          Create Level
        </Button>
      </div>

      <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow className="border-b dark:border-gray-700">
              <TableHead className="text-gray-700 dark:text-gray-300">
                Tên
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">
                Mô tả
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {levels.map((level, index) => (
              <TableRow
                key={level.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {level.name}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {level.description}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setIsUpdateModalOpen(true);
                        setDataUpdate(level);
                      }}
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setLevelToDelete(level.id);
                        setDeleteConfirmOpen(true);
                      }}
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {(meta.current - 1) * meta.pageSize + 1} to{" "}
          {Math.min(meta.current * meta.pageSize, meta.total)} of {meta.total}{" "}
          entries
        </p>
        <Pagination
          currentPage={meta.current}
          totalPages={meta.pages}
          onPageChange={handlePageChange}
        />
      </div>

      <QuizLevelCreateModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <QuizLevelUpdateModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              Are you sure you want to delete this level?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
              This action cannot be undone. This will permanently delete the level
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => levelToDelete && handleDeleteLevel(levelToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuizLevelsModal;
