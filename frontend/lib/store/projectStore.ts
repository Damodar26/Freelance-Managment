import { create } from 'zustand'

interface Project {
  id: string
  name: string
  deadline: string
  tasks: string
  progress: number
  team: string[]
  status: "active" | "completed" | "archived"
}

interface Task {
  id: string
  name: string
  project: string
  deadline: string
  priority: "High" | "Medium" | "Low"
  status: "pending" | "completed"
}

interface TimeEntry {
  id: string
  project: string
  task: string
  duration: string
  date: string
}

interface ProjectStore {
  projects: Project[]
  tasks: Task[]
  timeEntries: TimeEntry[]
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  moveProject: (id: string, direction: "up" | "down") => void
  addTask: (task: Task) => void
  completeTask: (id: string) => void
  addTimeEntry: (entry: TimeEntry) => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  tasks: [],
  timeEntries: [],
  addProject: (project) => 
    set((state) => ({
      ...state,
      projects: [...state.projects, project]
    })),
  removeProject: (id) => 
    set((state) => ({
      ...state,
      projects: state.projects.filter((p) => p.id !== id)
    })),
  moveProject: (id, direction) => 
    set((state) => {
      const index = state.projects.findIndex((p) => p.id === id)
      if (index === -1) return state
      
      const newProjects = [...state.projects]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      
      if (newIndex < 0 || newIndex >= newProjects.length) return state
      
      const temp = newProjects[index]
      newProjects[index] = newProjects[newIndex]
      newProjects[newIndex] = temp
      return { ...state, projects: newProjects }
    }),
  addTask: (task) => 
    set((state) => ({
      ...state,
      tasks: [...state.tasks, task]
    })),
  completeTask: (id) => 
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: 'completed' } : task
      )
    })),
  addTimeEntry: (entry) => 
    set((state) => ({
      ...state,
      timeEntries: [...state.timeEntries, entry]
    })),
}))