"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

// ✅ Define TypeScript Interfaces for API Data
interface ProjectAnalytics {
  _id: string;
  name: string;
  totalHoursWorked: number;
  totalTasks: number;
}

interface TaskAnalytics {
  _id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  status: string;
  dueDate: string; // New: For deadline tracking
}

// ✅ API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function Analytics() {
  const [projectAnalytics, setProjectAnalytics] = useState<ProjectAnalytics[]>([]);
  const [taskAnalytics, setTaskAnalytics] = useState<TaskAnalytics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const projectResponse = await axios.get<{ projects: ProjectAnalytics[] }>(`${API_BASE_URL}/projects/analytics`);
        const taskResponse = await axios.get<{ tasks: TaskAnalytics[] }>(`${API_BASE_URL}/tasks/analytics`);

        setProjectAnalytics(projectResponse.data.projects || []);
        setTaskAnalytics(taskResponse.data.tasks || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // ✅ Transform Data for Charts
  const priorityData = [
    { name: "High", value: taskAnalytics.filter((task) => task.priority === "High").length },
    { name: "Medium", value: taskAnalytics.filter((task) => task.priority === "Medium").length },
    { name: "Low", value: taskAnalytics.filter((task) => task.priority === "Low").length },
  ];

  const colors = ["#ff4d4d", "#ffcc00", "#66cc66"]; // High (Red), Medium (Yellow), Low (Green)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        {/* 📌 Performance Overview (Line Chart) */}
        <TabsContent value="overview">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={projectAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalProjects" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="totalTasks" stroke="#82ca9d" />
                <Line type="monotone" dataKey="totalHoursWorked" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* 📌 Project Analytics (Bar Chart) */}
        <TabsContent value="projects">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Project Analytics</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={projectAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalTasks" fill="#8884d8" />
                <Bar dataKey="totalHoursWorked" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* 📌 Task Analytics (Pie Chart & Deadline List) */}
        <TabsContent value="tasks">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Task Analytics</h2>

            {/* 🥧 Pie Chart for Task Priority */}
            <div className="flex justify-center">
              <ResponsiveContainer width={300} height={300}>
                <PieChart>
                  <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 📅 Task Deadlines */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
              <ul className="list-disc pl-6">
                {taskAnalytics
                  .filter((task) => new Date(task.dueDate) > new Date()) // Show only upcoming tasks
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) // Sort by due date
                  .map((task) => (
                    <li key={task._id}>
                      <strong>{task.title}</strong>: {new Date(task.dueDate).toLocaleDateString()} ({task.priority} Priority)
                    </li>
                  ))}
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
