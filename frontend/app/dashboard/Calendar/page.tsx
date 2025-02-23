"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [goals, setGoals] = useState<{ [key: string]: string }>({})
  const [highlightedDates, setHighlightedDates] = useState<{ [key: string]: string }>({})

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(date)
  }

  const handleHighlight = () => {
    if (selectedDate) {
      const dateKey = selectedDate.toDateString()
      const reminder = prompt("Enter a reminder for this date:")
      if (reminder) {
        setHighlightedDates((prev) => ({ ...prev, [dateKey]: reminder }))
      }
    }
  }

  const handleRemoveReminder = (dateKey: string) => {
    setHighlightedDates((prev) => {
      const newHighlightedDates = { ...prev }
      delete newHighlightedDates[dateKey]
      return newHighlightedDates
    })
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate?.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year
      days.push(
        <Card 
          key={day} 
          className={`h-24 p-2 ${isSelected ? 'bg-blue-200' : ''} cursor-pointer`}
          onClick={() => handleDateClick(day)}
        >
          <div className="font-semibold">{day}</div>
        </Card>,
      )
    }

    return (
      <div className="mt-6">
        <h2 className="text-2xl font-bold">{months[month]}</h2>
        <div className="grid grid-cols-7 gap-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-semibold">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    )
  }

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <img src="/d6b82fc897b37915d3ef6c9b6be2b33f.jpg" alt="Plan Image" className="rounded-lg shadow-lg transition-transform transform hover:scale-105 w-64 h-64" />
        <h1 className="text-5xl font-bold leading-tight">PLAN<br />YOUR GOALS<br />NOW</h1>
      </div>

      <div className="flex justify-between">
        <button onClick={() => changeMonth(-1)} className="bg-green-500 text-white py-2 px-4 rounded">Previous Month</button>
        <button onClick={() => changeMonth(1)} className="bg-green-500 text-white py-2 px-4 rounded">Next Month</button>
      </div>

      <div className="flex justify-center mt-4">
        <button onClick={handleHighlight} className="bg-green-500 text-white py-2 px-4 rounded">Highlight Date</button>
      </div>
      {renderCalendar()}

      <div className="mt-6">
        <h2 className="text-2xl font-bold">Highlighted Dates and Reminders</h2>
        <ul>
          {Object.entries(highlightedDates).map(([date, reminder]) => (
            <li key={date} className="mt-2 flex justify-between items-center">
              <span className="font-semibold">{date}:</span> {reminder}
              <button onClick={() => handleRemoveReminder(date)} className="text-red-500 ml-4">Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

