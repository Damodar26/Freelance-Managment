"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Task {
  id: string
  status: string
  title: string
  description: string
}

export default function Tasks() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId") // Get projectId from URL params
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) return
      try {
        const response = await fetch(`http://localhost/8000/api/projects/${projectId}/tasks`)
        if (!response.ok) throw new Error("Failed to fetch tasks")

        const data = await response.json()
        setTasks(data)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      }
    }

    fetchTasks()
  }, [projectId])

  const handleCompleteTask = async (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: task.status === "pending" ? "completed" : "pending" } : task
      )
    )
  }

  const filteredTasks = tasks.filter((task) =>
    activeTab === "pending" ? task.status === "pending" : task.status === "completed"
  )

  const TaskList = ({
    tasks,
    onComplete,
  }: {
    tasks: Task[]
    onComplete: (id: string) => void
  }) => (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-500">{task.description}</p>
            </div>
            <Button onClick={() => onComplete(task.id)} className="bg-[#00E054] hover:bg-[#00E054]/90 text-white">
              {task.status === "pending" ? "Complete" : "Reopen"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="pending" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <TaskList tasks={filteredTasks} onComplete={handleCompleteTask} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
