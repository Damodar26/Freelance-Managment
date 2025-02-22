"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SignIn() {
  const router = useRouter()

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  const handleForgotPassword = () => {
    // API call here
    alert("If this email exists in our system, you will receive a password reset OTP.")
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center gap-8 px-4 py-8">
      {/* Left Image */}
      <div className="hidden lg:block lg:w-1/4 relative h-[600px]">
        <Image
          src="/a04f4ebfe51a6e1c28fe19237444b2f9.jpg" 
          alt="Decorative left"
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>

      {/* Center Sign In Component */}
      <div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to FreelanceFlow</h1>
          <p className="text-sm text-muted-foreground">Your all-in-one freelance management solution</p>
        </div>
        <Tabs defaultValue="sign-in" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up" onClick={() => router.push("/sign-up")}>
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <form onSubmit={handleSignIn}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Enter your email" type="email" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" placeholder="Enter your password" type="password" required />
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:text-blue-800 text-right"
                  >
                    Forgot password?
                  </button>
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </div>
            </form>
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Button className="variant-outline">Google</Button>
                <Button className="variant-outline">GitHub</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Image */}
      <div className="hidden lg:block lg:w-1/4 relative h-[600px]">
        <Image
          src="/c3.jpg"
          alt="Decorative right"
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>
    </div>
  )
}

