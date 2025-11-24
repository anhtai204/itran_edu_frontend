"use client"

import type React from "react"

import { useState } from "react"
import { ThumbsUp, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { sendRequest } from "@/utils/api"

interface ReplyType {
  id: number
  author: string
  avatar: string
  date: string
  content: string
  likes: number
}

interface CommentProps {
  comment: {
    id: string
    author: string
    avatar: string
    date: string
    content: string
    likes: number
    replies: ReplyType[]
  };
  onReply: (parentId: string, content: string) => void;
}

export function BlogComment({ comment, onReply }: CommentProps) {
  const session = useSession();

  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [hasLiked, setHasLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.likes)

  const handleLike = () => {
    if (hasLiked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setHasLiked(!hasLiked)
  }

  // const handleReplySubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // In a real app, you would submit the reply to your backend
  //   console.log("Reply submitted:", replyText)
  //   setReplyText("")
  //   setIsReplying(false)
  // }

  // console.log('>>>comments in blogcomment: ', comment);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(comment.id, replyText); // Gửi parentId và nội dung reply lên cha
      setReplyText("");
      setIsReplying(false);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.avatar} alt={comment.author} />
          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium text-gray-900 dark:text-white">{comment.author}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-3">{comment.content}</p>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`p-0 h-auto text-sm ${hasLiked ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"}`}
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
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => setIsReplying(false)}>
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
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.avatar} alt={reply.author} />
                    <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-gray-900 dark:text-white">{reply.author}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{reply.date}</div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto text-xs text-gray-500 dark:text-gray-400 mt-1"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span>{reply.likes}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}