import React, { useState, useRef, useEffect } from "react";
import DolphiLogo from "../assets/dolphi-logo.png";
import { MessagesSquare, Eye } from "lucide-react";
import WebViewerComponent from "./docx-viewer";
import Loader from "./document-loader";

const BotUI = ({
  isIframe = false,
  defaultOpen = false,
  customTitle = null,
  initialMessage = null,
  isBotOpen, setIsBotOpen
}) => {
  const [messages, setMessages] = useState([
    {
      text:
        initialMessage ||
        "Welcome! I can provide assistance about airport security protocols. How may I assist you today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWebViewer, setShowWebViewer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Hardcoded search text for WebViewer
  const [searchText, setSearchState] = useState();

  // Predefined Q&A pairs
  const qaPairs = [
    {
      keywords: [
        "asc",
        "role",
        "responsibilities",
        "airport security coordinator",
      ],
      response: `Based on the provided context, here's the information about the ASC role and responsibilities:

ASC Role and Responsibilities
The Airport Security Coordinator (ASC) is responsible for:
* General administration of the Kinexis Security Program (ASP)
* Serving as the Airport operator's 24-hour primary and immediate contact for security-related activities and communications with the TSA, FAA, and Airport tenants
* General oversight of Airport security functions, including managerial elements, as required to maintain Airport security under 49 CFR Part 1542
* Being available to TSA on a 24-hour basis
* Reviewing with sufficient frequency all security-related functions required of the Airport to ensure that all are effective and in compliance with 49 CFR 1542, the Kinexis Security Program (ASP) document, and applicable Security Directives

The primary ASC is the Airport Operations Security Coordinator, who is available 24 hours a day, 7 days a week.`,
      fileName: "ASC_Roles_Responsibilities.pdf",
    },
    {
      keywords: ["hii", "hello", "hi", "hey"],
      response: `Hello! I'm Delphi, your AI Assistant for airport security information.

I can provide information about:
* ASC roles and responsibilities
* Badge audit procedures
* Badge elements
* SIDA and AOA definitions

How can I help you today?`,
      fileName: "Welcome_Message.txt",
    },
    {
      keywords: ["badge audit", "procedure", "audit"],
      response: `Based on the provided context, I can identify the following information about Badge Audit procedures:

The airport operator conducts random ID media audits as mentioned in the section "Random ID Media Audit." The airport (KMMW) must notify the FSD (Federal Security Director) or designee in writing of the date the random ID media audit will start, no less than 5 calendar days prior to the start of the audit.

Additionally, in section 4.2.3 ACCESS CONTROL SYSTEM AUDITS, it states: "The Airport shall conduct an annual AOA badge and key audit to ensure that all Airport-issued access media are accounted for. The access control system and associated databases are controlled by computer systems, access to these systems are controlled by personalized user access credentials."

These appear to be the main badge audit procedures mentioned in the provided context.`,
      fileName: "Kinexis_Security_Program.pdf",
    },
    {
      keywords: ["badge elements", "badge element", "element"],
      response: `Based on the provided context, here is the correct answer:

Badge Elements
The front of identification media includes:
* Airport logo (3-letter code)
* Full-face photo, name, employer, and unique identification badge number
* Badge type indicating access and movement privileges
* Expiration date (minimum of one quarter inch in height)

The back of identification media includes:
* Airport's return address and phone number
* Security Notification/Property of KMMW

Endorsements may include:
* Escort privileges endorsement
* ESCORT Driver privileges endorsements
* MOVEMENT
* NON-MOVEMENT`,
      fileName: "Badge_Elements.pdf",
    },
    {
      keywords: [
        "sida",
        "aoa",
        "definitions",
        "security identification display area",
        "air operations area",
      ],
      response: `Based on the provided context, here is the correct answer:

**SIDA (Security Identification Display Area):** A portion of an airport specified in the airport security program, in which security measures specified in this part are carried out. This area includes the Secured Area and may include other areas of the airport.

**AOA (Air Operations Area):** A portion of an airport, specified in the airport security program, in which security measures specified in this part are carried out. This area includes aircraft movement areas, aircraft parking areas, loading ramps, and safety areas for use by aircraft regulated under 49 CFR Part 1544 or 1546, and any adjacent areas (such as general aviation) that are not separated by adequate security systems, measures, or procedures. This area does not include the Secured Area.`,
      fileName: "SIDA_AOA_Definitions.pdf",
    },
  ];

  const toggleChat = () => {
    setIsBotOpen(!isBotOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Find response based on keywords in the user's input
  const findResponse = (userInput) => {
    const inputLower = userInput.toLowerCase();

    for (const pair of qaPairs) {
      // Check if any of the keywords are present in the user's input
      if (
        pair.keywords.some((keyword) =>
          inputLower.includes(keyword.toLowerCase())
        )
      ) {
        return {
          text: pair.response,
          fileName: pair.fileName,
        };
      }
    }

    // Default response if no keywords match
    return {
      text: "I don't have specific information on that topic. You can ask about ASC roles and responsibilities, Badge Audit procedures, Badge elements, or SIDA and AOA definitions.",
      fileName: "General_Response.txt",
    };
  };

  const handleCloseWebViewer = () => {
    setShowWebViewer(false);
    setSearchState("");
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const userInput = input;
    const newMessages = [...messages, { text: userInput, isBot: false }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay - shorter for more professional experience
    setTimeout(() => {
      // Find the appropriate response based on the user's input
      const botResponse = findResponse(userInput);

      setMessages([
        ...newMessages,
        {
          text: botResponse.text,
          isBot: true,
          fileName: botResponse.fileName,
        },
      ]);
      setIsTyping(false);
    }, 1000); // Reduced typing delay for better UX
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    let timer;

    if (showWebViewer) {
      timer = setTimeout(() => {
        setSearchState(
          "ACCESS CONTROL SYSTEM AUDITS The Airport shall conduct an annual AOA badge and key audit to ensure that all Airport-issued access media are accounted for. The access control system and associated databases are controlled by computer systems, access to these systems are controlled by personalized user access credentials."
        );
        setIsLoading(false);
      }, 10000); // delay for complete render of the document
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showWebViewer]);

  // Adjust styling based on iframe mode
  const containerStyle = isIframe
    ? { position: "relative", width: "100%", height: "100%" }
    : { position: "fixed", bottom: "20px", right: "20px", zIndex: 50 };

  console.log(isLoading);

  return (
    <div
      className={`font-sans ${isIframe ? "bot-iframe" : ""}`}
      style={containerStyle}
    >
      {!isBotOpen && (
        <button
          onClick={toggleChat}
          className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-blue-500 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessagesSquare className="w-[25px] h-[25px] text-white object-contain" />
        </button>
      )}

      {isBotOpen && (
        <div
          className={`bg-white rounded-lg border shadow-lg flex flex-col overflow-hidden ${
            isIframe ? "w-[340px] h-[500px]" : "w-[500px] h-[600px]"
          }`}
        >
          {/* Header - Updated with more professional styling */}
          <div className="bg-slate-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={DolphiLogo}
                alt="Bot Logo"
                className="w-7 h-7 rounded-full"
              />
              <span className="font-semibold text-white">
                {customTitle || "Delphi - Your Assistant"}
              </span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-300 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Chat Body - Improved styling */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index}>
                <div
                  className={`flex items-start gap-2 ${
                    msg.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  {msg.isBot && (
                    <img
                      src={DolphiLogo}
                      alt="Bot"
                      className="w-8 h-8 rounded-full object-cover mt-1 border-2 border-slate-200"
                    />
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[80%] break-words text-sm ${
                      msg.isBot
                        ? "bg-slate-200 text-slate-800"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                </div>

                {/* File name and eye button for bot messages */}
                {msg.isBot && msg.fileName && (
                  <div className="flex items-center justify-start gap-2 mt-1 ml-12 text-xs text-gray-500">
                    <span>{msg.fileName}</span>
                    <button
                      onClick={() => {
                        setShowWebViewer(true);
                        setIsLoading(true);
                      }}
                      className="text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start justify-start gap-2">
                <img
                  src={DolphiLogo}
                  alt="Typing..."
                  className="w-8 h-8 rounded-full mt-1 border-2 border-slate-200"
                />
                <div className="bg-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm">
                  <div className="flex space-x-1">
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Enhanced styling */}
          <div className="border-t px-4 py-3 bg-white flex items-center">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* WebViewer Dialog */}
      {showWebViewer && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-4/5 h-4/5 flex flex-col">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Document Viewer</h3>
              {isLoading && (
                <Loader text="Loading document, please wait..." />
              )}
              <button
                onClick={handleCloseWebViewer}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <WebViewerComponent searchText={searchText} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotUI;