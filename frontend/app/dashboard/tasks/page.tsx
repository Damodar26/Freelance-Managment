"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { create } from "zustand"

interface ProjectStore {
  tasks: Task[]
  completeTask: (id: string) => void
  addTask: (task: Task) => void
}

interface Task {
  id: string
  status: string
  title: string
  description: string
}

export const useProjectStore = create<ProjectStore>((set) => ({
  tasks: [
    {
      id: "1",
      status: "pending",
      title: "Design System Updates",
      description: "Update the design system components",
    },
    // Add more initial tasks
  ],
  completeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: t.status === "pending" ? "completed" : "pending" } : t,
      ),
    })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
}))

export default function Tasks() {
  const { tasks, completeTask, addTask } = useProjectStore() as ProjectStore
  const [activeTab, setActiveTab] = useState("pending")

  const filteredTasks = tasks.filter((task) =>
    activeTab === "pending" ? task.status === "pending" : task.status === "completed",
  )

  const handleCompleteTask = (id: string) => {
    completeTask(id)
  }

  const TaskList = ({
    tasks,
    onComplete,
  }: {
    tasks: Array<{ id: string; status: string; title: string; description: string }>
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

