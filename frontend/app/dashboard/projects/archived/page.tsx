"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ArchivedProjects() {
  const router = useRouter()

  const handleTabChange = (value: string) => {
    // Same tab change handler as other pages
    // ... existing code ...
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="archived" className="w-full" onValueChange={handleTabChange}>
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
          <h3 className="font-semibold mb-2">Archived Projects</h3>
          <p className="text-2xl font-semibold mb-2">4</p>
          <p className="text-sm text-gray-600">stored for reference</p>
          <Button className="mt-4 bg-[#00E054] hover:bg-[#00E054]/90 text-white">View Details</Button>
        </Card>
        {/* Cards showing archived project stats */}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Archived Projects</h2>
        <div className="bg-white rounded-lg border">{/* Show only archived projects */}</div>
      </div>
    </div>
  )
}

