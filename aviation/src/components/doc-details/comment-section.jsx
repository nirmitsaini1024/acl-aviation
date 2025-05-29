import { useState } from "react"
import { Comment } from "./comment"
import { CommentForm } from "./comment-form"
import { ScrollArea } from "../ui/scroll-area"


// Mock current user
const currentUser = {
  id: "user-1",
  name: "John Doe",
  avatar: "/placeholder.svg?height=40&width=40",
}

// Mock initial comments
const initialComments = [
  {
    id: "comment-1",
    user: {
      id: "user-2",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "This is a great post! I really enjoyed reading it.",
    timestamp: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
    likes: ["user-1", "user-3"],
    dislikes: [],
    ratings: [
      { userId: "user-1", value: 4.5 },
      { userId: "user-3", value: 5 },
    ],
    replies: [
      {
        id: "reply-1",
        user: {
          id: "user-3",
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "I agree! The content is very informative.",
        timestamp: new Date(Date.now() - 3600000 * 12), // 12 hours ago
        likes: ["user-2"],
        dislikes: [],
      },
      {
        id: "reply-2",
        user: currentUser,
        content: "Thanks for sharing your thoughts!",
        timestamp: new Date(Date.now() - 3600000 * 6), // 6 hours ago
        likes: [],
        dislikes: [],
        replyingTo: "user-3",
      },
    ],
  },
  {
    id: "comment-2",
    user: {
      id: "user-4",
      name: "Sam Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "I have a question about the third point. Could you elaborate more?",
    timestamp: new Date(Date.now() - 3600000 * 10), // 10 hours ago
    likes: [],
    dislikes: [],
    ratings: [{ userId: "user-2", value: 3.5 }],
    replies: [],
  },
]

export function CommentSection() {
  const [comments, setComments] = useState(initialComments)

  const addComment = (content) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      user: currentUser,
      content,
      timestamp: new Date(),
      likes: [],
      dislikes: [],
      ratings: [],
      replies: [],
    }
    setComments([newComment, ...comments])
  }

  const addReply = (commentId, content, replyingTo) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const newReply = {
            id: `reply-${Date.now()}`,
            user: currentUser,
            content,
            timestamp: new Date(),
            likes: [],
            dislikes: [],
            replyingTo,
          }
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          }
        }
        return comment
      }),
    )
  }

  const toggleLike = (commentId, replyId) => {
    setComments(
      comments.map((comment) => {
        if (replyId) {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply.id === replyId) {
                  const isLiked = reply.likes.includes(currentUser.id)
                  return {
                    ...reply,
                    likes: isLiked
                      ? reply.likes.filter((id) => id !== currentUser.id)
                      : [...reply.likes, currentUser.id],
                    dislikes: reply.dislikes.filter((id) => id !== currentUser.id),
                  }
                }
                return reply
              }),
            }
          }
        } else if (comment.id === commentId) {
          const isLiked = comment.likes.includes(currentUser.id)
          return {
            ...comment,
            likes: isLiked ? comment.likes.filter((id) => id !== currentUser.id) : [...comment.likes, currentUser.id],
            dislikes: comment.dislikes.filter((id) => id !== currentUser.id),
          }
        }
        return comment
      }),
    )
  }

  const toggleDislike = (commentId, replyId='') => {
    setComments(
      comments.map((comment) => {
        if (replyId) {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply.id === replyId) {
                  const isDisliked = reply.dislikes.includes(currentUser.id)
                  return {
                    ...reply,
                    dislikes: isDisliked
                      ? reply.dislikes.filter((id) => id !== currentUser.id)
                      : [...reply.dislikes, currentUser.id],
                    likes: reply.likes.filter((id) => id !== currentUser.id),
                  }
                }
                return reply
              }),
            }
          }
        } else if (comment.id === commentId) {
          const isDisliked = comment.dislikes.includes(currentUser.id)
          return {
            ...comment,
            dislikes: isDisliked
              ? comment.dislikes.filter((id) => id !== currentUser.id)
              : [...comment.dislikes, currentUser.id],
            likes: comment.likes.filter((id) => id !== currentUser.id),
          }
        }
        return comment
      }),
    )
  }

  const rateComment = (commentId, value) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const existingRatingIndex = comment.ratings.findIndex((r) => r.userId === currentUser.id)

          const updatedRatings = [...comment.ratings]

          if (existingRatingIndex >= 0) {
            updatedRatings[existingRatingIndex] = {
              ...updatedRatings[existingRatingIndex],
              value,
            }
          } else {
            updatedRatings.push({
              userId: currentUser.id,
              value,
            })
          }

          return {
            ...comment,
            ratings: updatedRatings,
          }
        }
        return comment
      }),
    )
  }

  return (
    <div className="space-y-8">
      <CommentForm onSubmit={addComment} />
        <div className="space-y-6 pr-3">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onReply={addReply}
              onLike={toggleLike}
              onDislike={toggleDislike}
              onRate={rateComment}
            />
          ))}
        </div>

    </div>
  )
}
