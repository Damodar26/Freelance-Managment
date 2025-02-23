import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl">FreelanceFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#section">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/sign-in">
            Login
          </Link>
          <Link href="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>
      
      {/* Scattered Images */}
      <div className="relative w-full h-20">
        <Image
          src="/Receipt.png"
          alt="Decorative Icon 1"
          width={100}
          height={100}
          className="absolute left-[10%] top-2 transform rotate-12"
        />
        <Image
          src="/Assigning tasks to team members with kanban board.png"
          alt="Decorative Icon 2"
          width={70}
          height={70}
          className="absolute left-[30%] top-8 transform -rotate-6"
        />
        <Image
          src="/Woman and man shaking hands.png"
          alt="Decorative Icon 3"
          width={70}
          height={70}
          className="absolute right-[40%] top-4 transform rotate-45"
        />
        <Image
          src="/pizza in a box.png"
          alt="Decorative Icon 4"
          width={70}
          height={70}
          className="absolute right-[20%] top-10 transform -rotate-12"
        />
        <Image
          src="/Shopping, woman using shopping app.png"
          alt="Decorative Icon 4"
          width={70}
          height={70}
          className="absolute right-[10%] top-10 transform -rotate-12"
        />
      </div>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Redefining Future Workspaces
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl">
                  All-in-one platform for freelancers to manage projects, track finances, and boost productivity
                </p>
                <Link href="/sign-up">
                  <Button className="size-lg">Start Free Trial</Button>
                </Link>
              </div>
              <div className="flex justify-center md:justify-end">
                <Image 
                  src="/pic1.png" 
                  alt="Workspace illustration" 
                  width={600}
                  height={330}
                  className="w-full max-w-[500px] h-auto rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        {/* New Image Carousel Section */}
        <section className="w-full overflow-hidden">
          <div className="relative w-full h-[400px] shadow-2xl">
            <Image
              src="/c1.jpg"
              alt="Carousel Image 1"
              fill
              className="object-cover w-full h-full animate-carousel"
              sizes="100vw"
              priority
            />
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-cream">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col bg-[#00E054] bg-opacity-50 h-48 rounded-lg border-green-400 p-6  justify-center space-y-4">
                <h2 className="text-2xl font-bold">Time Tracking</h2>
                <p className="text-gray-500">Track billable hours and analyze productivity patterns</p>
                <Link href="/">
                  <Button className="border border-foreground">Learn More</Button>
                </Link>
              </div>
              <div className="flex flex-col bg-[#00E054] bg-opacity-50 h-48 rounded-lg border-green-400 p-6  justify-center space-y-4">
                <h2 className="text-2xl font-bold">Invoice Management</h2>
                <p className="text-gray-500">Create and track invoices with automated payment reminders</p>
                <Link href="/">
                  <Button className="border border-foreground">Learn More</Button>
                </Link>
              </div>
              <div className="flex flex-col bg-[#00E054] h-48 rounded-lg border-green-400 p-6 bg-opacity-50 justify-center space-y-4">
                <h2 className="text-2xl font-bold">Project Analytics</h2>
                <p className="text-gray-500">Get insights into project progress and financial health</p>
                <Link href="/">
                  <Button className="border border-foreground">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12">
          <div className="container mx-auto flex items-center">
            <Image
              src="/5405aff9dccd20f18582232b05b7f86e.jpg" // Replace with your image path
              alt="Your Image"
              width={300}
              height={200}
              className="w-full  rounded-lg object-cover"
            />
            <div className="ml-8">
              <h2 className="text-4xl font-bold">YOUR OWN BOSS,</h2>
              <h2 className="text-4xl font-bold">YOUR OWN BRAND,</h2>
              <h2 className="text-4xl font-bold">YOUR OWN FUTURE.</h2>
            </div>
          </div>
        </section>

        {/* Four Medium Sized Images Aligned Side by Side */}
        <section className="w-full py-12">
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <Image
              src="/young man in vr glasses.png"
              alt="Image 1"
              width={300}
              height={200}
              className="w-full h-auto rounded-lg object-cover"
            />
            <Image
              src="/Isometric coding and programming icon.png"
              alt="Image 2"
              width={300}
              height={200}
              className="w-full h-auto rounded-lg object-cover"
            />
            <Image
              src="/Isometric piggy bank and money savings.png"
              alt="Image 3"
              width={300}
              height={200}
              className="w-full h-auto rounded-lg object-cover"
            />
            <Image
              src="/Trophy, medal and arrow in the target center.png"
              alt="Image 4"
              width={300}
              height={200}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </section>

       
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 FreelanceFlow. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

