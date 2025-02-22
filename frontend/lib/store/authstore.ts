import { create } from "zustand"
export const useAuthStore = create((set) => ({
    user: null,
    accessToken: null, // Store access token
  
    setUser: (user: string) => set({ user }),
    setAccessToken: (token: string) => set({ accessToken: token }), // Function to store token
  
    logout: () => set({ user: null, accessToken: null }), // Logout function
  }));
  