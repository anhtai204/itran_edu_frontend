"use client";

import type React from "react";

import { useState } from "react";
import { ThumbsUp, Reply, Edit, Trash2, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
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
import { sendRequest } from "@/utils/api";

interface ReplyType {
  id: string;
  author: string;
  avatar?: string;
  date: string;
  content: string;
  likes: number;
  status?: string;
  user_id?: string;
}

interface CommentProps {
  comment: {
    id: string;
    author: string;
    avatar?: string;
    date: string;
    content: string;
    likes: number;
    replies: ReplyType[];
    status?: string;
    user_id?: string;
  };
  currentUserId?: string;
  onReply: (parentId: string, content: string) => void;
  onEdit?: (id: string, content: string, isReply: boolean) => Promise<void>;
  onDelete?: (id: string, isReply: boolean) => Promise<void>;
  onLike?: (id: string, isReply: boolean) => Promise<void>;
}

export function BlogComment({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onLike,
}: CommentProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingReplyText, setEditingReplyText] = useState("");

  // Check if the current user is the author of the comment
  const isAuthor = userId === comment.user_id;
  const isPending = comment.status === "pending";

  // Determine if this comment should be visible
  // Show if: 1) It's approved, or 2) It's pending but the current user is the author
  const isVisible = comment.status !== "pending" || isAuthor;

  // If the comment shouldn't be visible, don't render anything
  if (!isVisible) {
    return null;
  }

  // Handle like for main comment
  // const handleLike = async () => {
  //   if (onLike) {
  //     try {
  //       await onLike(comment.id, false)
  //       if (hasLiked) {
  //         setLikeCount(likeCount - 1)
  //       } else {
  //         setLikeCount(likeCount + 1)
  //       }
  //       setHasLiked(!hasLiked)
  //     } catch (error) {
  //       console.error("Error liking comment:", error)
  //       toast.error("Failed to like comment")
  //     }
  //   } else {
  //     // Fallback if onLike is not provided
  //     if (hasLiked) {
  //       setLikeCount(likeCount - 1)
  //     } else {
  //       setLikeCount(likeCount + 1)
  //     }
  //     setHasLiked(!hasLiked)
  //   }
  // }

  const handleLike = async () => {
    try {
      if (onLike) {
        try {
          await onLike(comment.id, false);
          if (hasLiked) {
            await sendRequest<IBackendRes<any>>({
              url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments-likes/unlike/${userId}/${comment.id}`,
              method: "DELETE",
            });
            setLikeCount(likeCount - 1);
            setHasLiked(false);
          } else {
            const res = await sendRequest<IBackendRes<any>>({
              url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments-likes`,
              method: "POST",
              body: {
                user_id: userId,
                post_comment_id: comment.id,
              },
            });
            if (res.statusCode === 400) {
              toast("You have already like this comment");
            } else {
              setLikeCount(likeCount + 1);
              setHasLiked(true);
            }
          }
        } catch (error) {
          console.error("Error liking comment:", error);
          toast.error("Failed to like comment");
        }
      } else {
        // Nếu chưa like, gửi request để like (thêm lượt like)
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments-likes`,
          method: "POST",
          body: {
            user_id: userId,
            post_comment_id: comment.id,
          },
        });
        if (res.statusCode === 400) {
          toast("You have already like this comment");
        } else {
          setLikeCount(likeCount + 1);
          setHasLiked(true);
        }
      }
    } catch (error) {
      console.error("Handle like error:", error);
    }
  };

  // Handle like for reply
  const handleReplyLike = async (replyId: string, replyIndex: number) => {
    if (onLike) {
      try {
        await onLike(replyId, true);
        const updatedReplies = [...comment.replies];
        updatedReplies[replyIndex].likes = updatedReplies[replyIndex].likes + 1;
        // Note: We can't update the comment.replies directly as it's a prop
        // In a real app, you would refetch the comments or use a state management solution
      } catch (error) {
        console.error("Error liking reply:", error);
        toast.error("Failed to like reply");
      }
    }
  };

  // Handle reply submission
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText("");
      setIsReplying(false);
    }
  };

  // Handle edit submission for main comment
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim() && onEdit) {
      try {
        await onEdit(comment.id, editText, false);
        setIsEditing(false);
        toast.success("Comment updated successfully");
      } catch (error) {
        console.error("Error updating comment:", error);
        toast.error("Failed to update comment");
      }
    }
  };

  // Handle edit submission for reply
  const handleReplyEditSubmit = async (e: React.FormEvent, replyId: string) => {
    e.preventDefault();
    if (editingReplyText.trim() && onEdit) {
      try {
        await onEdit(replyId, editingReplyText, true);
        setEditingReplyId(null);
        toast.success("Reply updated successfully");
      } catch (error) {
        console.error("Error updating reply:", error);
        toast.error("Failed to update reply");
      }
    }
  };

  // Handle delete for main comment
  const handleDelete = async () => {
    if (onDelete) {
      try {
        await onDelete(comment.id, false);
        toast.success("Comment deleted successfully");
      } catch (error) {
        console.error("Error deleting comment:", error);
        toast.error("Failed to delete comment");
      }
    }
    setDeleteDialogOpen(false);
  };

  // Handle delete for reply
  const handleReplyDelete = async (replyId: string) => {
    if (onDelete) {
      try {
        await onDelete(replyId, true);
        setSelectedReplyId(null);
        toast.success("Reply deleted successfully");
      } catch (error) {
        console.error("Error deleting reply:", error);
        toast.error("Failed to delete reply");
      }
    }
  };

  // Start editing a reply
  const startEditingReply = (reply: ReplyType) => {
    setEditingReplyId(reply.id);
    setEditingReplyText(reply.content);
  };

  return (
    <div
      className={`border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0 ${
        isPending ? "opacity-50" : ""
      }`}
    >
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.avatar} alt={comment.author} />
          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium text-gray-900 dark:text-white flex items-center">
              {comment.author}
              {isPending && (
                <span className="ml-2 text-xs text-yellow-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending approval
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {comment.date}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mt-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="mb-2 min-h-[80px] text-sm rounded-xl dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {comment.content}
            </p>
          )}

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`p-0 h-auto text-sm ${
                hasLiked
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto text-sm text-gray-500 dark:text-gray-400"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="h-4 w-4 mr-1" />
              <span>Reply</span>
            </Button>

            {isAuthor && !isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-sm text-gray-500 dark:text-gray-400"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  <span>Edit</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-sm text-red-500 dark:text-red-400"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span>Delete</span>
                </Button>
              </>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-4">
              <Textarea
                placeholder="Write your reply..."
                className="mb-2 min-h-[80px] text-sm rounded-xl dark:bg-gray-700 dark:border-gray-600"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600"
                >
                  Post Reply
                </Button>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
              {comment.replies.map((reply, index) => {
                const replyIsPending = reply.status === "pending";
                const isReplyAuthor = userId === reply.user_id;

                // Only show reply if it's approved or if the current user is the author
                if (replyIsPending && !isReplyAuthor) {
                  return null;
                }

                return (
                  <div
                    key={reply.id}
                    className={`flex gap-3 ${
                      replyIsPending ? "opacity-50" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={reply.avatar} alt={reply.author} />
                      <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                          {reply.author}
                          {replyIsPending && (
                            <span className="ml-2 text-xs text-yellow-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending approval
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {reply.date}
                        </div>
                      </div>

                      {editingReplyId === reply.id ? (
                        <form
                          onSubmit={(e) => handleReplyEditSubmit(e, reply.id)}
                          className="mt-2"
                        >
                          <Textarea
                            value={editingReplyText}
                            onChange={(e) =>
                              setEditingReplyText(e.target.value)
                            }
                            className="mb-2 min-h-[80px] text-sm rounded-xl dark:bg-gray-700 dark:border-gray-600"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                              onClick={() => setEditingReplyId(null)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              size="sm"
                              className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {reply.content}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto text-xs text-gray-500 dark:text-gray-400"
                          onClick={() => handleReplyLike(reply.id, index)}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>{reply.likes}</span>
                        </Button>

                        {isReplyAuthor && editingReplyId !== reply.id && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto text-xs text-gray-500 dark:text-gray-400"
                              onClick={() => startEditingReply(reply)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              <span>Edit</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto text-xs text-red-500 dark:text-red-400"
                              onClick={() => setSelectedReplyId(reply.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              <span>Delete</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Comment Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Reply Dialog */}
      <AlertDialog
        open={selectedReplyId !== null}
        onOpenChange={(open) => !open && setSelectedReplyId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reply</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reply? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedReplyId && handleReplyDelete(selectedReplyId)
              }
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
