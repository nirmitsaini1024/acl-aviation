import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Send,
  Reply,
  Star,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Globe,
  Lock,
  User,
  Users,
  Eye,
  Upload,
  X,
  File,
  RotateCcw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import PDFViewer from "../doc-reviewer/pdf-viewer";
import WebViewerComponent from "@/components/docx-viewer";

// Current user info
const currentUser = {
  name: "John Doe",
  avatar: "/placeholder.svg?height=40&width=40",
  initials: "JD",
};

const enhancedSampleCommentsData = [
   {
    id: 97,
    user: {
      name: "Document Reviewer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DR",
    },
    text: "This document needs some clarification in section 3.",
    likes: 5,
    dislikes: 1,
    timestamp: "2 days ago",
    rating: 3,
    visibility: "public",
    replies: [
      {
        id: 1011,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thanks for pointing this out. I'll make the necessary changes.",
        timestamp: "1 day ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 4,
      },
    ],
  },
   {
    id: 98,
    user: {
      name: "Document Reviewer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DR",
    },
    text: "This document needs some clarification in section 3.",
    likes: 5,
    dislikes: 1,
    timestamp: "2 days ago",
    rating: 3,
    visibility: "public",
    replies: [
      {
        id: 1011,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thanks for pointing this out. I'll make the necessary changes.",
        timestamp: "1 day ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 4,
      },
    ],
  },
   {
    id: 99,
    user: {
      name: "Document Reviewer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DR",
    },
    text: "This document needs some clarification in section 3.",
    likes: 5,
    dislikes: 1,
    timestamp: "2 days ago",
    rating: 3,
    visibility: "public",
    replies: [
      {
        id: 1011,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thanks for pointing this out. I'll make the necessary changes.",
        timestamp: "1 day ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 4,
      },
    ],
  },
   {
    id: 100,
    user: {
      name: "Document Reviewer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DR",
    },
    text: "This document needs some clarification in section 3.",
    likes: 5,
    dislikes: 1,
    timestamp: "2 days ago",
    rating: 3,
    visibility: "public",
    replies: [
      {
        id: 1011,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thanks for pointing this out. I'll make the necessary changes.",
        timestamp: "1 day ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 4,
      },
    ],
  },
  {
    id: 101,
    user: {
      name: "Document Reviewer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DR",
    },
    text: "This document needs some clarification in section 3.",
    likes: 5,
    dislikes: 1,
    timestamp: "2 days ago",
    rating: 3,
    visibility: "public",
    replies: [
      {
        id: 1011,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thanks for pointing this out. I'll make the necessary changes.",
        timestamp: "1 day ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 4,
      },
    ],
  },
  {
    id: 102,
    user: {
      name: "User 1",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "U1",
    },
    text: "CONFIDENTIAL: Found some issues with the security section that need urgent attention.",
    likes: 3,
    dislikes: 0,
    timestamp: "3 days ago",
    rating: 4,
    visibility: "private",
    replies: [],
    restrictedTo: ["user1", "user2"]
  },
  {
    id: 103,
    user: {
      name: "Technical Editor",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TE",
    },
    text: "Great job on improving the diagrams in the appendix.",
    likes: 8,
    dislikes: 0,
    timestamp: "4 days ago",
    rating: 5,
    visibility: "individual",
    replies: [
      {
        id: 1031,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thank you! I spent extra time on those.",
        timestamp: "4 days ago",
        taggedUser: null,
        likes: 3,
        dislikes: 0,
        rating: 5,
      },
      {
        id: 1032,
        user: {
          name: "Project Manager",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "PM",
        },
        text: "These diagrams will be very helpful for the client presentation.",
        timestamp: "3 days ago",
        taggedUser: null,
        likes: 1,
        dislikes: 0,
        rating: 3,
      },
    ],
  },
  // Additional comments for testing load more functionality
  {
    id: 104,
    user: {
      name: "Quality Assurance",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "QA",
    },
    text: "I've reviewed the compliance section and everything looks good. The documentation meets our internal standards.",
    likes: 12,
    dislikes: 0,
    timestamp: "5 days ago",
    rating: 5,
    visibility: "public",
    replies: [
      {
        id: 1041,
        user: {
          name: "Compliance Officer",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "CO",
        },
        text: "Excellent work! This will make the audit process much smoother.",
        timestamp: "5 days ago",
        taggedUser: null,
        likes: 4,
        dislikes: 0,
        rating: 5,
      },
    ],
  },
  {
    id: 105,
    user: {
      name: "Senior Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
    },
    text: "The financial projections in section 8 need to be updated with the latest quarterly figures. Please revise accordingly.",
    likes: 7,
    dislikes: 2,
    timestamp: "6 days ago",
    rating: 3,
    visibility: "public",
    replies: [],
  },
  {
    id: 106,
    user: {
      name: "Legal Team",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "LT",
    },
    text: "From a legal perspective, we need to add disclaimers in sections 4 and 7. I'll send the specific language separately.",
    likes: 9,
    dislikes: 1,
    timestamp: "1 week ago",
    rating: 4,
    visibility: "public",
    replies: [
      {
        id: 1061,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thanks for the guidance. I'll wait for your email with the specific disclaimer text.",
        timestamp: "1 week ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 4,
      },
      {
        id: 1062,
        user: {
          name: "Legal Team",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "LT",
        },
        text: "Email sent with the required disclaimers. Please implement by end of week.",
        timestamp: "6 days ago",
        taggedUser: null,
        likes: 1,
        dislikes: 0,
        rating: 4,
      },
    ],
  },
  {
    id: 107,
    user: {
      name: "Marketing Team",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MT",
    },
    text: "The product descriptions could be more engaging. Consider adding customer testimonials or case studies.",
    likes: 6,
    dislikes: 0,
    timestamp: "1 week ago",
    rating: 4,
    visibility: "public",
    replies: [],
  },
  {
    id: 108,
    user: {
      name: "IT Security",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ITS",
    },
    text: "Security review completed. All data handling procedures comply with our security policies. Approved for publication.",
    likes: 15,
    dislikes: 0,
    timestamp: "1 week ago",
    rating: 5,
    visibility: "public",
    replies: [
      {
        id: 1081,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Great! Thanks for the thorough security review.",
        timestamp: "1 week ago",
        taggedUser: null,
        likes: 3,
        dislikes: 0,
        rating: 5,
      },
    ],
  },
];

const FullPagePopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
      <div className="bg-white w-11/12 max-w-[1400px] h-5/6 rounded-lg shadow-xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-900 text-3xl font-bold z-10"
        >
          &times;
        </button>
        <div className="p-6 overflow-auto h-full">{children}</div>
      </div>
    </div>
  );
};

const StarRating = ({ value, onChange, readOnly = false }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const getRatingFromMousePosition = (event, star) => {
    if (readOnly) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const halfStarPosition = rect.width / 2;
    const clickPosition = event.clientX - rect.left;

    if (clickPosition < halfStarPosition) {
      onChange(star - 0.5);
    } else {
      onChange(star);
    }
  };

  const getStarState = (star, value) => {
    if (value >= star) return "full";
    if (value >= star - 0.5) return "half";
    return "empty";
  };

  const handleMouseMove = (event, star) => {
    if (readOnly) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const halfStarPosition = rect.width / 2;
    const mousePosition = event.clientX - rect.left;

    if (mousePosition < halfStarPosition) {
      setHoverValue(star - 0.5);
    } else {
      setHoverValue(star);
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const effectiveValue = hoverValue || value;
        const starState = getStarState(star, effectiveValue);

        return (
          <button
            key={star}
            type="button"
            className={`focus:outline-none relative ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            onClick={(e) => !readOnly && getRatingFromMousePosition(e, star)}
            onMouseMove={(e) => !readOnly && handleMouseMove(e, star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            disabled={readOnly}
          >
            <Star className="h-5 w-5 text-gray-300" />
            {starState !== "empty" && (
              <div
                className={`absolute top-0 left-0 overflow-hidden`}
                style={{
                  width: starState === "half" ? "50%" : "100%",
                }}
              >
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

const VisibilityBadge = ({ visibility }) => {
  switch (visibility) {
    case "private":
      return (
        <Badge variant="outline" className="ml-2 text-xs bg-slate-100 text-slate-700 border-slate-200">
          <Users className="h-3 w-3 mr-1" />
          Group Only
        </Badge>
      );
    case "public":
      return (
        <Badge variant="outline" className="ml-2 text-xs bg-green-100 text-green-700 border-green-200">
          <Globe className="h-3 w-3 mr-1" />
          Public
        </Badge>
      );
    case "individual":
      return (
        <Badge variant="outline" className="ml-2 text-xs bg-blue-100 text-blue-700 border-blue-200">
          <User className="h-3 w-3 mr-1" />
          For Me
        </Badge>
      );
    default:
      return null;
  }
};

export function ExpandableComments({
  onExpand = () => { },
  onCollapse = () => { },
  expanded = false,
  setExpanded = () => { },
}) {
  const [comments] = useState(enhancedSampleCommentsData);
  const toggleExpanded = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    newExpandedState ? onExpand() : onCollapse();
  };

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleExpanded}
        className="ml-1 whitespace-nowrap"
      >
        <MessageSquare className="h-4 w-4 mr-1" />
        {comments.length}
        {expanded ? (
          <ChevronUp className="h-4 w-4 ml-1" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-1" />
        )}
      </Button>
    </div>
  );
}

export function ExpandedCommentsContent({
  allowRating = true,
  title = "Comments",
  maxHeight = "370px",
  documentId,
  user,
  getSummary = () => "No summary available for this document.",
  getSentiment = () => "neutral",
  readOnly = false,
}) {
  const [expandedComments, setExpandedComments] = useState([]);
  const [comments, setComments] = useState(enhancedSampleCommentsData);
  const [userInteractions, setUserInteractions] = useState({});
  const [replyInteractions, setReplyInteractions] = useState({});
  const [ratingsHistory, setRatingsHistory] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [replyingTo, setReplyingTo] = useState({});
  const [visibility, setVisibility] = useState("private");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isViewerPopupOpen, setIsViewerPopupOpen] = useState(false);
  const [viewerFileType, setViewerFileType] = useState(null);
  const [viewerFilePath, setViewerFilePath] = useState(null);
  const fileInputRef = useRef(null);
  
  // Load more comments functionality
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);
  const COMMENTS_PER_LOAD = 3;

  const getFileTypeFromFileName = (fileName) => {
    if (!fileName) return null;
    const extension = fileName.split('.').pop().toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'docx';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    return 'other';
  };

  const openDocumentViewer = (file) => {
    setViewerFileType(file.fileType);
    setViewerFilePath(file.filePath || file.imageSrc);
    setIsViewerPopupOpen(true);
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile({
        file,
        fileType: getFileTypeFromFileName(file.name)
      });
    }
  };

  const filterCommentsByPermission = (commentsData) => {
    return commentsData.filter(comment => {
      if (comment.restrictedTo && Array.isArray(comment.restrictedTo)) {
        return comment.restrictedTo.includes(user);
      }
      return true;
    });
  };

  const getVisibleComments = () => filterCommentsByPermission(comments);

  const loadMoreComments = () => {
    setVisibleCommentsCount(prev => Math.min(prev + COMMENTS_PER_LOAD, getVisibleComments().length));
  };

  const showLessComments = () => {
    setVisibleCommentsCount(3);
  };

  const toggleCommentReplies = (commentId) => {
    setExpandedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const toggleReplyInput = (commentId) => {
    setReplyingTo(prev => ({
      ...prev,
      [commentId]: null,
    }));
    setShowReplyInput(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
    if (showReplyInput[commentId]) {
      setReplyInputs(prev => ({
        ...prev,
        [commentId]: "",
      }));
    }
  };

  const toggleReplyToReply = (commentId, replyId, replyUser) => {
    setReplyingTo(prev => ({
      ...prev,
      [commentId]: {
        replyId,
        user: replyUser,
      },
    }));
    setShowReplyInput(prev => ({
      ...prev,
      [commentId]: true,
    }));
    if (replyUser) {
      setReplyInputs(prev => ({
        ...prev,
        [commentId]: `@${replyUser.name} `,
      }));
    }
  };

  const handleLike = (commentId) => {
    const interaction = userInteractions[commentId] || {
      liked: false,
      disliked: false,
    };

    if (interaction.liked) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: Math.max(0, comment.likes - 1) }
            : comment
        )
      );
      setUserInteractions(prev => ({
        ...prev,
        [commentId]: { ...interaction, liked: false },
      }));
    } else {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              likes: comment.likes + 1,
              dislikes: interaction.disliked
                ? Math.max(0, comment.dislikes - 1)
                : comment.dislikes,
            }
            : comment
        )
      );
      setUserInteractions(prev => ({
        ...prev,
        [commentId]: { liked: true, disliked: false },
      }));
    }
  };

  const handleDislike = (commentId) => {
    const interaction = userInteractions[commentId] || {
      liked: false,
      disliked: false,
    };

    if (interaction.disliked) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, dislikes: Math.max(0, comment.dislikes - 1) }
            : comment
        )
      );
      setUserInteractions(prev => ({
        ...prev,
        [commentId]: { ...interaction, disliked: false },
      }));
    } else {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              dislikes: comment.dislikes + 1,
              likes: interaction.liked
                ? Math.max(0, comment.likes - 1)
                : comment.likes,
            }
            : comment
        )
      );
      setUserInteractions(prev => ({
        ...prev,
        [commentId]: { liked: false, disliked: true },
      }));
    }
  };

  const handleReplyLike = (commentId, replyId) => {
    const interactionKey = `${commentId}-${replyId}`;
    const interaction = replyInteractions[interactionKey] || {
      liked: false,
      disliked: false,
    };

    if (interaction.liked) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, likes: Math.max(0, reply.likes - 1) }
                  : reply
              ),
            }
            : comment
        )
      );
      setReplyInteractions(prev => ({
        ...prev,
        [interactionKey]: { ...interaction, liked: false },
      }));
    } else {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? {
                    ...reply,
                    likes: reply.likes + 1,
                    dislikes: interaction.disliked
                      ? Math.max(0, reply.dislikes - 1)
                      : reply.dislikes,
                  }
                  : reply
              ),
            }
            : comment
        )
      );
      setReplyInteractions(prev => ({
        ...prev,
        [interactionKey]: { liked: true, disliked: false },
      }));
    }
  };

  const handleReplyDislike = (commentId, replyId) => {
    const interactionKey = `${commentId}-${replyId}`;
    const interaction = replyInteractions[interactionKey] || {
      liked: false,
      disliked: false,
    };

    if (interaction.disliked) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, dislikes: Math.max(0, reply.dislikes - 1) }
                  : reply
              ),
            }
            : comment
        )
      );
      setReplyInteractions(prev => ({
        ...prev,
        [interactionKey]: { ...interaction, disliked: false },
      }));
    } else {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? {
                    ...reply,
                    dislikes: reply.dislikes + 1,
                    likes: interaction.liked
                      ? Math.max(0, reply.likes - 1)
                      : reply.likes,
                  }
                  : reply
              ),
            }
            : comment
        )
      );
      setReplyInteractions(prev => ({
        ...prev,
        [interactionKey]: { liked: false, disliked: true },
      }));
    }
  };

  const getReplyInteraction = (commentId, replyId) => {
    const interactionKey = `${commentId}-${replyId}`;
    return replyInteractions[interactionKey] || { liked: false, disliked: false };
  };

  const calculateAverageRating = (comments) => {
    const ratedComments = comments.filter(comment => comment.rating > 0);
    if (ratedComments.length === 0) return 0;
    const sum = ratedComments.reduce((acc, comment) => acc + (comment.rating || 0), 0);
    return (sum / ratedComments.length).toFixed(1);
  };

  const calculateAverageReplyRating = (replies) => {
    const ratedReplies = replies.filter(reply => reply.rating > 0);
    if (ratedReplies.length === 0) return 0;
    const sum = ratedReplies.reduce((acc, reply) => acc + (reply.rating || 0), 0);
    return (sum / ratedReplies.length).toFixed(1);
  };

  const logRating = (itemType, itemId, userId, oldRating, newRating) => {
    const ratingEvent = {
      timestamp: new Date().toISOString(),
      itemType,
      itemId,
      userId,
      oldRating,
      newRating,
    };
    setRatingsHistory(prev => [...prev, ratingEvent]);
  };

  const handleReplyChange = (commentId, value) => {
    setReplyInputs(prev => ({
      ...prev,
      [commentId]: value,
    }));
  };

  const submitComment = () => {
    if (!newComment.trim() && !selectedFile) return;

    const comment = {
      id: Date.now(),
      user: currentUser,
      text: newComment,
      likes: 0,
      dislikes: 0,
      timestamp: "Just now",
      rating: 0,
      replies: [],
      visibility: visibility,
      ...(selectedFile && {
        hasImage: selectedFile.fileType === 'image',
        fileType: selectedFile.fileType,
        fileName: selectedFile.file.name,
        filePath: URL.createObjectURL(selectedFile.file)
      })
    };

    setComments(prev => [comment, ...prev]);
    setNewComment("");
    setSelectedFile(null);
  };

  const submitReply = (commentId) => {
    const replyText = replyInputs[commentId];
    if (!replyText || replyText.trim() === "") return;

    const newReply = {
      id: Date.now(),
      user: currentUser,
      text: replyText,
      timestamp: "Just now",
      taggedUser: replyingTo[commentId]?.user || null,
      likes: 0,
      dislikes: 0,
      rating: 0,
    };

    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    );

    setReplyInputs(prev => ({
      ...prev,
      [commentId]: "",
    }));
    setReplyingTo(prev => ({
      ...prev,
      [commentId]: null,
    }));
    setExpandedComments(prev =>
      prev.includes(commentId) ? prev : [...prev, commentId]
    );
    setShowReplyInput(prev => ({
      ...prev,
      [commentId]: false,
    }));
  };

  const cancelReply = (commentId) => {
    setShowReplyInput(prev => ({
      ...prev,
      [commentId]: false,
    }));
    setReplyInputs(prev => ({
      ...prev,
      [commentId]: "",
    }));
    setReplyingTo(prev => ({
      ...prev,
      [commentId]: null,
    }));
  };

  const formatReplyText = (text, taggedUser) => {
    if (!taggedUser) return text;

    const tagPattern = new RegExp(`^@${taggedUser.name}\\s`);
    if (tagPattern.test(text)) {
      const tagLength = `@${taggedUser.name} `.length;
      return (
        <div className="flex gap-2">
          <span className="text-blue-600 font-medium">@{taggedUser.name}</span>
          <span>{text.substring(tagLength)}</span>
        </div>
      );
    }

    return text;
  };

  const handleReplyRating = (commentId, replyId, newRating) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    const reply = comment.replies.find(r => r.id === replyId);
    if (!reply) return;

    const oldRating = reply.rating || 0;

    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? {
            ...c,
            replies: c.replies.map(r =>
              r.id === replyId ? { ...r, rating: newRating } : r
            ),
          }
          : c
      )
    );

    logRating("reply", replyId, currentUser.name, oldRating, newRating);
  };

  const visibleComments = getVisibleComments();
  const displayedComments = visibleComments.slice(0, visibleCommentsCount);
  const hasMoreComments = visibleCommentsCount < visibleComments.length;
  const showingAllComments = visibleCommentsCount >= visibleComments.length && visibleComments.length > 3;

  return (
    <div className="pl-20 p-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <span className="text-sm text-gray-500">
              Showing {displayedComments.length} of {visibleComments.length} comments
            </span>
          </div>
        </div>
        <div className="mb-6 p-4 pt-2 border-2 rounded-md border-purple-200">
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center">
              <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
              Review AI Summary
              <div className="flex justify-center space-x-4 py-2 ml-2">
                <div className={`flex gap-1 items-center text-green-500 ${getSentiment(documentId) === "positive" ? "opacity-100" : "hidden"}`}>
                  <Smile className="h-4 w-4 mt-1" />
                  <span className="text-xs mt-1">Positive</span>
                </div>
                <div className={`flex gap-1 items-center text-yellow-500 ${getSentiment(documentId) === "neutral" ? "opacity-100" : "hidden"}`}>
                  <Meh className="h-4 w-4 mt-1" />
                  <span className="text-xs mt-1">Neutral</span>
                </div>
                <div className={`flex gap-1 items-center text-red-500 ${getSentiment(documentId) === "negative" ? "opacity-100" : "hidden"}`}>
                  <Frown className="h-4 w-4 mt-1" />
                  <span className="text-xs mt-1">Negative</span>
                </div>
              </div>
            </h4>
            <div className="text-sm text-gray-700 border-l-2 border-purple-200 pl-3">
              {getSummary(documentId)}
            </div>
          </div>
        </div>

        {/* Comment input section - Always show but disable when readOnly */}
        <div className={`bg-white rounded-lg p-4 shadow-sm mb-4 sticky top-0 z-10 ${readOnly ? 'opacity-60' : ''}`}>
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-2">
                <Textarea
                  placeholder={readOnly ? "Comments are view-only for this document" : "Write a comment..."}
                  className="min-h-[80px] resize-none"
                  value={readOnly ? "" : newComment}
                  onChange={(e) => !readOnly && setNewComment(e.target.value)}
                  disabled={readOnly}
                />
              </div>

              <div className="flex justify-between items-center gap-3 mb-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 h-8 px-3"
                        disabled={readOnly}
                      >
                        {visibility === "private" && (
                          <>
                            <Users className="h-3.5 w-3.5 text-slate-600" />
                            <span className="text-xs">Group Only</span>
                          </>
                        )}
                        {visibility === "public" && (
                          <>
                            <Globe className="h-3.5 w-3.5 text-green-600" />
                            <span className="text-xs text-green-600">Public</span>
                          </>
                        )}
                        {visibility === "individual" && (
                          <>
                            <User className="h-3.5 w-3.5 text-blue-600" />
                            <span className="text-xs text-blue-600">For Me</span>
                          </>
                        )}
                        <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-32">
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-xs cursor-pointer"
                        onClick={() => !readOnly && setVisibility("private")}
                        disabled={readOnly}
                      >
                        <Users className="h-3.5 w-3.5" />
                        Group Only
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-xs cursor-pointer"
                        onClick={() => !readOnly && setVisibility("public")}
                        disabled={readOnly}
                      >
                        <Globe className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-green-600">Public</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-xs cursor-pointer"
                        onClick={() => !readOnly && setVisibility("individual")}
                        disabled={readOnly}
                      >
                        <User className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-blue-600">For Me</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    disabled={readOnly}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => !readOnly && fileInputRef.current.click()}
                    className="h-8"
                    disabled={readOnly}
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    Attachment
                  </Button>

                  {selectedFile && !readOnly && (
                    <div className="inline-flex items-center bg-gray-100 rounded px-2 py-1">
                      <span className="text-xs mr-2">{selectedFile.file.name}</span>
                      <button onClick={() => setSelectedFile(null)}>
                        <X className="h-3 w-3 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  onClick={submitComment}
                  disabled={readOnly || (!newComment.trim() && !selectedFile)}
                  className="bg-blue-600"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-md border bg-white">
          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
            {displayedComments.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center text-gray-500">
                No comments yet. Be the first to add a comment!
              </div>
            ) : (
              displayedComments.map((comment) => (
                <div key={`comment-${comment.id}`} className="bg-white rounded-lg p-4 shadow-sm">
                  {/* Comment header and content */}
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{comment.user.name}</p>
                            {comment.visibility && <VisibilityBadge visibility={comment.visibility} />}
                            {comment.restrictedTo && !comment.visibility && (
                              <Badge variant="outline" className="ml-2 text-xs bg-slate-100 text-slate-700 border-slate-200">
                                <Lock className="h-3 w-3 mr-1" />
                                Group Only
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {comment.timestamp}
                          </p>
                        </div>
                        {allowRating && (
                          <div className="flex items-center">
                            <StarRating
                              value={comment.rating || 0}
                              onChange={(newRating) => {
                                if (readOnly) return;
                                const oldRating = comment.rating || 0;
                                setComments((prev) =>
                                  prev.map((c) =>
                                    c.id === comment.id
                                      ? { ...c, rating: newRating }
                                      : c
                                  )
                                );
                                logRating(
                                  "comment",
                                  comment.id,
                                  currentUser.name,
                                  oldRating,
                                  newRating
                                );
                              }}
                              readOnly={readOnly}
                            />
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        {comment.text && <p>{comment.text}</p>}
                        {comment.fileType && (
                          <div className="mt-2 border rounded-md p-2 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <File className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm">{comment.fileName}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDocumentViewer(comment)}
                                className="h-6 px-2"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Interaction buttons - Always show but disable when readOnly */}
                      <div className="flex items-center mt-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={userInteractions[comment.id]?.liked ? "default" : "ghost"}
                            size="sm"
                            onClick={() => !readOnly && handleLike(comment.id)}
                            disabled={readOnly}
                            className={`h-8 px-2 ${
                              userInteractions[comment.id]?.liked
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "hover:bg-green-100 hover:text-green-700"
                            } ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1 text-green-700" />
                            {comment.likes}
                          </Button>
                          <Button
                            variant={userInteractions[comment.id]?.disliked ? "default" : "ghost"}
                            size="sm"
                            onClick={() => !readOnly && handleDislike(comment.id)}
                            disabled={readOnly}
                            className={`h-8 px-2 ${
                              userInteractions[comment.id]?.disliked
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "hover:bg-red-100 hover:text-red-700"
                            } ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
                          >
                            <ThumbsDown className="h-4 w-4 mr-1 text-red-600" />
                            {comment.dislikes}
                          </Button>
                        </div>

                        {comment.replies.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCommentReplies(comment.id)}
                            className={"opacity-70 cursor-pointer"}
                          >
                            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                            {expandedComments.includes(comment.id) ? "Hide" : "Show"} Replies ({comment.replies.length})
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => !readOnly && toggleReplyInput(comment.id)}
                          disabled={readOnly}
                          className={`ml-auto ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
                        >
                          <Reply className="h-3.5 w-3.5 mr-1.5" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Replies section - Show replies but disable interactions when readOnly */}
                  {expandedComments.includes(comment.id) && comment.replies.length > 0 && (
                    <div className="mt-4 ml-8 pl-4 space-y-4 border-l-2">
                      {comment.replies.map((reply, replyIndex) => (
                        <React.Fragment key={`reply-${reply.id}`}>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={reply.user.avatar || "/placeholder.svg"} alt={reply.user.name} />
                                <AvatarFallback>{reply.user.initials}</AvatarFallback>
                              </Avatar>
                              <div className="w-full">
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{reply.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                                  </div>
                                  {allowRating && (
                                    <div className="flex items-center scale-75 origin-right">
                                      <StarRating
                                        value={reply.rating || 0}
                                        onChange={(newRating) =>
                                          !readOnly && handleReplyRating(comment.id, reply.id, newRating)
                                        }
                                        readOnly={readOnly}
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="mt-1 text-sm">
                                  {formatReplyText(reply.text, reply.taggedUser)}
                                </div>

                                {/* Reply interaction buttons - Always show but disable when readOnly */}
                                <div className="flex items-center mt-2 mb-1">
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant={getReplyInteraction(comment.id, reply.id).liked ? "default" : "ghost"}
                                      size="sm"
                                      onClick={() => !readOnly && handleReplyLike(comment.id, reply.id)}
                                      disabled={readOnly}
                                      className={`h-6 px-1.5 text-xs ${
                                        getReplyInteraction(comment.id, reply.id).liked
                                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                                          : "hover:bg-green-100 hover:text-green-700"
                                      } ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
                                    >
                                      <ThumbsUp className="h-3 w-3 mr-1 text-green-700" />
                                      {reply.likes}
                                    </Button>
                                    <Button
                                      variant={getReplyInteraction(comment.id, reply.id).disliked ? "default" : "ghost"}
                                      size="sm"
                                      onClick={() => !readOnly && handleReplyDislike(comment.id, reply.id)}
                                      disabled={readOnly}
                                      className={`h-6 px-1.5 text-xs ${
                                        getReplyInteraction(comment.id, reply.id).disliked
                                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                                          : "hover:bg-red-100 hover:text-red-700"
                                      } ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
                                    >
                                      <ThumbsDown className="h-3 w-3 mr-1 text-red-600" />
                                      {reply.dislikes}
                                    </Button>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`text-xs h-6 px-2 ml-auto ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
                                    onClick={() => !readOnly && toggleReplyToReply(comment.id, reply.id, reply.user)}
                                    disabled={readOnly}
                                  >
                                    <Reply className="h-3 w-3 mr-1" />
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Show reply input right after the specific reply being replied to */}
                          {showReplyInput[comment.id] && 
                          replyingTo[comment.id]?.replyId === reply.id && (
                            <div className={`ml-4 pl-4 ${readOnly ? 'opacity-60' : ''}`}>
                              <div className="flex items-start gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                                  <AvatarFallback>{currentUser.initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  {replyingTo[comment.id]?.user && !readOnly && (
                                    <div className="mb-1 text-xs text-blue-600">
                                      Replying to {replyingTo[comment.id].user.name}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 px-1 ml-1 text-xs"
                                        onClick={() => {
                                          setReplyingTo((prev) => ({
                                            ...prev,
                                            [comment.id]: null,
                                          }));
                                          setReplyInputs((prev) => ({
                                            ...prev,
                                            [comment.id]: prev[comment.id].replace(
                                              new RegExp(`^@${replyingTo[comment.id].user.name}\\s`),
                                              ""
                                            ),
                                          }));
                                        }}
                                        disabled={readOnly}
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  )}
                                  <Textarea
                                    placeholder={
                                      readOnly 
                                        ? "Replying is disabled for this document"
                                        : replyingTo[comment.id]?.user
                                        ? `Reply to ${replyingTo[comment.id].user.name}...`
                                        : "Write a reply..."
                                    }
                                    className="min-h-[60px] resize-none"
                                    value={readOnly ? "" : (replyInputs[comment.id] || "")}
                                    onChange={(e) => !readOnly && handleReplyChange(comment.id, e.target.value)}
                                    disabled={readOnly}
                                  />
                                  <div className="flex justify-end mt-2">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="mr-2"
                                      onClick={() => cancelReply(comment.id)}
                                      disabled={readOnly}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => submitReply(comment.id)}
                                      disabled={readOnly || !replyInputs[comment.id]?.trim()}
                                    >
                                      <Send className="h-3 w-3 mr-1.5" />
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}

                      {/* Show reply input at the end only when replying to the main comment (not a specific reply) */}
                      {showReplyInput[comment.id] && 
                      (!replyingTo[comment.id]?.replyId) && (
                        <div className={`pl-4 ${readOnly ? 'opacity-60' : ''}`}>
                          <div className="flex items-start gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                              <AvatarFallback>{currentUser.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              {replyingTo[comment.id]?.user && !readOnly && (
                                <div className="mb-1 text-xs text-blue-600">
                                  Replying to {replyingTo[comment.id].user.name}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 px-1 ml-1 text-xs"
                                    onClick={() => {
                                      setReplyingTo((prev) => ({
                                        ...prev,
                                        [comment.id]: null,
                                      }));
                                      setReplyInputs((prev) => ({
                                        ...prev,
                                        [comment.id]: prev[comment.id].replace(
                                          new RegExp(`^@${replyingTo[comment.id].user.name}\\s`),
                                          ""
                                        ),
                                      }));
                                    }}
                                    disabled={readOnly}
                                  >
                                    ×
                                  </Button>
                                </div>
                              )}
                              <Textarea
                                placeholder={
                                  readOnly 
                                    ? "Replying is disabled for this document"
                                    : replyingTo[comment.id]?.user
                                    ? `Reply to ${replyingTo[comment.id].user.name}...`
                                    : "Write a reply..."
                                }
                                className="min-h-[60px] resize-none"
                                value={readOnly ? "" : (replyInputs[comment.id] || "")}
                                onChange={(e) => !readOnly && handleReplyChange(comment.id, e.target.value)}
                                disabled={readOnly}
                              />
                              <div className="flex justify-end mt-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="mr-2"
                                  onClick={() => cancelReply(comment.id)}
                                  disabled={readOnly}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => submitReply(comment.id)}
                                  disabled={readOnly || !replyInputs[comment.id]?.trim()}
                                >
                                  <Send className="h-3 w-3 mr-1.5" />
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reply input - Show but disable when readOnly */}
                  {showReplyInput[comment.id] && (
                    <div className={`mt-4 ml-8 pl-4 ${readOnly ? 'opacity-60' : ''}`}>
                      <div className="flex items-start gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                          <AvatarFallback>{currentUser.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          {replyingTo[comment.id]?.user && !readOnly && (
                            <div className="mb-1 text-xs text-blue-600">
                              Replying to {replyingTo[comment.id].user.name}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 px-1 ml-1 text-xs"
                                onClick={() => {
                                  setReplyingTo((prev) => ({
                                    ...prev,
                                    [comment.id]: null,
                                  }));
                                  setReplyInputs((prev) => ({
                                    ...prev,
                                    [comment.id]: prev[comment.id].replace(
                                      new RegExp(`^@${replyingTo[comment.id].user.name}\\s`),
                                      ""
                                    ),
                                  }));
                                }}
                                disabled={readOnly}
                              >
                                ×
                              </Button>
                            </div>
                          )}
                          <Textarea
                            placeholder={
                              readOnly 
                                ? "Replying is disabled for this document"
                                : replyingTo[comment.id]?.user
                                ? `Reply to ${replyingTo[comment.id].user.name}...`
                                : "Write a reply..."
                            }
                            className="min-h-[60px] resize-none"
                            value={readOnly ? "" : (replyInputs[comment.id] || "")}
                            onChange={(e) => !readOnly && handleReplyChange(comment.id, e.target.value)}
                            disabled={readOnly}
                          />
                          <div className="flex justify-end mt-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="mr-2"
                              onClick={() => cancelReply(comment.id)}
                              disabled={readOnly}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => submitReply(comment.id)}
                              disabled={readOnly || !replyInputs[comment.id]?.trim()}
                            >
                              <Send className="h-3 w-3 mr-1.5" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Load More / Show Less Section */}
          {visibleComments.length > 0 && (
            <div className="border-t bg-gray-50 p-4 flex justify-center">
              {hasMoreComments ? (
                <Button
                  variant="outline"
                  onClick={loadMoreComments}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                >
                  <Plus className="h-4 w-4" />
                  Load {Math.min(COMMENTS_PER_LOAD, visibleComments.length - visibleCommentsCount)} More Comments
                </Button>
              ) : showingAllComments ? (
                <Button
                  variant="outline"
                  onClick={showLessComments}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                >
                  <RotateCcw className="h-4 w-4" />
                  Show Less Comments
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <FullPagePopup
        isOpen={isViewerPopupOpen}
        onClose={() => setIsViewerPopupOpen(false)}
      >
        {viewerFileType === 'pdf' ? (
          <div className="h-full">
            <h2 className="text-xl font-bold mb-4">PDF Viewer</h2>
            <PDFViewer initialDoc={viewerFilePath} />
          </div>
        ) : viewerFileType === 'docx' || viewerFileType === 'doc' ? (
          <div className="h-full">
            <h2 className="text-xl font-bold mb-4">Document Viewer</h2>
            <WebViewerComponent initialDoc={viewerFilePath} setSelectedText={() => { }} />
          </div>
        ) : viewerFileType === 'image' ? (
          <div className="flex justify-center items-center h-full">
            <img
              src={viewerFilePath}
              alt="Preview"
              className="max-w-full max-h-full"
            />
          </div>
        ) : (
          <div className="text-center p-8">
            <p>Cannot preview this file type.</p>
          </div>
        )}
      </FullPagePopup>
    </div>
  );
}

export function useReplyInteractions() {
  const [replyInteractions, setReplyInteractions] = useState({});

  const handleReplyLike = (commentId, replyId) => {
    const interactionKey = `${commentId}-${replyId}`;
    const interaction = replyInteractions[interactionKey] || {
      liked: false,
      disliked: false,
    };

    if (interaction.liked) {
      setReplyInteractions((prev) => ({
        ...prev,
        [interactionKey]: { ...interaction, liked: false },
      }));
    } else {
      setReplyInteractions((prev) => ({
        ...prev,
        [interactionKey]: { liked: true, disliked: false },
      }));
    }

    return !interaction.liked;
  };

  const handleReplyDislike = (commentId, replyId) => {
    const interactionKey = `${commentId}-${replyId}`;
    const interaction = replyInteractions[interactionKey] || {
      liked: false,
      disliked: false,
    };

    if (interaction.disliked) {
      setReplyInteractions((prev) => ({
        ...prev,
        [interactionKey]: { ...interaction, disliked: false },
      }));
    } else {
      setReplyInteractions((prev) => ({
        ...prev,
        [interactionKey]: { liked: false, disliked: true },
      }));
    }

    return !interaction.disliked;
  };

  const getReplyInteraction = (commentId, replyId) => {
    const interactionKey = `${commentId}-${replyId}`;
    return (
      replyInteractions[interactionKey] || { liked: false, disliked: false }
    );
  };

  return {
    handleReplyLike,
    handleReplyDislike,
    getReplyInteraction,
    replyInteractions,
  };
}

export default ExpandableComments;