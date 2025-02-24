"use client"
import { useEffect } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { useProjectStore } from "@/lib/store/projectStore"
import { useAuthStore } from "@/lib/store/authStore"; // Import Auth Store // Import Project Store

export default function ActiveProjects() {
  const { projects, fetchProjects, moveProject, removeProject } = useProjectStore();
  const [token, setToken] = useState<string | null>(null);
  //const token = localStorage.getItem("authToken"); // Get token from Zustand

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setToken(token);
  }, []); 

  useEffect(() => {
    if (token) {
      fetchProjects(); // Fetch projects when accessToken is available
    }
  }, [token]);

  const activeProjects = projects.filter((p) => p.status === "active")

  const handleProjectAction = (action: string, id: string) => {
    switch (action) {
      case "delete":
        removeProject(id)
        break
      case "moveUp":
        moveProject(id, "up")
        break
      case "moveDown":
        moveProject(id, "down")
        break
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Active Projects</h2>

      <div className="grid gap-4">
        {activeProjects?.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-500">Deadline: {project.deadline || "No deadline"}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleProjectAction("moveUp", project._id)}>Move Up</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleProjectAction("moveDown", project._id)}>Move Down</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleProjectAction("delete", project._id)} className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
