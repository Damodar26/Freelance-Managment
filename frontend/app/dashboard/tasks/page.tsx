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
  const projectId = searchParams.get("projectId") 
  console.log(projectId)// Get projectId from URL params
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) return

      const authToken = localStorage.getItem("authToken")
      if (!authToken) {
        console.error("No auth token found")
        return
      }

      try {
        const response = await fetch(`http://localhost:8000/api/tasks/${projectId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        })
        console.log("API Response:", response);
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        console.log("Fetched Tasks:", data);
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
        task.id === id ? { ...task, status: task.status.toLowerCase() === "pending" ? "Done" : "Pending" } : task
      )
    )
  }

  const filteredTasks = tasks.filter((task) =>
    activeTab === "pending" ? task.status.toLowerCase() === "pending" : task.status.toLowerCase() === "done"
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
              {task.status.toLowerCase() === "pending" ? "Complete" : "Reopen"}
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
