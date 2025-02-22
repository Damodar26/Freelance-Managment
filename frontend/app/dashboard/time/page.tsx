"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function TimeTracking() {
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [showLogTimeDialog, setShowLogTimeDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  // Add new state for form data
  const [logTimeForm, setLogTimeForm] = useState({
    project: '',
    description: '',
    isBillable: false,
    duration: 0
  })

  // Add new state for productivity details
  const [productivityDetails, setProductivityDetails] = useState({
    tasksCompleted: 0,
    deadlinesMet: 0,
    activeTime: 0
  })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleLogTime = () => {
    // Here you would typically make an API call to save the time entry
    const timeEntry = {
      ...logTimeForm,
      duration: time,
      timestamp: new Date().toISOString(),
    }
    console.log('Logging time entry:', timeEntry)
    
    // Reset the timer and close the dialog
    setTime(0)
    setIsTimerRunning(false)
    setShowLogTimeDialog(false)
  }

  const handleViewDetails = () => {
    // Here you would typically fetch the latest productivity data
    setProductivityDetails({
      tasksCompleted: 15,
      deadlinesMet: 12,
      activeTime: 32 * 3600 // 32 hours in seconds
    })
    setShowDetailsDialog(true)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="time-entries"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Time Entries
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Reports
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-[#f5faf5] border-none p-6">
              <h3 className="font-semibold mb-4">Today&apos;s Hours</h3>
              <p className="text-2xl font-semibold mb-4">{formatTime(time)}</p>
              <Button
                className="bg-[#00E054] hover:bg-[#00E054]/90 text-white"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
              >
                {isTimerRunning ? "Stop Timer" : "Start Timer"}
              </Button>
            </Card>
            <Card className="bg-[#f5faf5] border-none p-6">
              <h3 className="font-semibold mb-4">Billable Hours</h3>
              <p className="text-2xl font-semibold mb-4">32h / 40h</p>
              <Button className="bg-[#00E054] hover:bg-[#00E054]/90 text-white">Log Time</Button>
            </Card>
            <Card className="bg-[#f5faf5] border-none p-6">
              <h3 className="font-semibold mb-4">Productivity Score</h3>
              <p className="text-2xl font-semibold mb-4">85%</p>
              <Button className="bg-[#00E054] hover:bg-[#00E054]/90 text-white">View Details</Button>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Time Entries</h2>
            <div className="bg-white rounded-lg border">
              <div className="border-b p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>Website Redesign</div>
                  <div>4h 30m</div>
                  <div>Billable</div>
                  <div>In Progress</div>
                </div>
              </div>
              <div className="border-b p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>API Development</div>
                  <div>2h 15m</div>
                  <div>Billable</div>
                  <div>Completed</div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>Logo Design</div>
                  <div>1h 45m</div>
                  <div>Non-billable</div>
                  <div>In Progress</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Weekly Summary</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-[#f5faf5] border-none p-6">
                <h3 className="font-semibold mb-2">Total Hours</h3>
                <p className="text-gray-600">32 hours tracked this week</p>
              </Card>
              <Card className="bg-[#f5faf5] border-none p-6">
                <h3 className="font-semibold mb-2">Most Productive Day</h3>
                <p className="text-gray-600">Tuesday - 8.5 hours</p>
              </Card>
              <Card className="bg-[#f5faf5] border-none p-6">
                <h3 className="font-semibold mb-2">Project Distribution</h3>
                <p className="text-gray-600">3 active projects</p>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showLogTimeDialog} onOpenChange={setShowLogTimeDialog}>
        <DialogTrigger asChild>
          <Button className="bg-[#00E054] hover:bg-[#00E054]/90 text-white">Log Time</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Time</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={logTimeForm.project}
                onChange={(e) => setLogTimeForm({...logTimeForm, project: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded"
                value={logTimeForm.description}
                onChange={(e) => setLogTimeForm({...logTimeForm, description: e.target.value})}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="billable"
                checked={logTimeForm.isBillable}
                onChange={(e) => setLogTimeForm({...logTimeForm, isBillable: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="billable">Billable</label>
            </div>
            <p>Time logged: {formatTime(time)}</p>
            <Button 
              className="w-full bg-[#00E054] hover:bg-[#00E054]/90 text-white"
              onClick={handleLogTime}
            >
              Save Time Entry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
<br/>
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogTrigger asChild>
          <Button 
            className="bg-[#00E054] hover:bg-[#00E054]/90 text-white"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Productivity Details</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p>Your productivity score is calculated based on:</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tasks Completed:</span>
                <span>{productivityDetails.tasksCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span>Deadlines Met:</span>
                <span>{productivityDetails.deadlinesMet}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Time:</span>
                <span>{formatTime(productivityDetails.activeTime)}</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Productivity Score: 85%</h4>
              <p className="text-sm text-gray-600">
                Score is calculated based on task completion rate, deadline adherence, and active time tracking.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

