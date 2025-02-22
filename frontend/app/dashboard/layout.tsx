import type React from "react"
import { SideNav } from "@/components/side-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

