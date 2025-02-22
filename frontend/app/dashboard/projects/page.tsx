"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useProjectStore } from "@/lib/store/projectStore"

interface Project {
  id: string
  name: string
  deadline: string
  tasks: string
  progress: number
  team: string[]
  status: "active" | "completed" | "archived"
}

interface Task {
  id: string
  name: string
  project: string
  deadline: string
  priority: "High" | "Medium" | "Low"
  status: "pending" | "completed"
}

interface TimeEntry {
  id: string
  project: string
  task: string
  duration: string
  date: string
}

export default function Projects() {
  const router = useRouter()
  const { projects, removeProject, moveProject } = useProjectStore()

  const handleTabChange = (value: string) => {
    switch (value) {
      case "all":
        router.push("/dashboard/projects/all")
        break
      case "active":
        router.push("/dashboard/projects")
        break
      case "completed":
        router.push("/dashboard/projects/completed")
        break
      case "archived":
        router.push("/dashboard/projects/archived")
        break
    }
  }

  const handleViewAll = () => {
    router.push("/dashboard/projects/active")
  }

  const handleViewTasks = () => {
    router.push("/dashboard/tasks")
  }

  const handleTimeReport = () => {
    router.push("/dashboard/time-report")
  }

  const handleProjectAction = (action: string, projectIndex: number) => {
    const project = projects[projectIndex]
    switch (action) {
      case "moveUp":
        moveProject(project.id, "up")
        break
      case "moveDown":
        moveProject(project.id, "down")
        break
      case "remove":
        removeProject(project.id)
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative w-[500px] h-[500px] mb-4">
        <Image
          src="/Man trying to keep a work life balance.png"
          alt="Projects Dashboard Banner"
          fill
          className="object-cover rounded-md"
          priority
        />
      </div>
      <div className="flex justify-between items-center">
        <Tabs defaultValue="active" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              All Projects
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Archived
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Link href="/dashboard/projects/new">
          <Button className="bg-[#00E054] hover:bg-[#00E054]/90 text-white">New Project</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#f5faf5] border-none p-6 transition-all hover:shadow-md">
          <h3 className="font-semibold mb-2">Active Projects</h3>
          <p className="text-2xl font-semibold mb-2">8</p>
          <p className="text-sm text-gray-600">projects in progress</p>
          <Button
            onClick={handleViewAll}
            className="mt-4 bg-[#00E054] hover:bg-[#00E054]/90 text-white transition-all duration-200 hover:scale-105"
          >
            View All
          </Button>
        </Card>
        <Card className="bg-[#f5faf5] border-none p-6 transition-all hover:shadow-md">
          <h3 className="font-semibold mb-2">Open Tasks</h3>
          <p className="text-2xl font-semibold mb-2">12</p>
          <p className="text-sm text-gray-600">tasks due this week</p>
          <Button
            onClick={handleViewTasks}
            className="mt-4 bg-[#00E054] hover:bg-[#00E054]/90 text-white transition-all duration-200 hover:scale-105"
          >
            View Tasks
          </Button>
        </Card>
        <Card className="bg-[#f5faf5] border-none p-6 transition-all hover:shadow-md">
          <h3 className="font-semibold mb-2">Hours Tracked</h3>
          <p className="text-2xl font-semibold mb-2">32h</p>
          <p className="text-sm text-gray-600">this week</p>
          <Button
            onClick={handleTimeReport}
            className="mt-4 bg-[#00E054] hover:bg-[#00E054]/90 text-white transition-all duration-200 hover:scale-105"
          >
            Time Report
          </Button>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Projects</h2>
        <div className="bg-white rounded-lg border">
          {[
            {
              name: "Website Redesign",
              deadline: "Due in 5 days",
              tasks: "8 tasks remaining",
            },
            {
              name: "Mobile App Development",
              deadline: "Due in 2 weeks",
              tasks: "15 tasks remaining",
            },
            {
              name: "Brand Identity",
              deadline: "Due tomorrow",
              tasks: "3 tasks remaining",
            },
          ].map((project, i) => (
            <div key={i} className={`p-4 ${i !== 2 ? "border-b" : ""} hover:bg-gray-50 transition-colors`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-500">
                    {project.deadline} • {project.tasks}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="p-2 hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={() => handleProjectAction("moveUp", i)} className="cursor-pointer">
                        Move Up
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleProjectAction("moveDown", i)} className="cursor-pointer">
                        Move Down
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleProjectAction("remove", i)}
                        className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button className="flex items-center gap-1 hover:bg-gray-100">
                    Select
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
        <div className="bg-white rounded-lg border">
          {[
            {
              name: "Logo Design",
              deadline: "Tomorrow",
              priority: "High Priority",
              status: "In Progress",
            },
            {
              name: "UI Wireframes",
              deadline: "In 2 days",
              priority: "Medium Priority",
              status: "In Review",
            },
            {
              name: "Frontend Development",
              deadline: "In 4 days",
              priority: "High Priority",
              status: "Not Started",
            },
          ].map((task, i) => (
            <div key={i} className={`p-4 ${i !== 2 ? "border-b" : ""}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{task.name}</h3>
                  <p className="text-sm text-gray-500">
                    {task.deadline} • {task.priority} • {task.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="p-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  <Button className="flex items-center gap-1">
                    Select
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

