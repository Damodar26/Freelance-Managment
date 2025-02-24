import { create } from "zustand";
import axios from "axios"; // Ensure Axios is installed

export const useTaskStore = create((set) => ({
  tasks: [],
  fetchTasks: async (projectId) => {
    try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(`http://localhost:8000/api/tasks/${projectId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });        
        console.log("🛠 API Response from Backend:", response.data);

        if (Array.isArray(response.data)) {
          console.log("✅ Updating Zustand tasks:", response.data);
          set({ tasks: response.data });
        } else {
          console.warn("⚠️ Response is not an array:", response.data);
        } // Log the full response
      set({ tasks: response.data }); // Handle different API structures
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },  
  updateTaskStatus: async (taskId, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/tasks/${taskId}/status`, { status: newStatus });
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ),
      }));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  },
  removeTask: async (taskId) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${taskId}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },
}));
