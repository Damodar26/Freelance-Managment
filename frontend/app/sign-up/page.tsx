"use client"

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer"); // Default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL; // Get API URL from .env.local

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            <CardDescription>Tell us about yourself to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
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
  );
}
