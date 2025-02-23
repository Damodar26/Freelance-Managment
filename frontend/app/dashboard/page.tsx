import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "lucide-react"


export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Today&apos;s Inspiration</h1>
        <Card>
          <CardHeader>
            <CardTitle>Quote of the Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">The only way to do great work is to love what you do. - Steve Jobs</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-6">
        <div className="relative w-[500px] h-[450px]">
          <Image
            src="/image-from-rawpixel-id-12037659-jpeg Background Removed 1.png"
            alt="Dashboard featured image"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
        
        <Card className="w-[500px] h-[450px] bg-[#00E054] bg-opacity-40  border-none">
          <CardContent className="flex flex-col items-center justify-center h-full space-y-6 p-8">
            <div className="rounded-full bg-indigo-100 p-6">
              <Badge className="w-12 h-12 text-indigo-600" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold text-indigo-600">12</h2>
              <p className="text-2xl font-semibold text-gray-700">Accolades so far</p>
            </div>
            <p className="text-gray-500 text-center max-w-md">
              Recognition for excellence in design, development, and innovation across multiple projects
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Project Deadlines</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Website Redesign</CardTitle>
              <p className="text-sm text-gray-500">Due Today</p>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Final mockups submission</p>
              <Button>Complete</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mobile App</CardTitle>
              <p className="text-sm text-gray-500">Due Tomorrow</p>
            </CardHeader>
            <CardContent>
              <p className="mb-4">User testing phase</p>
              <Button>Start</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Brand Guidelines</CardTitle>
              <p className="text-sm text-gray-500">Due in 3 days</p>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Client presentation</p>
              <Button>Review</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Updates</h2>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div>
                <h3 className="font-medium">Project milestone achieved</h3>
                <p className="text-sm text-gray-500">E-commerce Platform - Phase 1 Complete</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <div>
                <h3 className="font-medium">New client feedback</h3>
                <p className="text-sm text-gray-500">Website Redesign - Revision requested</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <div>
                <h3 className="font-medium">Team meeting scheduled</h3>
                <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

