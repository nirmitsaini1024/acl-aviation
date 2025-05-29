import {
  Download,
  ExternalLink,
  Printer,
  X,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Star,
  Send,
  MoveRight,
  MessagesSquare,
  Users,
  Globe,
  User,
  Upload,
  Paperclip,
  File,
  Eye
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { documentsToReview } from "@/mock-data/navigate-document";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import WebViewerComponent from "./docx-viewer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

// Current user info (for new comments and replies)
const currentUser = {
  name: " John Doe",
  avatar: "/placeholder.svg?height=40&width=40",
  initials: "JD",
};

// Star Rating Component with 0.5 increments
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
            className={`focus:outline-none relative ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            onClick={(e) => !readOnly && getRatingFromMousePosition(e, star)}
            onMouseMove={(e) => !readOnly && handleMouseMove(e, star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            disabled={readOnly}
          >
            <Star className="h-5 w-5 text-gray-300" />
            
            {starState !== "empty" && (
              <div 
                className="absolute top-0 left-0 overflow-hidden" 
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

export const DocumentTableViewer = ({ url, filename, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [viewerType, setViewerType] = useState(null);
  const [embedUrl, setEmbedUrl] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I'm your Delphi AI assistant. How can I help you with this document?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [expandedCommentRows, setExpandedCommentRows] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isViewerPopupOpen, setIsViewerPopupOpen] = useState(false);
  const [viewerFilePath, setViewerFilePath] = useState("");
  const [viewerFileType, setViewerFileType] = useState("");
  const fileInputRef = useRef(null);
  
  // Get comments data for each document
  const getCommentsData = (docId) => {
    return [
      {
        id: docId * 100 + 1,
        user: {
          name: "Document Reviewer",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DR",
        },
        text: `This document needs some clarification in section 3.`,
        likes: 5,
        dislikes: 1,
        timestamp: "2 days ago",
        rating: 3,
        visibility: "public",
        replies: [
          {
            id: docId * 1000 + 1,
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
            rating: 4
          },
        ],
      },
      {
        id: docId * 100 + 2,
        user: {
          name: "Quality Assurance",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "QA",
        },
        text: "The formatting looks good, but please check the references at the end.",
        likes: 3,
        dislikes: 0,
        timestamp: "3 days ago",
        rating: 4,
        visibility: "individual",
        replies: [],
      },
    ];
  };

  // Comments state management for all documents
  const [commentState, setCommentState] = useState({});

  // Initialize comment state for each document
  useEffect(() => {
    const initialState = {};
    documentsToReview.forEach(doc => {
      initialState[doc.id] = {
        comments: getCommentsData(doc.id),
        newComment: "",
        expandedComments: [],
        showReplyInput: {},
        replyInputs: {},
        replyingTo: {},
        userInteractions: {},
        replyInteractions: {},
        ratingsHistory: []
      };
    });
    setCommentState(initialState);
  }, []);

  // Initialize the viewer when it opens
  useEffect(() => {
    if (!url) return;

    if (url.includes("drive.google.com/file/d/")) {
      const fileIdMatch = url.match(/\/d\/([^\/]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        const googleDriveEmbedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        setEmbedUrl(googleDriveEmbedUrl);
        setViewerType("google-drive");
        setLoading(false);
        return;
      }
    }

    const fileExtension = filename
      ? filename.split(".").pop().toLowerCase()
      : url.split(".").pop().split("?")[0].toLowerCase();

    if (["pdf"].includes(fileExtension)) {
      setViewerType("pdf");
      setEmbedUrl(url);
    } else if (
      ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExtension)
    ) {
      setViewerType("image");
      setEmbedUrl(url);
    } else if (
      ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "csv"].includes(
        fileExtension
      )
    ) {
      setViewerType("office");
      setEmbedUrl(
        `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          url
        )}&wdZoom=75`
      );
    } else {
      setViewerType("default");
      setEmbedUrl(url);
    }

    setLoading(false);
  }, [url, filename]);

  const handleOverlayClick = (e) => {
    if (e.target.getAttribute("data-overlay") === "true") {
      onClose();
    }
  };

  const handleDownload = () => {
    if (!url) return;
    window.open(url, "_blank");
  };

  const handleOpenInNewTab = () => {
    if (!url) return;
    window.open(url, "_blank");
  };

  const handlePrint = () => {
    if (viewerType === "pdf") {
      const iframe = document.getElementById("document-viewer-frame");
      if (iframe) {
        try {
          iframe.contentWindow.print();
          return;
        } catch (error) {
          console.error("Could not print directly from iframe:", error);
        }
      }
    }

    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      printWindow.addEventListener("load", () => {
        printWindow.print();
      });
    } else {
      alert("Please allow popups to print the document");
      window.open(url, "_blank");
    }
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    setMessages((prev) => [...prev, { sender: "user", text: inputValue }]);
    setInputValue("");

    setIsTyping(true);

    setTimeout(() => {
      const aiResponse =
        "I've analyzed this document. Is there something specific you'd like to know about its functionality?";

      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleCommentExpansion = (docId) => {
    setExpandedCommentRows(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId) 
        : [...prev, docId]
    );
  };
  
  const toggleCommentReplies = (docId, commentId) => {
    setCommentState(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        expandedComments: prev[docId].expandedComments.includes(commentId)
          ? prev[docId].expandedComments.filter(id => id !== commentId)
          : [...prev[docId].expandedComments, commentId]
      }
    }));
  };
  
  const toggleReplyInput = (docId, commentId) => {
    setCommentState(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        replyingTo: {
          ...prev[docId].replyingTo,
          [commentId]: null
        },
        showReplyInput: {
          ...prev[docId].showReplyInput,
          [commentId]: !prev[docId].showReplyInput[commentId]
        }
      }
    }));
    
    if (commentState[docId]?.showReplyInput[commentId]) {
      setCommentState(prev => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          replyInputs: {
            ...prev[docId].replyInputs,
            [commentId]: ''
          }
        }
      }));
    }
  };
  
  const toggleReplyToReply = (docId, commentId, replyId, replyUser) => {
    setCommentState(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        replyingTo: {
          ...prev[docId].replyingTo,
          [commentId]: {
            replyId,
            user: replyUser
          }
        },
        showReplyInput: {
          ...prev[docId].showReplyInput,
          [commentId]: true
        },
        replyInputs: {
          ...prev[docId].replyInputs,
          [commentId]: replyUser ? `@${replyUser.name} ` : ''
        }
      }
    }));
  };

  const handleLike = (docId, commentId) => {
    if (!commentState[docId]) return;
    
    const interaction = commentState[docId].userInteractions[commentId] || { liked: false, disliked: false };
    
    if (interaction.liked) {
      setCommentState(prev => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          comments: prev[docId].comments.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes: Math.max(0, comment.likes - 1) } 
              : comment
          ),
          userInteractions: {
            ...prev[docId].userInteractions,
            [commentId]: { ...interaction, liked: false }
          }
        }
      }));
    } else {
      setCommentState(prev => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          comments: prev[docId].comments.map(comment => 
            comment.id === commentId 
              ? { 
                  ...comment, 
                  likes: comment.likes + 1,
                  dislikes: interaction.disliked ? Math.max(0, comment.dislikes - 1) : comment.dislikes
                } 
              : comment
          ),
          userInteractions: {
            ...prev[docId].userInteractions,
            [commentId]: { liked: true, disliked: false }
          }
        }
      }));
    }
  };

  const handleDislike = (docId, commentId) => {
    if (!commentState[docId]) return;
    
    const interaction = commentState[docId].userInteractions[commentId] || { liked: false, disliked: false };
    
    if (interaction.disliked) {
      setCommentState(prev => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          comments: prev[docId].comments.map(comment => 
            comment.id === commentId 
              ? { ...comment, dislikes: Math.max(0, comment.dislikes - 1) } 
              : comment
          ),
          userInteractions: {
            ...prev[docId].userInteractions,
            [commentId]: { ...interaction, disliked: false }
          }
        }
      }));
    } else {
      setCommentState(prev => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          comments: prev[docId].comments.map(comment => 
            comment.id === commentId 
              ? { 
                  ...comment, 
                  dislikes: comment.dislikes + 1,
                  likes: interaction.liked ? Math.max(0, comment.likes - 1) : comment.likes
                } 
              : comment
          ),
          userInteractions: {
            ...prev[docId].userInteractions,
            [commentId]: { liked: false, disliked: true }
          }
        }
      }));
    }
  };

  const handleReplyLike = (docId, commentId, replyId) => {
    if (!commentState[docId]) return;
    
    const interactionKey = `${commentId}-${replyId}`;
    const interaction = commentState[docId].replyInteractions[interactionKey] || { liked: false, disliked: false };
    
    if (interaction.liked) {
      setCommentState(prev => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          comments: prev[docId].comments.map(comment => 
            comment.id === commentId 
              ? { 
                  ...comment, 
                  replies: comment.replies.map(reply => 
                    reply.id === replyId
                      ? { ...reply, likes: Math.max(0, reply.likes - 1) }
                      : reply
                  )
                } 
              : comment
          ),
          replyInteractions: {
            ...prev[docId].replyInteractions,
            [interactionKey]: { ...interaction, liked: false }
          }
        }
      }));
    } else {
      setCommentState(prev => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          comments: prev[docId].comments.map(comment => 
            comment.id === commentId 
              ? { 
                  ...comment, 
                  replies: comment.replies.map(reply => 
                    reply.id === replyId
                      ? { 
                          ...reply, 
                          likes: reply.likes + 1,
                          dislikes: interaction.disliked ? Math.max(0, reply.dislikes - 1) : reply.dislikes
                        }
                      : reply
                  )
                } 
              : comment
          ),
          replyInteractions: {
            ...prev[docId].replyInteractions,
            [interactionKey]: { liked: true, disliked: false }
          }
        }
      }));
    }
  };

  const handleReplyDislike = (docId, commentId, replyId) => {
    if (!commentState[docId]) return;
    
    const interactionKey = `${commentId}-${replyId}`;
    const interaction = commentState[docId].replyInteractions[interactionKey] || { liked: false, disliked: false };
    
    if (interaction.disliked) {
      setCommentState(prev => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          comments: prev[docId].comments.map(comment => 
            comment.id === commentId 
              ? { 
                  ...comment, 
                  replies: comment.replies.map(reply => 
                    reply.id === replyId
                      ? { ...reply, dislikes: Math.max(0, reply.dislikes - 1) }
                      : reply
                  )
                } 
              : comment
          ),
          replyInteractions: {
            ...prev[docId].replyInteractions,
            [interactionKey]: { ...interaction, disliked: false }
          }
        }
      }));
    } else {
      setCommentState(prev => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          comments: prev[docId].comments.map(comment => 
            comment.id === commentId 
              ? { 
                  ...comment, 
                  replies: comment.replies.map(reply => 
                    reply.id === replyId
                      ? { 
                          ...reply, 
                          dislikes: reply.dislikes + 1,
                          likes: interaction.liked ? Math.max(0, reply.likes - 1) : reply.likes
                        }
                      : reply
                  )
                } 
              : comment
          ),
          replyInteractions: {
            ...prev[docId].replyInteractions,
            [interactionKey]: { liked: false, disliked: true }
          }
        }
      }));
    }
  };

  const getReplyInteraction = (docId, commentId, replyId) => {
    if (!commentState[docId]) return { liked: false, disliked: false };
    
    const interactionKey = `${commentId}-${replyId}`;
    return commentState[docId].replyInteractions[interactionKey] || { liked: false, disliked: false };
  };

  const calculateAverageRating = (comments) => {
    const ratedComments = comments.filter(comment => comment.rating > 0);
    if (ratedComments.length === 0) return 0;
    const sum = ratedComments.reduce((acc, comment) => acc + (comment.rating || 0), 0);
    return (sum / ratedComments.length).toFixed(1);
  };
  
  const handleNewCommentChange = (docId, value) => {
    setCommentState(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        newComment: value
      }
    }));
  };
  
  const handleReplyChange = (docId, commentId, value) => {
    setCommentState(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        replyInputs: {
          ...prev[docId].replyInputs,
          [commentId]: value
        }
      }
    }));
  };
  
  const handle = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile({
      file,
      preview: URL.createObjectURL(file),
      type: getFileType(file.name)
    });
  };

  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'docx';
    return 'other';
  };

  const handleViewFile = () => {
    if (!selectedFile) return;
    setViewerFilePath(selectedFile.preview);
    setViewerFileType(selectedFile.type);
    setIsViewerPopupOpen(true);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submitComment = (docId) => {
    if (!commentState[docId] || (!commentState[docId].newComment.trim() && !selectedFile)) return;
    
    const comment = {
      id: Date.now(),
      user: currentUser,
      text: commentState[docId].newComment,
      likes: 0,
      dislikes: 0,
      timestamp: "Just now",
      rating: 0,
      replies: [],
      attachment: selectedFile ? {
        name: selectedFile.file.name,
        type: selectedFile.type,
        url: selectedFile.preview
      } : null,
      visibility: visibility
    };
    
    setCommentState(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        comments: [comment, ...prev[docId].comments],
        newComment: ""
      }
    }));
    
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const submitReply = (docId, commentId) => {
    if (!commentState[docId] || !commentState[docId].replyInputs[commentId]?.trim()) return;
    
    const newReply = {
      id: Date.now(),
      user: currentUser,
      text: commentState[docId].replyInputs[commentId],
      timestamp: "Just now",
      taggedUser: commentState[docId].replyingTo[commentId]?.user || null,
      likes: 0,
      dislikes: 0,
      rating: 0
    };
    
    setCommentState(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        comments: prev[docId].comments.map(comment => 
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        ),
        replyInputs: {
          ...prev[docId].replyInputs,
          [commentId]: ''
        },
        replyingTo: {
          ...prev[docId].replyingTo,
          [commentId]: null
        },
        showReplyInput: {
          ...prev[docId].showReplyInput,
          [commentId]: false
        },
        expandedComments: prev[docId].expandedComments.includes(commentId) 
          ? prev[docId].expandedComments 
          : [...prev[docId].expandedComments, commentId]
      }
    }));
  };
  
  const cancelReply = (docId, commentId) => {
    setCommentState(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        showReplyInput: {
          ...prev[docId].showReplyInput,
          [commentId]: false
        },
        replyInputs: {
          ...prev[docId].replyInputs,
          [commentId]: ''
        },
        replyingTo: {
          ...prev[docId].replyingTo,
          [commentId]: null
        }
      }
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
  const [visibility, setVisibility] = useState("public")
  
  const handleCommentRating = (docId, commentId, newRating) => {
    if (!commentState[docId]) return;
    
    const comment = commentState[docId].comments.find(c => c.id === commentId);
    if (!comment) return;
    
    const oldRating = comment.rating || 0;
    
    setCommentState(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        comments: prev[docId].comments.map(c => 
          c.id === commentId 
            ? { ...c, rating: newRating } 
            : c
        ),
        ratingsHistory: [
          ...prev[docId].ratingsHistory,
          {
            timestamp: new Date().toISOString(),
            itemType: 'comment',
            itemId: commentId,
            userId: currentUser.name,
            oldRating,
            newRating
          }
        ]
      }
    }));
  };
  
  const handleReplyRating = (docId, commentId, replyId, newRating) => {
    if (!commentState[docId]) return;
    
    const comment = commentState[docId].comments.find(c => c.id === commentId);
    if (!comment) return;
    
    const reply = comment.replies.find(r => r.id === replyId);
    if (!reply) return;
    
    const oldRating = reply.rating || 0;
    
    setCommentState(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        comments: prev[docId].comments.map(c => 
          c.id === commentId 
            ? { 
                ...c, 
                replies: c.replies.map(r => 
                  r.id === replyId 
                    ? { ...r, rating: newRating } 
                    : r
                ) 
              } 
            : c
        ),
        ratingsHistory: [
          ...prev[docId].ratingsHistory,
          {
            timestamp: new Date().toISOString(),
            itemType: 'reply',
            itemId: replyId,
            commentId,
            userId: currentUser.name,
            oldRating,
            newRating
          }
        ]
      }
    }));
  };

  const [searchText, setSearchText] = useState("");

  const renderCommentSection = (docId) => {
    if (!commentState[docId]) return null;
    
    const { 
      comments, 
      newComment, 
      expandedComments, 
      showReplyInput, 
      replyInputs,
      replyingTo, 
      userInteractions
    } = commentState[docId];
    
    return (
      <div className="p-4 bg-gray-50 border-t">
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Comments for {documentsToReview.find(d => d.id === docId)?.name || "Document"}</h3>
            {comments.length > 0 && (
              <div className="text-sm text-gray-500">
                Average Rating: {calculateAverageRating(comments)}
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="mb-2">
                  <Textarea 
                    placeholder="Write a comment..." 
                    className="min-h-[80px] resize-none"
                    value={newComment}
                    onChange={(e) => handleNewCommentChange(docId, e.target.value)}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 px-3">
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
                          onClick={() => setVisibility("private")}
                        >
                          <Users className="h-3.5 w-3.5" />
                          Group Only
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-xs cursor-pointer" onClick={() => setVisibility("public")}
                          >
                            <Globe className="h-3.5 w-3.5 text-green-600" />
                            <span className="text-green-600">Public</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center gap-2 text-xs cursor-pointer" 
                            onClick={() => setVisibility("individual")}
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
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current.click()}
                      className="h-8"
                    >
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      Attachment
                    </Button>

                    {selectedFile && (
                      <div className="inline-flex items-center bg-gray-100 rounded px-2 py-1">
                        <button 
                          onClick={handleViewFile}
                          className="text-xs mr-2 hover:underline"
                        >
                          {selectedFile.file.name}
                        </button>
                        <button onClick={removeFile}>
                          <X className="h-3 w-3 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => submitComment(docId)}
                    disabled={!newComment.trim() && !selectedFile}
                    className="bg-blue-600"
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="rounded-md border" style={{ height: "calc(100vh - 300px)", maxHeight: "600px" }}>
            <div className="p-2 space-y-4">
              {comments.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center text-gray-500">
                  No comments yet. Be the first to add a comment!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={`comment-${comment.id}`} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{comment.user.name} {comment.visibility && <VisibilityBadge visibility={comment.visibility} />}</p>
                            <p className="text-sm text-muted-foreground">{comment.timestamp}</p>
                          </div>
                          <div className="flex items-center">
                            <StarRating 
                              value={comment.rating || 0}
                              onChange={(newRating) => handleCommentRating(docId, comment.id, newRating)}
                              readOnly={false}
                            />
                          </div>
                        </div>
                        <p className="mt-2">{comment.text}</p>
                        
                        {comment.attachment && (
                          <div className="mt-2">
                            <div className="mt-2 border rounded-md p-2 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <File className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm">{comment.attachment.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setViewerFilePath(comment.attachment.url);
                                  setViewerFileType(comment.attachment.type);
                                  setIsViewerPopupOpen(true);
                                }}
                                className="h-6 px-2"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          </div>
                        )}
                        
                        <div className="flex items-center mt-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant={userInteractions[comment.id]?.liked ? "default" : "ghost"}
                              size="sm"
                              onClick={() => handleLike(docId, comment.id)}
                              className={`h-8 px-2 ${userInteractions[comment.id]?.liked ? "bg-green-100 text-green-700 hover:bg-green-200" : "hover:bg-green-100 hover:text-green-700"}`}
                            >
                              <ThumbsUp className={`h-4 w-4 mr-1 text-green-700`} />
                              {comment.likes}
                            </Button>
                            <Button
                              variant={userInteractions[comment.id]?.disliked ? "default" : "ghost"}
                              size="sm"
                              onClick={() => handleDislike(docId, comment.id)}
                              className={`h-8 px-2 ${userInteractions[comment.id]?.disliked ? "bg-red-100 text-red-700 hover:bg-red-200" : "hover:bg-red-100 hover:text-red-700"}`}
                            >
                              <ThumbsDown className={`h-4 w-4 mr-1 text-red-600`} />
                              {comment.dislikes}
                            </Button>
                          </div>

                          {comment.replies.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleCommentReplies(docId, comment.id)}
                            >
                              <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                              {expandedComments.includes(comment.id) ? "Hide" : "Show"} Replies (
                              {comment.replies.length})
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReplyInput(docId, comment.id)}
                            className="ml-auto hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                                                        <Reply className="h-3.5 w-3.5 mr-1.5" />
                            Reply
                          </Button>
                        </div>
                        
                        {showReplyInput[comment.id] && (
                          <div className="mt-3 ml-8 border-l-2 pl-4 py-2">
                            <div className="flex items-start gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                                <AvatarFallback>{currentUser.initials}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                {replyingTo[comment.id]?.user && (
                                  <div className="mb-1 text-xs text-blue-600">
                                    Replying to {replyingTo[comment.id].user.name}
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-5 px-1 ml-1 text-xs" 
                                      onClick={() => {
                                        setCommentState(prev => ({
                                          ...prev,
                                          [docId]: {
                                            ...prev[docId],
                                            replyingTo: {
                                              ...prev[docId].replyingTo,
                                              [comment.id]: null
                                            },
                                            replyInputs: {
                                              ...prev[docId].replyInputs,
                                              [comment.id]: (prev[docId].replyInputs[comment.id] || '').replace(
                                                new RegExp(`^@${replyingTo[comment.id].user.name}\\s`), 
                                                ''
                                              )
                                            }
                                          }
                                        }));
                                      }}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                )}
                                <Textarea
                                  placeholder={replyingTo[comment.id]?.user 
                                    ? `Reply to ${replyingTo[comment.id].user.name}...` 
                                    : "Write a reply..."
                                  }
                                  className="min-h-[60px] resize-none text-sm"
                                  value={replyInputs[comment.id] || ''}
                                  onChange={(e) => handleReplyChange(docId, comment.id, e.target.value)}
                                />
                                <div className="flex justify-end mt-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="mr-2"
                                    onClick={() => cancelReply(docId, comment.id)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => submitReply(docId, comment.id)}
                                    disabled={!replyInputs[comment.id]?.trim()}
                                  >
                                    <Send className="h-3 w-3 mr-1.5" />
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {expandedComments.includes(comment.id) && comment.replies.length > 0 && (
                          <div className="mt-4 ml-8 border-l-2 pl-4 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={`reply-${reply.id}`} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-7 w-7">
                                    <AvatarImage
                                      src={reply.user.avatar || "/placeholder.svg"}
                                      alt={reply.user.name}
                                    />
                                    <AvatarFallback>{reply.user.initials}</AvatarFallback>
                                  </Avatar>
                                  <div className="w-full">
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">{reply.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                                      </div>
                                      <div className="flex items-center scale-75 origin-right">
                                        <StarRating 
                                          value={reply.rating || 0}
                                          onChange={(newRating) => handleReplyRating(docId, comment.id, reply.id, newRating)}
                                          readOnly={false}
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="mt-1 text-sm">
                                      {formatReplyText(reply.text, reply.taggedUser)}
                                    </div>
                                    
                                    <div className="flex items-center mt-2 mb-1">
                                      <div className="flex items-center gap-1">
                                        <Button
                                          variant={getReplyInteraction(docId, comment.id, reply.id).liked ? "default" : "ghost"}
                                          size="sm"
                                          onClick={() => handleReplyLike(docId, comment.id, reply.id)}
                                          className={`h-6 px-1.5 text-xs ${getReplyInteraction(docId, comment.id, reply.id).liked ? "bg-green-100 text-green-700 hover:bg-green-200" : "hover:bg-green-100 hover:text-green-700"}`}
                                        >
                                          <ThumbsUp className="h-3 w-3 mr-1 text-green-700" />
                                          {reply.likes}
                                        </Button>
                                        <Button
                                          variant={getReplyInteraction(docId, comment.id, reply.id).disliked ? "default" : "ghost"}
                                          size="sm"
                                          onClick={() => handleReplyDislike(docId, comment.id, reply.id)}
                                          className={`h-6 px-1.5 text-xs ${getReplyInteraction(docId, comment.id, reply.id).disliked ? "bg-red-100 text-red-700 hover:bg-red-200" : "hover:bg-red-100 hover:text-red-700"}`}
                                        >
                                          <ThumbsDown className="h-3 w-3 mr-1 text-red-600" />
                                          {reply.dislikes}
                                        </Button>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs h-6 px-2 ml-auto"
                                        onClick={() => toggleReplyToReply(docId, comment.id, reply.id, reply.user)}
                                      >
                                        <Reply className="h-3 w-3 mr-1" />
                                        Reply
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  };

  const renderGroupedDocuments = () => {
    const groupedDocuments = documentsToReview.slice(0, 3);
    const otherDocuments = documentsToReview.slice(3);
    
    return (
      <div className="flex-1 overflow-y-auto">
        {/* Group for Airline Defence Maintenance */}
        <div className="border-b border-gray-200">
          <div 
            className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors bg-blue-50"
            onClick={() => toggleCommentExpansion('group-airline')}
          >
            <div className="flex-1">
              <h4 className="font-medium flex items-center">
                Airline Defence Maintenance
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {groupedDocuments.length} reference contents
                </span>
              </h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 whitespace-nowrap"
            >
              {expandedCommentRows.includes('group-airline') ? (
                <ChevronUp className="h-4 w-4 " />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Show grouped documents when expanded */}
          {expandedCommentRows.includes('group-airline') && (
            <div className="px-2 pb-2 bg-blue-50">
              {groupedDocuments.map((doc) => (
                <div key={doc.id} className="mb-3 bg-white rounded-lg shadow-sm">
                  <div 
                    className="p-3 flex justify-between items-center cursor-pointer"
                    onClick={() => setSearchText(doc.referenceText)}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-600 mt-1">{doc.referenceText.substring(0, 100)}...</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 whitespace-nowrap"
                      onClick={() => toggleCommentExpansion(doc.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {commentState[doc.id]?.comments.length || 0}
                      {expandedCommentRows.includes(doc.id) ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Show comments when expanded */}
                  {expandedCommentRows.includes(doc.id) && renderCommentSection(doc.id)}
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* Other individual documents */}
        {otherDocuments.map((doc) => (
          <div key={doc.id} className="border-b border-gray-200">
            <div 
              className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCommentExpansion(doc.id)}
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 truncate mt-1">
                  {doc.referenceText.substring(0, 50)}...
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                {commentState[doc.id]?.comments.length || 0}
                {expandedCommentRows.includes(doc.id) ? (
                  <ChevronUp className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </Button>
            </div>
            
            {/* Show full comments when expanded */}
            {expandedCommentRows.includes(doc.id) && renderCommentSection(doc.id)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
      data-overlay="true"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-11/12 h-5/6 rounded-lg overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <h3 className="font-medium text-lg truncate max-w-3xl">
            {filename || "Document"}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              onClick={handlePrint}
              title="Print document"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              onClick={handleOpenInNewTab}
              title="Open in new tab"
            >
              <ExternalLink className="h-5 w-5" />
            </button>
            <button
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              onClick={onClose}
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Document Section */}
          <div
            className={`${
              chatOpen ? "w-1/3" : "w-2/3"
            } transition-all duration-300 overflow-auto border-r border-gray-200`}
          >
           
              <WebViewerComponent searchText={searchText}/>
            
          </div>

          {/* Document References Section */}
          <div className={`${
            chatOpen ? "w-1/3" : "w-1/2"
          } transition-all duration-300 flex flex-col overflow-hidden border-r border-gray-200`}
          >
            <div className="bg-blue-600 text-white p-3 shadow-md sticky top-0 z-10">
              <h3 className="font-medium text-lg">Review Text References</h3>
            </div>
            
            {renderGroupedDocuments()}
          </div>

          {/* Chatbot Section */}
          {chatOpen && (
            <div className="w-1/3 border-l border-gray-200 flex flex-col">
              <div className="p-3.5 bg-blue-600 text-white font-medium sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                  <MessagesSquare className="h-5 w-5" />
                  <span>Delphi AI Assistant</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-3 ${
                      message.sender === "user" ? "ml-8" : "mr-8"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg shadow ${
                        message.sender === "user"
                          ? "bg-blue-50 ml-auto"
                          : "bg-white"
                      }`}
                    >
                      <p
                        className={`${
                          message.sender === "user"
                            ? "text-blue-800"
                            : "text-blue-600"
                        } font-medium`}
                      >
                        {message.sender === "user" ? "You" : "Delphi AI"}
                      </p>
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="mb-3 mr-8">
                    <div className="bg-white p-3 rounded-lg shadow">
                      <p className="text-blue-600 font-medium">Delphi AI</p>
                      <div className="flex space-x-1 mt-1">
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ask about this document..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                  />
                  <button
                    className="p-2 px-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onClick={handleSendMessage}
                    disabled={inputValue.trim() === "" || isTyping}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Delphi AI Button */}
        {/* {!chatOpen && (
          <button
            onClick={toggleChat}
            className="absolute bottom-20 right-20 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors z-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            style={{ width: "54px", height: "54px" }}
          >
            <MessagesSquare className="h-6 w-6" />
          </button>
        )} */}

        {/* Button to close chat if open */}
        {chatOpen && (
          <button
            onClick={toggleChat}
            className="absolute bottom-8 right-8 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors z-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            style={{ width: "54px", height: "54px" }}
          >
            <X className="h-6 w-6" />
          </button>
        )}

        {/* File Viewer Popup */}
        {isViewerPopupOpen && (
          <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
            <div className="bg-white w-11/12 h-5/6 rounded-lg overflow-hidden flex flex-col shadow-2xl">
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                <h3 className="font-medium text-lg truncate max-w-3xl">
                  Document Viewer
                </h3>
                <button
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  onClick={() => setIsViewerPopupOpen(false)}
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4">
                {viewerFileType === 'pdf' ? (
                  <iframe 
                    src={viewerFilePath} 
                    className="w-full h-full" 
                    frameBorder="0"
                  />
                ) : viewerFileType === 'docx' || viewerFileType === 'doc' ? (
                  <WebViewerComponent searchText={searchText} />
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
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.open(viewerFilePath, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
};