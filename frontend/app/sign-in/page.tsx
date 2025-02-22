"use client"

import type React, { useState } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/lib/store/authStore";

const login = async (email: string, password: string): Promise<void> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email , password}),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }
  } catch (error) {
    console.error("Error while login:", error);
    throw error;
  }
};

const sendOTP = async (email: string): Promise<void> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/sent-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email , isLogin: true}),
    });

    if (!response.ok) {
      throw new Error("Failed to send otp");
    }
  } catch (error) {
    console.error("Error while sending otp:", error);
    throw error;
  }
};

 // Import Zustand store

async function verifyOTP(email: string , otp: string) {
  try {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    console.log(data)

    /*if (!response.ok) {
      throw new Error(data.message || "OTP verification failed");
    }*/

    // ✅ Store accessToken in Zustand
    useAuthStore.setState({ user: data.user, accessToken: data.accessToken });

    console.log("User logged in successfully:", data.user);
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
  }
}


export default function SignIn() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Here you would make an API call to your backend to:
      // 1. Create the user account
      // 2. Send OTP to the provided email
      await login(email, password) // implement this function to connect with your backend
      setShowOTP(true)
    } catch (error) {
      console.error("Error during sign in:", error)
      alert("Failed to login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    try {
      await sendOTP(email);
      alert("If this email exists in our system, you will receive a password reset OTP.");
      router.push("/dashboard");
    } catch (error) {
      alert("Failed to send OTP. Please try again.");
    }
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const token = await verifyOTP(email, otp);
    
    setLoading(false);
    console.log(token)
    if (token) {
       localStorage.setItem("authToken", token.accessToken) // Store token in localStorage
      alert("OTP verified successfully! Press OK to Continue");
      router.push("/dashboard");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };
  

  const handleResendOTP = async () => {
    await sendOTP(email);
    alert("OTP resent successfully.");
  };

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
          {!showOTP ? (
            <form onSubmit={handleSignIn}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Enter your email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" placeholder="Enter your password" type="password" required value={password} onChange={(p) => setPassword(p.target.value)}/>
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
            </form>) : (
            <form onSubmit={handleOTPVerification} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input id="otp" placeholder="Enter OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendOTP}
                disabled={loading}
              >
                Resend OTP
              </Button>
            </form>)}
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
