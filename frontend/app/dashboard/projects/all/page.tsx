"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AllProjects() {
  const router = useRouter()

  const handleTabChange = (value: string) => {
    switch (value) {
      case "all":
        router.push("/dashboard/projects/all")
        break
      case "active":
        router.push("/dashboard/projects")
        break
      case "completed":
        router.push("/dashboard/projects/completed")
        break
      case "archived":
        router.push("/dashboard/projects/archived")
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
            {/* Same TabsTriggers as main page */}
            // ... existing code ...
          </TabsList>
        </Tabs>
        <Link href="/dashboard/projects/new">
          <Button className="bg-[#00E054] hover:bg-[#00E054]/90 text-white">New Project</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#f5faf5] border-none p-6">
          <h3 className="font-semibold mb-2">Total Projects</h3>
          <p className="text-2xl font-semibold mb-2">24</p>
          <p className="text-sm text-gray-600">across all statuses</p>
          <Button className="mt-4 bg-[#00E054] hover:bg-[#00E054]/90 text-white">View All</Button>
        </Card>
        {/* Similar cards showing total stats */}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Projects</h2>
        <div className="bg-white rounded-lg border divide-y">
          {/* Project Item 1 */}
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Website Redesign</h3>
                <p className="text-sm text-gray-500">Client: Acme Corporation</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span>
                  <span className="text-xs text-gray-500">Due: Dec 31, 2024</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Archive</Button>
              </div>
            </div>
          </div>

          {/* Project Item 2 */}
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Mobile App Development</h3>
                <p className="text-sm text-gray-500">Client: TechStart Inc.</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">In Progress</span>
                  <span className="text-xs text-gray-500">Due: Jan 15, 2025</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Archive</Button>
              </div>
            </div>
          </div>

          {/* Project Item 3 */}
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Brand Identity Design</h3>
                <p className="text-sm text-gray-500">Client: Fresh Foods Co.</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Planning</span>
                  <span className="text-xs text-gray-500">Due: Feb 28, 2025</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Archive</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

