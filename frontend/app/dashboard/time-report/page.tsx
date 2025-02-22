"use client"

import { create } from "zustand"
import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProjectStore {
  timeEntries: TimeEntry[]
}

interface TimeEntry {
  id: string
  duration: number // in minutes
  description: string
  projectId: string
  createdAt: Date
}

export const useProjectStore = create<ProjectStore>(() => ({
  timeEntries: [
    {
      id: "1",
      duration: 270, // 4h 30m
      description: "UI Implementation",
      projectId: "1",
      createdAt: new Date(),
    },
    // Add more initial time entries
  ],
}))

export default function TimeReport() {
  const { timeEntries } = useProjectStore()
  const [timeFilter, setTimeFilter] = useState("daily")

  const calculateTotalTime = (period: "today" | "week" | "month" | "total") => {
    const now = new Date()
    const filteredEntries = timeEntries.filter((entry: TimeEntry) => {
      const entryDate = new Date(entry.createdAt)
      switch (period) {
        case "today":
          return entryDate.toDateString() === now.toDateString()
        case "week":
          const weekAgo = new Date(now.setDate(now.getDate() - 7))
          return entryDate >= weekAgo
        case "month":
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
          return entryDate >= monthAgo
        case "total":
          return true
      }
    })

    const totalMinutes = filteredEntries.reduce((acc, entry) => acc + entry.duration, 0)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const filteredEntries = useMemo(() => {
    const now = new Date()
    switch (timeFilter) {
      case "daily":
        return timeEntries.filter((entry: TimeEntry) => new Date(entry.createdAt).toDateString() === now.toDateString())
      case "weekly":
        const weekAgo = new Date(now.setDate(now.getDate() - 7))
        return timeEntries.filter((entry: TimeEntry) => new Date(entry.createdAt) >= weekAgo)
      case "monthly":
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
        return timeEntries.filter((entry: TimeEntry) => new Date(entry.createdAt) >= monthAgo)
      default:
        return timeEntries
    }
  }, [timeEntries, timeFilter])

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6 bg-[#f5faf5]">
          <h3 className="text-sm font-medium text-gray-500">Today</h3>
          <p className="text-2xl font-bold">{calculateTotalTime("today")}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">This Week</h3>
          <p className="text-2xl font-bold">{calculateTotalTime("week")}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">This Month</h3>
          <p className="text-2xl font-bold">{calculateTotalTime("month")}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total</h3>
          <p className="text-2xl font-bold">{calculateTotalTime("total")}</p>
        </Card>
      </div>

      <Tabs defaultValue="daily" onValueChange={setTimeFilter}>
        <TabsList className="flex space-x-4 mb-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <div className="divide-y">
          {filteredEntries.map((entry: TimeEntry) => (
            <div key={entry.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{entry.description}</p>
                <p className="text-sm text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {Math.floor(entry.duration / 60)}h {entry.duration % 60}m
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

