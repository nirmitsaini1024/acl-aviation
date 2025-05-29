import { useState } from "react";
import {
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Users,
  User,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom"; // ✅ React Router instead of next/link

export default function CrmDashboard() {
  // ✅ Plain JS state (no TypeScript annotation)
  const [hoveredCard, setHoveredCard] = useState(null);

  // Cards for Documents View
  const documentCards = [
    {
      id: "in-review",
      title: "In Review",
      count: 12,
      icon: Clock,
      iconColor: "text-blue-500",
    },
    {
      id: "reference",
      title: "Reference Documents",
      count: 8,
      icon: FileText,
      iconColor: "text-blue-500",
    },
    {
      id: "approved",
      title: "Approved",
      count: 20,
      icon: CheckCircle,
      iconColor: "text-blue-500",
    },
    {
      id: "deactivated",
      title: "Deactivated",
      count: 3,
      icon: XCircle,
      iconColor: "text-red-500", // Updated to red
    },
  ];

  // Cards for Tasks View
  const taskCards = [
    {
      id: "group-tasks",
      title: "Group Tasks",
      count: 5,
      icon: Users,
      iconColor: "text-blue-500",
    },
    {
      id: "user-tasks",
      title: "User Tasks",
      count: 10,
      icon: User,
      iconColor: "text-blue-500",
    },
    {
      id: "expired-tasks",
      title: "Expired Tasks",
      count: 2,
      icon: AlertTriangle,
      iconColor: "text-red-500", // Updated to red
    },
  ];

  return (
    <div className="bg-gray-50/30 pr-6 pl-6 pt-2">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome Back, <span className="font-semibold text-blue-600">John Doe</span>
        </h1>
        <p className="text-md font-semibold text-blue-600">Airport Security Officer</p>
      </div>

      {/* Documents View Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-blue-600 mb-5 border-l-4 border-blue-500 pl-3">
          Documents View
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {documentCards.map((card) => (
            <Link
              to={
                card.id === "approved"
                  ? "/doc-center?tab=approved"
                  : card.id === "reference"
                  ? "/doc-center?tab=refdoc"
                  : card.id === "in-review"
                  ? "/doc-center?tab=active"
                  : card.id === "deactivated"
                  ? "/doc-center?tab=disapproved"
                  : "/doc-center"
              }
              key={card.id}
              className="block"
            >
              <div
                className={`bg-white hover:bg-blue-200 rounded-xl p-6 flex items-start border border-gray-200 transition-all duration-300 h-full relative group ${
                  hoveredCard === card.id
                    ? "shadow-lg translate-y-[-4px] border-blue-300"
                    : "shadow-md"
                }`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`mr-4 ${card.iconColor}`}>
                  <card.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-700">{card.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {card.count}
                  </p>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-500 flex items-center gap-1 text-sm font-medium">
                    View <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tasks View Section */}
      <div>
        <h2 className="text-xl font-semibold text-blue-600 mb-5 border-l-4 border-blue-500 pl-3">
          Tasks View
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {taskCards.map((card) => (
            <Link to={
              card.id === "group-tasks"
                ? "/navigate-document?tab=group"
                : card.id === "user-tasks"
                ? "/navigate-document?tab=user"
                : card.id === "expired-tasks"
                ? "/navigate-document?tab=all"
                : "/navigate-document"
            }
            key={card.id} className="block">

              <div
                className={`bg-white hover:bg-blue-200 rounded-xl p-6 flex items-start border border-gray-200 transition-all duration-300 h-full relative group ${
                  hoveredCard === card.id
                    ? "shadow-lg translate-y-[-4px] border-blue-300"
                    : "shadow-md"
                }`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`mr-4 ${card.iconColor}`}>
                  <card.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-700">{card.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {card.count}
                  </p>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-500 flex items-center gap-1 text-sm font-medium">
                    View <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
