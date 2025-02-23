import { create } from "zustand"
import { useAuthStore } from "./authStore";

interface Project {
  id: string
  name: string
  deadline: string
  tasks: string
  progress: number
  team: string[]
  status: "active" | "completed" | "archived"
}

interface ProjectState {
  projects: Project[]
  fetchProjects: (token: string) => Promise<void>
  removeProject: (id: string) => Promise<void>
  moveProject: (id: string, direction: "up" | "down") => Promise<void>
}
 // Import Auth Store

export const useProjectStore = create((set) => ({
  projects: [],

  fetchProjects: async () => {
    const accessToken = localStorage.getItem("authToken"); // Get the stored token

    if (!accessToken) {
      console.error("No access token found. User might not be logged in.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // Send token in headers
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      set({ projects: data }); // Update Zustand store with projects
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  },

  removeProject: async (projectId) => {
    try {
      const token = localStorage.getItem("authToken"); // Get auth token
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Attach token for authentication
        },
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete project");
  
      // ✅ Update Zustand state only after successful backend deletion
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
      }));
  
      console.log("Project deleted successfully:", data.message);
    } catch (error) {
      console.error("Error deleting project:", error.message);
      alert("Failed to delete project!");
    }
  },
  

  moveProject: (id, direction) => set((state) => {
    const index = state.projects.findIndex((p) => p.id === id);
    if (index === -1) return state;

    const newProjects = [...state.projects];

    if (direction === "up" && index > 0) {
      [newProjects[index], newProjects[index - 1]] = [newProjects[index - 1], newProjects[index]];
    } else if (direction === "down" && index < newProjects.length - 1) {
      [newProjects[index], newProjects[index + 1]] = [newProjects[index + 1], newProjects[index]];
    }

    return { projects: newProjects };
  }),
}));


