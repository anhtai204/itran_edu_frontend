"use client"
import { sendRequest } from "@/utils/api";
import { Plus, PlusCircle, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuizFilters from "./quiz-filters";
import QuizTable from "./quiz-table";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface IBackendRes<T> {
  statusCode: number;
  message: string;
  data: T;
}

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
  questions: number;
  show_correct_answers: boolean;
  show_explanations: boolean;
  status: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface IProps {
  initialQuizzes: any[];
  initialMeta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

// Tạo hàm debounce để tránh gọi API quá nhiều lần khi người dùng đang nhập
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    return new Promise((resolve) => {
      timeout = setTimeout(() => {
        resolve(func(...args));
      }, waitFor);
    });
  };
}

const AllQuizManage = (props: IProps) => {
  const { initialQuizzes, initialMeta } = props;
  const [meta, setMeta] = useState(initialMeta);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<QuizRaw[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    difficulty: "",
  });

  const router = useRouter();

  const current = Number(searchParams.get("current")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || initialMeta.pageSize;

  useEffect(() => {
    if (initialQuizzes && initialQuizzes.length > 0) {
      setQuizzes(initialQuizzes);
    }
  }, [initialQuizzes]);

  // Tạo hàm debounced để cập nhật URL và gọi API
  const debouncedSearch = debounce(async (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("current", "1"); // Reset về trang 1 khi tìm kiếm

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 500); // Đợi 500ms sau khi người dùng ngừng gõ

  // Theo dõi sự thay đổi của searchTerm và gọi hàm debounced
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  // Theo dõi sự thay đổi của URL params và gọi API
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/paginate`,
          method: "GET",
          queryParams: {
            current,
            pageSize,
            search: searchTerm,
            status: filters.status,
            category: filters.category,
            difficulty: filters.difficulty,
          },
        });
        if (res.statusCode === 200) {
          
          const formattedQuizzes = res.data.results.map((quiz: any) => ({
            id: quiz.id || quiz._id,
            title: quiz.title || "",
            category: typeof quiz.category === 'string' ? quiz.category : quiz.category?.name || "",
            difficulty: typeof quiz.difficulty === 'string' ? quiz.difficulty : quiz.difficulty?.name || "Beginner",
            questions: quiz.questions || 0,
            time_limit: quiz.time_limit || 0,
            status: quiz.status || "draft",
            created_at: quiz.created_at || new Date().toISOString(),
            max_attempts: quiz.max_attempts || 0,
            passing_score: quiz.passing_score || 0,
            author: quiz.author || "",
            lesson: quiz.lesson || "",
            randomize_questions: quiz.randomize_questions || false,
            show_results: quiz.show_results || false,
            show_correct_answers: quiz.show_correct_answers || false,
            show_explanations: quiz.show_explanations || false,
            updated_at: quiz.updated_at || new Date().toISOString(),
          }));
          setQuizzes(formattedQuizzes);
          
          // Đảm bảo meta.current và meta.pages là số
          const updatedMeta = {
            ...res.data.meta,
            current: Number(res.data.meta.current),
            pages: Number(res.data.meta.pages)
          };
          setMeta(updatedMeta);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [current, pageSize, searchParams, filters]);


  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("current", page.toString());
    const newUrl = `${pathname}?${params.toString()}`;
    
    replace(newUrl);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6 p-6">
      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <Link href="/dashboard/quiz">
          <Button className="flex items-center gap-2">
            <PlusCircle size={18} />
            Create Quiz
          </Button>
        </Link>
      </div> */}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <Button onClick={() => router.push("/dashboard/quiz")}>
          <Plus className="mr-2 h-4 w-4" /> Create Quiz
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quizzes</CardTitle>
          <CardDescription>Manage your quizzes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-3">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-1/4 items-center space-x-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-xl text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  className="pl-4"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              {/* <div className="flex flex-1/2 items-center space-x-2">
                <QuizFilters filters={filters} setFilters={setFilters} />
              </div> */}
            </div>
          </div>

          <QuizTable
            quizzes={quizzes}
            currentPage={meta.current}
            totalPages={meta.pages}
            onPageChange={handlePageChange}
          />

          {/* {meta.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
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
          )} */}


          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(meta.current - 1) * meta.pageSize + 1} to {Math.min(meta.current * meta.pageSize, meta.total)}{" "}
              of {meta.total} entries
            </p>
            <Pagination 
              currentPage={meta.current} 
              totalPages={meta.pages} 
              onPageChange={handlePageChange} 
            />
          </div>
        </CardContent>
      </Card>



    </div>
  );
};

export default AllQuizManage;