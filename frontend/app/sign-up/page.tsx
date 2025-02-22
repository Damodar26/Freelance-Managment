"use client"

import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"

const sendOTP = async (email: string): Promise<void> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send OTP");
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};


const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
};

const registerUser = async (email: string, fullName: string, password: string, role: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, fullName, password, role }),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    return true;
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
};



export default function SignUp() {
  const router = useRouter()
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState("")
  const [fullName, setName] = useState("")
  const [role, setRole] = useState("")
  const [password, setPass] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  
    try {
      // Here you would make an API call to your backend to create the user account
      //await sendOTP(email) // Implement this function to connect with your backend
      const isRegistered = await registerUser(email, fullName, password, role);
        if (isRegistered) {
          alert("Account created successfully! Please sign in.");
          router.push("/sign-in");
        } else {
          alert("Failed to register user.");
        }
      router.push("/sign-in") // Redirect user to sign-in page
    } catch (error) {
      console.error("Error during signup:", error)
      alert("Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const isValid = await verifyOTP(email, otp);
  
      if (isValid) {
        alert("OTP verified successfully! Press OK to Continue");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleResendOTP = async () => {
    setLoading(true)
    try {
      await sendOTP(email)
      alert("OTP resent successfully!")
    } catch (error) {
      console.error("Error resending OTP:", error)
      alert("Failed to resend OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 relative">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/b0a153eb4f8ae1c916a5742cb518c6e7.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>
      
      <div className="container relative flex items-center justify-center gap-8">
        <div className="hidden xl:block w-1/4">
          <Image
            src="/Kanban planning board with tasks.png"
            alt="Left decorative image"
            width={400}
            height={800}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>
        
        <Card className="w-full max-w-[400px] flex-shrink-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Join FreelanceFlow</CardTitle>
            <CardDescription>
              {showOTP ? "Enter the OTP sent to your email" : "Tell us about yourself to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showOTP ? (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" placeholder="Enter your full name" required value={fullName}
                    onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Create password" required value={password}
                    onChange={(e) => setPass(e.target.value)}/>
                </div>
                <div className="space-y-2">
                <Label>Select your role</Label>
                <RadioGroup defaultValue="freelancer" className="grid grid-cols-2 gap-4">
                  <Label
                    htmlFor="freelancer"
                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer ${
                      role === "freelancer" ? "border-primary" : "border-muted"
                    }`}
                    onClick={() => setRole("freelancer")}
                  >
                    <RadioGroupItem value="freelancer" id="freelancer" className="sr-only" />
                    <span>Freelancer</span>
                    <span className="text-xs">I want to manage my freelance work</span>
                  </Label>
                  <Label
                    htmlFor="client"
                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer ${
                      role === "client" ? "border-primary" : "border-muted"
                    }`}
                    onClick={() => setRole("client")}
                  >
                    <RadioGroupItem value="client" id="client" className="sr-only" />
                    <span>Client</span>
                    <span className="text-xs">I want to hire freelancers</span>
                  </Label>
                </RadioGroup>
              </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOTPVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    placeholder="Enter OTP"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
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
              </form>
            )}
            <div className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="hidden xl:block w-1/4">
          <Image
            src="/Money wallet with credit card and receipt.png"
            alt="Right decorative image"
            width={400}
            height={800}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>
      </div>
    </div>
  )
}