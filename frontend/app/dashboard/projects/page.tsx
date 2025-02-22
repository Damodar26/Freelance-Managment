"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  name: string;
  deadline: string;
  tasks: number;
  progress: number;
  team: string[];
  status: "active" | "completed" | "archived";
}

interface Task {
  id: string;
  name: string;
  project: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
  status: "pending" | "completed";
}

interface TimeEntry {
  id: string;
  project: string;
  task: string;
  duration: string;
  date: string;
}

export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const [projectsRes, tasksRes, timeRes] = await Promise.all([
          fetch(`http://localhost:8000/api/projects`, { method: "GET", headers }),
          fetch(`http://localhost:8000/api/tasks`, { method: "GET", headers }),
          fetch(`http://localhost:8000/api/projects/analytics`, { method: "GET", headers }),
        ]);

        if (!projectsRes.ok) throw new Error(`Projects API Error: ${projectsRes.status}`);
        if (!tasksRes.ok) throw new Error(`Tasks API Error: ${tasksRes.status}`);
        if (!timeRes.ok) throw new Error(`Time API Error: ${timeRes.status}`);

        const projects = await projectsRes.json();
        const tasks = await tasksRes.json();
        const time = await timeRes.json();

        console.log("Fetched projects:", projects);
        console.log("Fetched tasks:", tasks);
        console.log("Fetched time:", time);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      /*try {
        const token = localStorage.getItem("authToken");
        // Retrieve the token from localStorage (or another secure storage location)
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach JWT token for authentication
        };
        
        const [projectsRes, tasksRes, timeRes] = await Promise.all([
          fetch("http://localhost:8000/api/projects", { method: "GET", headers }), // Fetch projects
          fetch("http://localhost:8000/api/tasks", { method: "GET", headers }), // Fetch tasks
          fetch("http://localhost:8000/api/projects/analytics", { method: "GET", headers }), // Fetch time tracking analytics
        ]);
        
        const projects = await projectsRes.json();
        const tasks = await tasksRes.json();
        const time = await timeRes.json();
        console.log(Array.isArray(projects)); // Should print true
        console.log("Project structure:", projects);

        console.log({ projects, tasks, time });
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }*/
    };

    fetchData();
  }, []);

  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    router.push(`/dashboard/projects/${value}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center relative">
        <div className="relative w-[500px] h-[500px] mb-4">
          <Image
            src="/Man trying to keep a work life balance.png"
            alt="Projects Dashboard Banner"
            fill
            className="object-cover rounded-md"
            priority
          />
        </div>
        <div className="relative w-[500px] h-[500px] mb-4">
          <Image
            src="/female doctor talking on the phone.png"
            alt="Project Management"
            fill
            className="object-cover rounded-md"
            priority
          />
        </div>
        <div className="absolute right-0 mr-4 flex flex-col">
          <h1 className="text-[#00E054] text-6xl font-bold">INTROSPECT</h1>
          <h1 className="text-[#000080] text-6xl font-bold">MANAGE</h1>
          <h1 className="text-[#00E054] text-6xl font-bold">HUNT</h1>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex justify-between items-center">
        <Tabs defaultValue="active" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
            {["all", "active", "completed", "archived"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Link href="/dashboard/projects/new">
          <Button className="bg-[#00E054] hover:bg-[#00E054]/90 text-white">New Project</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#f5faf5] border-none p-6">
          <h3 className="font-semibold mb-2">Active Projects</h3>
          <p className="text-2xl font-semibold mb-2">{projects?.filter(p => p.status?.toLowerCase() === "active").length || 0}</p>
          <Button onClick={() => router.push("/dashboard/projects/active")} className="bg-[#00E054] text-white">
            View All
          </Button>
        </Card>
        <Card className="bg-[#f5faf5] border-none p-6">
          <h3 className="font-semibold mb-2">Open Tasks</h3>
          <p className="text-2xl font-semibold mb-2">{tasks.length}</p>
          <Button onClick={() => router.push("/dashboard/tasks")} className="bg-[#00E054] text-white">
            View Tasks
          </Button>
        </Card>
        <Card className="bg-[#f5faf5] border-none p-6">
          <h3 className="font-semibold mb-2">Hours Tracked</h3>
          <p className="text-2xl font-semibold mb-2">
            {timeEntries.reduce((acc, entry) => acc + parseFloat(entry.duration), 0)}h
          </p>
          <Button onClick={() => router.push("/dashboard/time-report")} className="bg-[#00E054] text-white">
            Time Report
          </Button>
        </Card>
      </div>

      {/* Active Projects List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Projects</h2>
        <div className="bg-white rounded-lg border">
          {projects.length > 0 ? (
            projects
              .filter((p) => p.status === "active")
              .map((project, i) => (
                <div key={project.id} className={`p-4 ${i !== projects.length - 1 ? "border-b" : ""}`}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-gray-500">
                        {project.deadline} • {project.tasks} tasks remaining
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="p-2 hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">Move Up</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Move Down</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="p-4 text-gray-500">No active projects</p>
          )}
        </div>
      </div>
    </div>
  );
}
