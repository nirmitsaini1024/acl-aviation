import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Reply, ChevronDown, ChevronUp } from "lucide-react"
import { CommentForm } from "./comment-form"
import { CommentRating } from "./comment-rating"


export function Comment({ comment, currentUser, onReply, onLike, onDislike, onRate }) {
  const [isReplying, setIsReplying] = useState(false)
  const [showAllReplies, setShowAllReplies] = useState(false)

  const isLiked = comment.likes.includes(currentUser.id)
  const isDisliked = comment.dislikes.includes(currentUser.id)

  const userRating = comment.ratings.find((r) => r.userId === currentUser.id)?.value || 0

  const averageRating =
    comment.ratings.length > 0 ? comment.ratings.reduce((sum, r) => sum + r.value, 0) / comment.ratings.length : 0

  const displayedReplies = showAllReplies ? comment.replies : comment.replies.slice(0, 1)

  const handleReplySubmit = (content) => {
    onReply(comment.id, content)
    setIsReplying(false)
  }

  const handleReplyToReply = (content, replyingToUserId) => {
    onReply(comment.id, content, replyingToUserId)
    setIsReplying(false)
  }

  return (
    <div className="mb-0">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
        <Avatar>
          <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment.user.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm pl-2">{comment.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 pt-0">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${isLiked ? "text-blue-800 bg-blue-100" : ""}`}
              onClick={() => onLike(comment.id)}
            >
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span>{comment.likes.length}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${isDisliked ? "text-red-800 bg-red-100" : ""}`}
              onClick={() => onDislike(comment.id)}
            >
              <ThumbsDown className="mr-1 h-4 w-4" />
              <span>{comment.dislikes.length}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="px-2" onClick={() => setIsReplying(!isReplying)}>
            <Reply className="mr-1 h-4 w-4" />
            <span>Reply</span>
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {comment.ratings.length > 0 ? (
                <>
                  Rating: {averageRating.toFixed(1)} ({comment.ratings.length})
                </>
              ) : (
                "No ratings yet"
              )}
            </span>
            <CommentRating value={userRating} onChange={(value) => onRate(comment.id, value)} />
          </div>
        </div>

        {isReplying && (
          <div className="w-full pl-6">
            <CommentForm
              onSubmit={handleReplySubmit}
              placeholder="Write a reply..."
              buttonText="Reply"
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}

        {comment.replies.length > 0 && (
          <div className="w-full pl-6 space-y-4">
            {displayedReplies.map((reply) => (
              <CommentReply
                key={reply.id}
                reply={reply}
                commentId={comment.id}
                currentUser={currentUser}
                onReply={handleReplyToReply}
                onLike={onLike}
                onDislike={onDislike}
              />
            ))}

            {comment.replies.length > 1 && (
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowAllReplies(!showAllReplies)}>
                {showAllReplies ? (
                  <>
                    <ChevronUp className="mr-1 h-3 w-3" />
                    Hide replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 h-3 w-3" />
                    Show all replies ({comment.replies.length - 1} more)
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </div>
  )
}

function CommentReply({ reply, commentId, currentUser, onReply, onLike, onDislike }) {
  const [isReplying, setIsReplying] = useState(false)

  const isLiked = reply.likes.includes(currentUser.id)
  const isDisliked = reply.dislikes.includes(currentUser.id)

  const handleReplySubmit = (content) => {
    onReply(content, reply.user.name)
    setIsReplying(false)
  }

  return (
    <div className="border-l-2 pl-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
          <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{reply.user.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm mt-1">
            {reply.replyingTo && <span className="font-medium text-primary">@{reply.replyingTo} </span>}
            {reply.content}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 text-xs ${isLiked ? "text-blue-800 bg-blue-100" : ""}`}
              onClick={() => onLike(commentId, reply.id)}
            >
              <ThumbsUp className="mr-1 h-3 w-3" />
              <span>{reply.likes.length}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 text-xs ${isDisliked ? "text-red-800 bg-red-100" : ""}`}
              onClick={() => onDislike(commentId, reply.id)}
            >
              <ThumbsDown className="mr-1 h-3 w-3" />
              <span>{reply.dislikes.length}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setIsReplying(!isReplying)}>
              <Reply className="mr-1 h-3 w-3" />
              <span>Reply</span>
            </Button>
          </div>

          {isReplying && (
            <div className="mt-3">
              <CommentForm
                onSubmit={handleReplySubmit}
                placeholder={`Reply to ${reply.user.name}...`}
                buttonText="Reply"
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
