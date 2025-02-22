"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", projects: 4, tasks: 20, revenue: 3000 },
  { name: "Feb", projects: 3, tasks: 18, revenue: 2800 },
  { name: "Mar", projects: 5, tasks: 25, revenue: 3500 },
  { name: "Apr", projects: 4, tasks: 22, revenue: 3200 },
  { name: "May", projects: 6, tasks: 30, revenue: 4000 },
  { name: "Jun", projects: 5, tasks: 28, revenue: 3800 },
]

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="projects" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line yAxisId="left" type="monotone" dataKey="tasks" stroke="#82ca9d" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
        <TabsContent value="projects">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Project Analytics</h2>
            {/* Add project-specific analytics here */}
          </Card>
        </TabsContent>
        <TabsContent value="tasks">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Task Analytics</h2>
            {/* Add task-specific analytics here */}
          </Card>
        </TabsContent>
        <TabsContent value="revenue">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Revenue Analytics</h2>
            {/* Add revenue-specific analytics here */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

