import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Bell, LogOut, Menu, User, AlertCircle, Edit, Home, CircleHelp } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import HeaderHelp from "./header-help"

export function DashboardHeader({ user }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const notificationCount = 4 // Set your notification count here

  const handleLogout = () => {
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center border-b bg-white px-4 md:px-6 w-full">
      <Button variant="ghost" className={"hover:text-blue-600 hover:bg-blue-100"} onClick={() => navigate('/landing-page')}>
        <Home size={16} />
        Home
      </Button>
      <div className="flex w-full justify-center font-medium text-blue-600 text-lg">Micky Mouse Airport Authority</div>
      <div className="ml-auto flex items-center gap-2">

        {/* Notification Bell with Simple Tooltip */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative group">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-xs font-semibold text-white bg-blue-600 rounded-full">
                    {notificationCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-black bg-gray-100 border border-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                Notifications
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-100"></div>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 mr-20 rounded-md p-0 overflow-hidden">
            <div className="border-b px-4 bg-blue-700 py-3">
              <h4 className="text-sm font-semibold text-white">Notifications</h4>
            </div>
            <div className="max-h-80 overflow-auto flex flex-col">
              {/* Expiring Document Review Alert */}
              <div className="flex items-start gap-3 border-b p-4">
                <div className="h-8 w-8 rounded-full bg-red-200 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Document Review</span> will expire in 2 days.
                  </p>
                  <p className="text-xs text-muted-foreground">May 12, 2025, 9:00 AM</p>
                </div>
              </div>

              {/* New CCT/Modifications for Review */}
              <div className="flex items-start gap-3 border-b p-4">
                <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                  <Edit className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">New CCT/Modifications</span> arrived for review.
                  </p>
                  <p className="text-xs text-muted-foreground">May 12, 2025, 8:45 AM</p>
                </div>
              </div>

              {/* Notification 3 */}
              <div className="flex items-start gap-3 border-b p-4">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Mike Johnson</span> shared a document with you
                  </p>
                  <p className="text-xs text-muted-foreground">May 11, 2025, 3:22 PM</p>
                </div>
              </div>

              {/* Notification 4 */}
              <div className="flex items-start gap-3 border-b p-4">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Team Admin</span> added you to a new project
                  </p>
                  <p className="text-xs text-muted-foreground">May 10, 2025, 11:15 AM</p>
                </div>
              </div>

              {/* "See all notifications" link */}
              <Link
                to="/dashboard/notifications"
                className="text-sm text-blue-600 hover:underline text-center p-4 mt-auto"
              >
                See all notifications
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* Help Icon with Simple Tooltip */}
        <div className="relative group">
          <HeaderHelp />
          {/* Tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-black bg-gray-100 border border-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            Help
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-100"></div>
          </div>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user?.name || 'John Doe'}</p>
                <p className="text-sm text-muted-foreground">{`${user?.email || 'user@gmail.com'}`}</p>
              </div>
            </div >
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/personal-page">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}