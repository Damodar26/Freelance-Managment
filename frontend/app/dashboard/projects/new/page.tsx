"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function NewProject() {
  const router = useRouter()

  // State to store input values
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    deadline: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectData({
      ...projectData,
      [e.target.id]: e.target.value,
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("authToken") // Get token for authentication

      const response = await fetch("http://localhost:8000/api/projects/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create project")
      }

      console.log("Project Created:", data)
      router.push("/dashboard/projects") // Redirect to projects page
    } catch (error) {
      console.error("Error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Add New Project</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" placeholder="Enter project name" value={projectData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your project" className="min-h-[100px]" value={projectData.description} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" value={projectData.deadline} onChange={handleChange} />
            </div>


            {error && <p className="text-red-500">{error}</p>}

            <div className="flex gap-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                {loading ? "Creating..." : "Create Project"}
              </Button>
              <Button 
                type="button" 
                className="border border-input hover:bg-accent"
                onClick={() => router.push("/dashboard/projects")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
