"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { useProjectStore } from "@/lib/store/projectStore"  // Import from store file instead
// ... existing imports ...

interface Project {
  id: string
  name: string
  deadline: string
  tasks: string
  progress: number
  team: string[]
  status: "active" | "completed" | "archived"
}

export default function ActiveProjects() {
  const { projects, removeProject, moveProject } = useProjectStore()
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
      {/* ... existing header ... */}

      <div className="grid gap-4">
        {activeProjects.map((project) => (
          <Card key={project.id} className="p-6">
            {/* ... existing project card layout ... */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleProjectAction("moveUp", project.id)}>Move Up</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProjectAction("moveDown", project.id)}>
                  Move Down
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProjectAction("delete", project.id)} className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* ... rest of the card content ... */}
          </Card>
        ))}
      </div>
    </div>
  )
}

