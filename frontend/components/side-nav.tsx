import Link from "next/link"
import { BarChart, Calendar, Clock, FileText, Home, Settings, Wallet } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SideNav() {
  return (
    <div className="w-64 border-r bg-[#00E054] bg-opacity-50 p-4 flex flex-col min-h-screen">
      <div className="flex items-center mb-8">
        <span className="font-bold text-xl">FreelanceFlow</span>
      </div>
      <nav className="space-y-2 flex-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-muted"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/dashboard/projects"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-muted"
        >
          <FileText className="h-4 w-4" />
          Projects
        </Link>
        <Link
          href="/dashboard/time"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-muted"
        >
          <Clock className="h-4 w-4" />
          Time Tracking
        </Link>
        <Link
          href="/dashboard/finances"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-muted"
        >
          <Wallet className="h-4 w-4" />
          Finances
        </Link>
        <Link
          href="/dashboard/Calendar"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-muted"
        >
          <Calendar className="h-4 w-4" />
          Calendar
        </Link>
        <Link
          href="/dashboard/Analytics"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-muted"
        >
          <BarChart className="h-4 w-4" />
          Analytics
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-muted"
        >
          <Settings className="h-4 w-4" />
         Log Out
        </Link>
      </nav>
      <div className="mt-auto pt-4 border-t">
        <div className="flex items-center gap-3 px-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Smith</span>
            <span className="text-xs text-gray-500">Premium Plan</span>
          </div>
        </div>
      </div>
    </div>
  )
}

