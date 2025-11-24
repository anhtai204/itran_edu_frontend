"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { NewsFilter } from "./news-filter"
import Image from "next/image"
import { handleDeleteNews, RawNews } from "@/utils/action"
import { sendRequest } from "@/utils/api"
import { toast } from "sonner"

interface IBackendRes<T> {
  statusCode: number
  message: string
  data: T
}

interface IProps {
  initialNews: RawNews[]
  initialMeta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
}

// Hàm debounce để tránh gọi API quá nhiều lần khi người dùng đang nhập
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }

    return new Promise((resolve) => {
      timeout = setTimeout(() => {
        resolve(func(...args))
      }, waitFor)
    })
  }
}

const AllNewsManage = (props: IProps) => {
  const { initialNews, initialMeta } = props
  const [meta, setMeta] = useState(initialMeta)

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState(initialNews)
  const [filteredNews, setFilteredNews] = useState(initialNews)
  const [searchTerm, setSearchTerm] = useState("")

  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newsToDelete, setNewsToDelete] = useState<string | null>(null)

  const current = Number(searchParams.get("current")) || 1
  const pageSize = Number(searchParams.get("pageSize")) || initialMeta.pageSize

  // Tạo hàm debounced để cập nhật URL và gọi API
  const debouncedSearch = debounce(async (term: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("current", "1") // Reset về trang 1 khi tìm kiếm

    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }

    replace(`${pathname}?${params.toString()}`)
  }, 500) // Đợi 500ms sau khi người dùng ngừng gõ

  // Theo dõi sự thay đổi của searchTerm và gọi hàm debounced
  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm])

  // Theo dõi sự thay đổi của URL params và gọi API
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news/custom`,
          method: "GET",
          queryParams: {
            current,
            pageSize,
            status: statusFilter !== "all" ? statusFilter : undefined,
          },
        })
        if (res.statusCode === 200) {
          setNews(res.data.results || [])
          setFilteredNews(res.data.results || [])
          setMeta(res.data.meta)
        }
      } catch (error) {
        console.error("Error with news data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [current, pageSize, searchParams, statusFilter])

  // Handle search filtering
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNews(news)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = news.filter(
        (news: any) =>
          news.title?.toLowerCase().includes(term) ||
          news.author?.toLowerCase().includes(term) ||
          news.slug?.toLowerCase().includes(term),
      )
      setFilteredNews(filtered)
    }
  }, [searchTerm, news])

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("current", page.toString())
    replace(`${pathname}?${params.toString()}`)
  }

  const handleDeleteClick = (newsId: string) => {
    setNewsToDelete(newsId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!newsToDelete) return

    try {
      const res = await handleDeleteNews(newsToDelete)
      if (res?.data) {
        console.log(">>>res: ", res)
        toast.success("News deleted successfully")

        // Cập nhật danh sách news sau khi xóa
        setNews(news.filter((a: any) => a.id !== newsToDelete))
      } else {
        console.log(">>>res: ", res)
        toast.error("Error while deleting news")
      }
      setDeleteDialogOpen(false)
      setNewsToDelete(null)
    } catch (error) {
      console.error("Error deleting news:", error)
    }
  }

  const getStatusBadge = (status: string, scheduledAt: string | null) => {
    if (status === "published") {
      return <Badge className="bg-green-500">Published</Badge>
    } else if (status === "draft") {
      return (
        <Badge variant="outline" className="text-gray-500">
          Draft
        </Badge>
      )
    } else if (status === "scheduled" || scheduledAt) {
      return <Badge className="bg-blue-500">Scheduled</Badge>
    } else if (status === "pending") {
      return <Badge className="bg-yellow-500">Pending</Badge>
    } else {
      return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string, scheduledAt: string | null) => {
    if (status === "published") {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    } else if (status === "draft") {
      return <AlertCircle className="h-4 w-4 text-gray-500" />
    } else if (status === "scheduled" || scheduledAt) {
      return <Calendar className="h-4 w-4 text-blue-500" />
    } else if (status === "pending") {
      return <Clock className="h-4 w-4 text-yellow-500" />
    }
    return null
  }

  const handleSearch = () => {
    // No need to call fetchPosts or update URL params
    // The useEffect hook will handle filtering based on searchTerm
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All News</h1>
        <Button onClick={() => router.push("/dashboard/news")}>
          <Plus className="mr-2 h-4 w-4" /> Create News
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>News</CardTitle>
          <CardDescription>Manage your news, articles, and other content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex flex-1 items-center space-x-2">
                <Input
                  placeholder="Search by title, author, or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                {/* Không cần nút Search nữa vì đã tự động tìm kiếm khi nhập */}
              </div>
              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(true)}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        Loading news...
                      </TableCell>
                    </TableRow>
                  ) : filteredNews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        No news found. Create your first news!
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNews.map((news: any) => (
                      <TableRow key={news.id || `news-${Math.random()}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            {news.feature_image && (
                              <div
                                key={`extra-x-${news.slug}`}
                                className="h-10 w-10 rounded overflow-hidden flex-shrink-0"
                              >
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${news.feature_image}`}
                                  alt={news.title}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="truncate max-w-[250px]">{news.title}</span>
                              <span className="text-xs text-muted-foreground truncate max-w-[250px]">/{news.slug}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(news.news_status, news.scheduled_at)}
                            {getStatusBadge(news.news_status, news.scheduled_at)}
                          </div>
                        </TableCell>
                        <TableCell>{news.author || "Unknown"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {news.categories?.slice(0, 2).map((category: { id: string; name: string }, index: number) => (
                              <Badge
                              key={`${news.id}-${category.id}-${index}`}
                              variant="outline"
                              className="text-xs"
                              >
                              {category.name}
                              </Badge>
                            ))}
                            {news.categories && news.categories.length > 2 && (
                              <Badge key={`extra-${news.slug}`} variant="outline" className="text-xs">
                              +{news.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {news.scheduled_at ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Scheduled for</span>
                              <span>{format(new Date(news.scheduled_at), "dd-MM-yyyy")}</span>
                            </div>
                          ) : news.news_status === "published" ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Published on</span>
                              <span>{format(new Date(news.create_at), "MMM d, yyyy")}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Last updated</span>
                              <span>{format(new Date(news.create_at), "MMM d, yyyy")}</span>
                            </div>
                          )}
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
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/article/${news.slug}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/news/edit/${news.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(news.id)}>
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

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(meta.current - 1) * meta.pageSize + 1} to {Math.min(meta.current * meta.pageSize, meta.total)}{" "}
                of {meta.total} entries
              </p>
              <Pagination currentPage={meta.current} totalPages={meta.pages} onPageChange={handlePageChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filter Dialog */}
      <NewsFilter
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApplyFilters={() => {
          // Refresh posts when filters are applied
          const params = new URLSearchParams(searchParams)
          params.set("current", "1") // Reset to first page
          replace(`${pathname}?${params.toString()}`)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this news?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the news and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AllNewsManage;

