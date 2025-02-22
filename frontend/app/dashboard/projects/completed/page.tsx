"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CompletedProjects() {
  const router = useRouter()

  const handleTabChange = (value: string) => {
    // Same tab change handler as other pages
    // ... existing code ...
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="completed" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
            {/* Same TabsTriggers */}
          </TabsList>
        </Tabs>
        <Link href="/dashboard/projects/new">
          <Button className="bg-[#00E054] hover:bg-[#00E054]/90 text-white">New Project</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#f5faf5] border-none p-6">
          <h3 className="font-semibold mb-2">Completed Projects</h3>
          <p className="text-2xl font-semibold mb-2">12</p>
          <p className="text-sm text-gray-600">successfully delivered</p>
          <Button className="mt-4 bg-[#00E054] hover:bg-[#00E054]/90 text-white">View Details</Button>
        </Card>
        {/* Cards showing completed project stats */}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Completed Projects</h2>
        <div className="bg-white rounded-lg border">{/* Show only completed projects */}</div>
      </div>
    </div>
  )
}

