"use client"

import { useState, useEffect } from "react"
import { Check, X, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { format } from "date-fns"
import { sendRequest } from "@/utils/api"
import { Pagination } from "../ui/pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

// Define the comment interface
interface Comment {
  id: string
  author: string
  content: string
  user_id?: string
  post_id?: string
  parent_id?: string | null
  created_at?: string
  status: string
}

interface IProps {
  initialComments: Comment[]
  initialMeta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
}

interface IBackendRes<T> {
  statusCode: number
  message: string
  data: T
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
}

export default function PendingCommentsPage(props: IProps) {
  const { initialComments, initialMeta } = props
  const [meta, setMeta] = useState(initialMeta)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredComments, setFilteredComments] = useState<Comment[]>(initialComments)
  const [commentReplies, setCommentReplies] = useState<Comment[]>([])
  const [loadingReplies, setLoadingReplies] = useState(false)

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const current = Number(searchParams.get("current")) || 1
  const pageSize = Number(searchParams.get("pageSize")) || initialMeta.pageSize

  // State for dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  // Fetch pending comments
  const fetchPendingComments = async () => {
    setLoading(true)
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments/pending`,
        method: "GET",
        queryParams: {
          current,
          pageSize,
        },
      })
      if (res.statusCode === 200) {
        setComments(res.data.results)
        setMeta(res.data.meta)
        setFilteredComments(res.data.results)
      } else {
        console.log("Failed to fetch comments")
        setComments([])
        setMeta({ current: 1, pageSize: 6, pages: 0, total: 0 })
        setFilteredComments([])
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast.error("Failed to load pending comments")
    } finally {
      setLoading(false)
    }
  }

  // Fetch replies for a comment
  const fetchReplies = async (commentId: string) => {
    setLoadingReplies(true)
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments/replies/${commentId}`,
        method: "GET",
      })

      if (res && Array.isArray(res)) {
        setCommentReplies(res)
      } else {
        setCommentReplies([])
      }
    } catch (error) {
      console.error("Error fetching replies:", error)
      setCommentReplies([])
    } finally {
      setLoadingReplies(false)
    }
  }

  // Fetch comments when pagination changes
  useEffect(() => {
    fetchPendingComments()
  }, [current, pageSize])

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredComments(comments)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = comments.filter(
        (comment) =>
          comment.content.toLowerCase().includes(term) ||
          (comment.author && comment.author.toLowerCase().includes(term)),
      )
      setFilteredComments(filtered)
    }
  }, [searchTerm, comments])

  // Handle view comment
  const handleViewComment = async (comment: Comment) => {
    setSelectedComment(comment)
    setViewDialogOpen(true)

    // Fetch replies if this is a parent comment
    if (!comment.parent_id) {
      await fetchReplies(comment.id)
    } else {
      setCommentReplies([])
    }
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("current", page.toString())
    replace(`${pathname}?${params.toString()}`)
  }

  // Handle approve comment
  const handleApproveComment = async (comment: Comment) => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments/${comment.id}`,
        method: "PATCH",
        body: {
          status: "approved",
        },
      })

      if (res) {
        // Remove the comment from the list
        setComments(comments.filter((c) => c.id !== comment.id))
        setFilteredComments(filteredComments.filter((c) => c.id !== comment.id))

        // If viewing replies, remove the approved reply from the replies list
        if (viewDialogOpen && selectedComment && !comment.parent_id) {
          setCommentReplies(commentReplies.filter((r) => r.id !== comment.id))
        }

        // Update meta information
        setMeta((prevMeta) => ({
          ...prevMeta,
          total: prevMeta.total - 1,
          pages: Math.ceil((prevMeta.total - 1) / prevMeta.pageSize),
        }))

        toast.success("Comment approved successfully")

        // If this was the last comment on the page, go to previous page
        if (filteredComments.length === 1 && meta.current > 1) {
          handlePageChange(meta.current - 1)
        } else if (filteredComments.length === 1) {
          // If we're on the first page and it's the last comment, refresh
          fetchPendingComments()
        }
      } else {
        throw new Error("Failed to approve comment")
      }
    } catch (error) {
      console.error("Error approving comment:", error)
      toast.error("Failed to approve comment")
    }
  }

  // Handle reject comment
  const handleRejectComment = async (comment: Comment) => {
    try {
      // If this is a parent comment, add deleteReplies=true to delete all replies
      const deleteUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments/${comment.id}${
        !comment.parent_id ? "?deleteReplies=true" : ""
      }`

      const res = await sendRequest<any>({
        url: deleteUrl,
        method: "DELETE",
      })

      if (res) {
        // Remove the comment from the list
        setComments(comments.filter((c) => c.id !== comment.id))
        setFilteredComments(filteredComments.filter((c) => c.id !== comment.id))

        // If viewing replies, remove the rejected reply from the replies list
        if (viewDialogOpen && selectedComment && !comment.parent_id) {
          setCommentReplies(commentReplies.filter((r) => r.id !== comment.id))
        }

        // Update meta information
        setMeta((prevMeta) => ({
          ...prevMeta,
          total: prevMeta.total - 1,
          pages: Math.ceil((prevMeta.total - 1) / prevMeta.pageSize),
        }))

        toast.success("Comment rejected successfully")

        // If this was the last comment on the page, go to previous page
        if (filteredComments.length === 1 && meta.current > 1) {
          handlePageChange(meta.current - 1)
        } else if (filteredComments.length === 1) {
          // If we're on the first page and it's the last comment, refresh
          fetchPendingComments()
        }
      } else {
        throw new Error("Failed to reject comment")
      }
    } catch (error) {
      console.error("Error rejecting comment:", error)
      toast.error("Failed to reject comment")
    }
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date"
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a")
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pending Comments</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comments Awaiting Approval</CardTitle>
          <CardDescription>Review and moderate pending comments. Approve or reject user comments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex flex-1 items-center space-x-2">
                <Input
                  placeholder="Search comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Comment</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Post ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        Loading pending comments...
                      </TableCell>
                    </TableRow>
                  ) : filteredComments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        No pending comments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredComments.map((comment) => (
                      <TableRow key={comment.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {comment.parent_id && (
                              <div className="text-muted-foreground text-xs border-l-2 pl-2 ml-2">Reply</div>
                            )}
                            <div className="truncate max-w-[250px]">{comment.content}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`/placeholder.svg?height=40&width=40`}
                                alt={comment.author || "Anonymous"}
                              />
                              <AvatarFallback>{(comment.author || "A").charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{comment.author || "Anonymous"}</div>
                              <div className="text-xs text-muted-foreground">User ID: {comment.user_id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">{comment.post_id || "Unknown"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(comment.created_at).split(" at ")[0]}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at).split(" at ")[1]}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleApproveComment(comment)}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleRejectComment(comment)}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleViewComment(comment)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex mt-5 items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(meta.current - 1) * meta.pageSize + 1} to {Math.min(meta.current * meta.pageSize, meta.total)}{" "}
                of {meta.total} entries
              </p>
              <Pagination currentPage={meta.current} totalPages={meta.pages} onPageChange={handlePageChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Comment Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>View Pending Comment</DialogTitle>
          </DialogHeader>
          {selectedComment && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`/placeholder.svg?height=40&width=40`}
                    alt={selectedComment.author || "Anonymous"}
                  />
                  <AvatarFallback>{(selectedComment.author || "A").charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedComment.author || "Anonymous"}</div>
                  <div className="text-sm text-muted-foreground">User ID: {selectedComment.user_id}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Posted on {formatDate(selectedComment.created_at)}</div>
                <div className="text-sm">Post ID: {selectedComment.post_id || "Unknown"}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>
                  <Badge className="bg-yellow-500">Pending</Badge>
                </div>
                {selectedComment.parent_id && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Reply to comment ID:</span> {selectedComment.parent_id}
                  </div>
                )}
              </div>

              <div className="border rounded-md p-4 bg-muted/30">
                <p className="whitespace-pre-wrap">{selectedComment.content}</p>
              </div>

              {/* Display replies if this is a parent comment */}
              {!selectedComment.parent_id && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Replies</h3>
                  {loadingReplies ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">Loading replies...</div>
                  ) : commentReplies.length > 0 ? (
                    <div className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      {commentReplies.map((reply) => (
                        <div key={reply.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`/placeholder.svg?height=30&width=30`}
                                alt={reply.author || "Anonymous"}
                              />
                              <AvatarFallback>{(reply.author || "A").charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium text-sm">{reply.author || "Anonymous"}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(reply.created_at).split(" at ")[0]}
                            </div>
                            <Badge className="ml-auto bg-yellow-500 text-xs">
                              Pending
                            </Badge>
                          </div>
                          <div className="text-sm pl-8">{reply.content}</div>
                          <div className="flex justify-end gap-2 pl-8">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50 h-7 text-xs"
                              onClick={() => handleApproveComment(reply)}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50 h-7 text-xs"
                              onClick={() => handleRejectComment(reply)}
                            >
                              <X className="mr-1 h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">No replies found</div>
                  )}
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  className="text-green-600 border-green-600 mr-2"
                  onClick={() => {
                    handleApproveComment(selectedComment)
                    setViewDialogOpen(false)
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600"
                  onClick={() => {
                    handleRejectComment(selectedComment)
                    setViewDialogOpen(false)
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

