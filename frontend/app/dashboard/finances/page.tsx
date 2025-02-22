import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Building2, ChevronRight, MoreVertical } from "lucide-react"

export default function Finances() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Finances</span>
        <ChevronRight className="h-4 w-4" />
        <span>Expenses & Budget</span>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="expenses"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Expenses
          </TabsTrigger>
          <TabsTrigger
            value="budget"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Budget
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-[#f5faf5] border-none p-6">
              <h3 className="text-sm text-gray-600 mb-2">Current Month</h3>
              <h2 className="font-semibold mb-1">Total Balance</h2>
              <p className="text-2xl font-semibold">$24,500.00</p>
            </Card>
            <Card className="bg-[#f5faf5] border-none p-6">
              <h3 className="text-sm text-gray-600 mb-2">This Month</h3>
              <h2 className="font-semibold mb-1">Income</h2>
              <p className="text-2xl font-semibold">$8,750.00</p>
            </Card>
            <Card className="bg-[#f5faf5] border-none p-6">
              <h3 className="text-sm text-gray-600 mb-2">This Month</h3>
              <h2 className="font-semibold mb-1">Expenses</h2>
              <p className="text-2xl font-semibold">$3,250.00</p>
            </Card>
            <Card className="bg-[#f5faf5] border-none p-6">
              <h3 className="text-sm text-gray-600 mb-2">Monthly Goal</h3>
              <h2 className="font-semibold mb-1">Savings</h2>
              <p className="text-2xl font-semibold">$1,500.00</p>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <div className="bg-white rounded-lg border">
              <div className="border-b p-4">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div>Software License</div>
                  <div>Technology</div>
                  <div className="text-red-500">$299.00</div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Oct 15, 2023</span>
                    <Button className="hover:bg-secondary h-9 w-9 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="border-b p-4">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div>Office Supplies</div>
                  <div>Equipment</div>
                  <div className="text-red-500">$125.50</div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Oct 14, 2023</span>
                    <Button className="hover:bg-secondary h-9 w-9 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div>Client Project</div>
                  <div>Income</div>
                  <div className="text-green-500">$1,500.00</div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Oct 13, 2023</span>
                    <Button className="hover:bg-secondary h-9 w-9 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Budget Categories</h2>
            <div className="bg-white rounded-lg border">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Building2 className="h-6 w-6 text-[#00E054]" />
                    <div>
                      <h3 className="font-semibold">Technology</h3>
                      <p className="text-sm text-gray-500">$500 / $800 Budget</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Building2 className="h-6 w-6 text-[#00E054]" />
                    <div>
                      <h3 className="font-semibold">Marketing</h3>
                      <p className="text-sm text-gray-500">$300 / $500 Budget</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Building2 className="h-6 w-6 text-[#00E054]" />
                    <div>
                      <h3 className="font-semibold">Office Expenses</h3>
                      <p className="text-sm text-gray-500">$200 / $400 Budget</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

