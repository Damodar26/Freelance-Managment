import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Flame, Users, Shield } from "lucide-react"

export default function About() {
  return (
    <div className="container mx-auto py-12 space-y-16">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Our Mission</h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
          Empowering freelancers to achieve their full potential through smart project management and productivity
          tools.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="bg-secondary/50">
          <CardHeader className="text-center">
            <Flame className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle>Innovation</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-500">
            Constantly evolving our platform with cutting-edge solutions for modern freelancers
          </CardContent>
        </Card>

        <Card className="bg-secondary/50">
          <CardHeader className="text-center">
            <Users className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle>Community</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-500">
            Building a supportive ecosystem where freelancers can thrive and grow together
          </CardContent>
        </Card>

        <Card className="bg-secondary/50">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle>Trust</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-500">
            Providing reliable tools and secure solutions you can count on
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Our Team</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <img src="/placeholder.svg" alt="Sarah Johnson" className="w-24 h-24 rounded-full mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Sarah Johnson</h3>
                <p className="text-gray-500">Founder & CEO</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <img src="/placeholder.svg" alt="Michael Chen" className="w-24 h-24 rounded-full mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Michael Chen</h3>
                <p className="text-gray-500">Head of Product</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <img src="/placeholder.svg" alt="Emma Rodriguez" className="w-24 h-24 rounded-full mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Emma Rodriguez</h3>
                <p className="text-gray-500">Lead Designer</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Join Our Journey</h2>
        <p className="text-xl text-gray-500">Ready to transform your freelance career?</p>
        <br/>
        <Link href="/sign-up">
          <Button className="bg-primary hover:bg-primary/90 text-white">Get Started Now</Button>
        </Link>
      </div>
    </div>
  )
}

