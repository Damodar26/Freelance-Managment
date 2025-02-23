"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Building2, ChevronRight, MoreVertical, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const data = [
  { name: "Jan", Income: 4000, Expenses: 2400 },
  { name: "Feb", Income: 3000, Expenses: 1398 },
  { name: "Mar", Income: 2000, Expenses: 9800 },
  { name: "Apr", Income: 2780, Expenses: 3908 },
  { name: "May", Income: 1890, Expenses: 4800 },
  { name: "Jun", Income: 2390, Expenses: 3800 },
]

export default function Finances() {
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Software License", category: "Technology", amount: 299, date: "2023-10-15" },
    { id: 2, name: "Office Supplies", category: "Equipment", amount: 125.5, date: "2023-10-14" },
    { id: 3, name: "Client Project", category: "Income", amount: -1500, date: "2023-10-13" },
  ])

  const [budgets, setBudgets] = useState([
    { id: 1, category: "Technology", budget: 800, spent: 500 },
    { id: 2, category: "Marketing", budget: 500, spent: 300 },
    { id: 3, category: "Office Expenses", budget: 400, spent: 200 },
  ])

  const [newExpense, setNewExpense] = useState({ name: "", category: "", amount: "", date: "" })
  const [newBudget, setNewBudget] = useState({ category: "", budget: "" })
  const [editingBudgetId, setEditingBudgetId] = useState(null)

  const [payments, setPayments] = useState([])
  const [newPayment, setNewPayment] = useState({ to: "", amount: "", description: "" })
  const [pendingPayments, setPendingPayments] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  const addExpense = () => {
    setExpenses([...expenses, { ...newExpense, id: expenses.length + 1, amount: Number.parseFloat(newExpense.amount) }])
    setNewExpense({ name: "", category: "", amount: "", date: "" })
  }

  const addBudget = () => {
    setBudgets([
      ...budgets,
      { ...newBudget, id: budgets.length + 1, budget: Number.parseFloat(newBudget.budget), spent: 0 },
    ])
    setNewBudget({ category: "", budget: "" })
  }

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const deleteBudget = (id) => {
    setBudgets(budgets.filter((budget) => budget.id !== id))
  }

  const updateBudget = (id, newAmount) => {
    setBudgets(
      budgets.map((budget) => (budget.id === id ? { ...budget, budget: Number.parseFloat(newAmount) } : budget)),
    )
    setEditingBudgetId(null)
  }

  const handleEditBudget = (id) => {
    setEditingBudgetId(id)
  }

  const [activeCategory, setActiveCategory] = useState({
    Technology: true,
    Marketing: true,
    "Office Expenses": true,
  })

  const toggleCategory = (category: string) => {
    setActiveCategory((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  const handleEditTransaction = (id) => {
    // Implement edit functionality
    console.log(`Editing transaction ${id}`)
  }

  const handleDeleteTransaction = (id) => {
    // Implement delete functionality
    console.log(`Deleting transaction ${id}`)
  }

  const handleViewDetails = (id) => {
    // Implement view details functionality
    console.log(`Viewing details for transaction ${id}`)
  }

  const sendPayment = () => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      const payment = {
        id: payments.length + 1,
        ...newPayment,
        status: "sent",
        date: new Date().toISOString(),
      }
      setPayments([payment, ...payments])
      setNewPayment({ to: "", amount: "", description: "" })
      setIsProcessing(false)
    }, 2000)
  }

  const acceptPayment = (id) => {
    setPendingPayments(pendingPayments.filter((payment) => payment.id !== id))
    setPayments([{ ...pendingPayments.find((payment) => payment.id === id), status: "received" }, ...payments])
  }

  const rejectPayment = (id) => {
    setPendingPayments(pendingPayments.filter((payment) => payment.id !== id))
  }

  useEffect(() => {
    // Simulate incoming payments
    const incomingPaymentInterval = setInterval(() => {
      const newPendingPayment = {
        id: Date.now(),
        from: `User${Math.floor(Math.random() * 1000)}`,
        amount: (Math.random() * 1000).toFixed(2),
        description: "Payment request",
        date: new Date().toISOString(),
      }
      setPendingPayments((prevPayments) => [...prevPayments, newPendingPayment])
    }, 15000) // New pending payment every 15 seconds

    return () => clearInterval(incomingPaymentInterval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Finances</span>
        <ChevronRight className="h-4 w-4" />
        <span>Expenses & Budget</span>
      </div>

      <div className="flex justify-end space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white">Generate Invoice</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Invoice</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientName" className="text-right">
                  Client Name
                </Label>
                <Input id="clientName" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientEmail" className="text-right">
                  Client Email
                </Label>
                <Input id="clientEmail" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input id="amount" className="col-span-3" type="number" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input id="dueDate" className="col-span-3" type="date" />
              </div>
            </div>
            <Button className="w-full">Create Invoice</Button>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white">View Invoice History</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Invoice History</DialogTitle>
            </DialogHeader>
            <div className="max-h-96 overflow-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Client</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">Client A</td>
                    <td className="p-2">$1000</td>
                    <td className="p-2">Paid</td>
                    <td className="p-2">2023-11-01</td>
                  </tr>
                  <tr>
                    <td className="p-2">Client B</td>
                    <td className="p-2">$1500</td>
                    <td className="p-2">Pending</td>
                    <td className="p-2">2023-11-15</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
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
          <TabsTrigger
            value="payments"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Payments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Income vs Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Income" fill="#4CAF50" />
                <Bar dataKey="Expenses" fill="#FFA000" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <div className="bg-white rounded-lg border">
              <div className="border-b p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div>Software License</div>
                  <div className="hidden md:block">Technology</div>
                  <div className="text-red-500">$299.00</div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Oct 15, 2023</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="hover:bg-secondary h-9 w-9 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTransaction(1)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTransaction(1)}>Delete</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(1)}>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              <div className="border-b p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div>Office Supplies</div>
                  <div className="hidden md:block">Equipment</div>
                  <div className="text-red-500">$125.50</div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Oct 14, 2023</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="hover:bg-secondary h-9 w-9 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTransaction(2)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTransaction(2)}>Delete</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(2)}>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div>Client Project</div>
                  <div className="hidden md:block">Income</div>
                  <div className="text-green-500">$1,500.00</div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Oct 13, 2023</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="hover:bg-secondary h-9 w-9 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTransaction(3)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTransaction(3)}>Delete</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(3)}>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Budget Categories</h2>
            <div className="bg-white rounded-lg border">
              {[
                { name: "Technology", budget: 800, spent: 500 },
                { name: "Marketing", budget: 500, spent: 300 },
                { name: "Office Expenses", budget: 400, spent: 200 },
              ].map((category, index) => (
                <div key={category.name} className={index !== 2 ? "border-b p-4" : "p-4"}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Building2 className="h-6 w-6 text-[#00E054]" />
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${category.spent} / ${category.budget} Budget
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={activeCategory[category.name]}
                      onCheckedChange={() => toggleCategory(category.name)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="expenses" className="space-y-6">
          <h2 className="text-2xl font-semibold">Expenses</h2>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Expense Name"
                value={newExpense.name}
                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              />
              <Input
                placeholder="Category"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              />
            </div>
            <Button className="mt-4" onClick={addExpense}>
              Add Expense
            </Button>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Expense List</h3>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{expense.name}</p>
                    <p className="text-sm text-gray-500">
                      {expense.category} - {expense.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={expense.amount < 0 ? "text-green-500" : "text-red-500"}>
                      ${Math.abs(expense.amount).toFixed(2)}
                    </p>
                    <Button variant="destructive" size="sm" onClick={() => deleteExpense(expense.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="budget" className="space-y-6">
          <h2 className="text-2xl font-semibold">Budget</h2>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Add New Budget</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Category"
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Budget Amount"
                value={newBudget.budget}
                onChange={(e) => setNewBudget({ ...newBudget, budget: e.target.value })}
              />
            </div>
            <Button className="mt-4" onClick={addBudget}>
              Add Budget
            </Button>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Budget Overview</h3>
            <div className="space-y-4">
              {budgets.map((budget) => (
                <div key={budget.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{budget.category}</p>
                    <p className="text-sm text-gray-500">
                      ${budget.spent} / ${budget.budget}({((budget.spent / budget.budget) * 100).toFixed(2)}%)
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {editingBudgetId === budget.id ? (
                      <>
                        <Input
                          type="number"
                          className="w-24"
                          value={budget.budget}
                          onChange={(e) => updateBudget(budget.id, e.target.value)}
                        />
                        <Button variant="outline" size="sm" onClick={() => updateBudget(budget.id, budget.budget)}>
                          Update
                        </Button>
                      </>
                    ) : (
                      <>
                        <span>${budget.budget}</span>
                        <Button variant="outline" size="sm" onClick={() => handleEditBudget(budget.id)}>
                          Edit
                        </Button>
                      </>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => deleteBudget(budget.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-6">
          <h2 className="text-2xl font-semibold">Financial Reports</h2>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Monthly Overview</h3>
            {/* Placeholder for a chart or detailed financial report */}
            <div className="h-64 bg-gray-100 flex items-center justify-center">
              Chart or detailed report would go here
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="space-y-6">
          <h2 className="text-2xl font-semibold">Payments</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Send Payment</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="payTo">Pay To</Label>
                  <Input
                    id="payTo"
                    value={newPayment.to}
                    onChange={(e) => setNewPayment({ ...newPayment, to: e.target.value })}
                    placeholder="Recipient's name or email"
                  />
                </div>
                <div>
                  <Label htmlFor="payAmount">Amount</Label>
                  <Input
                    id="payAmount"
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label htmlFor="payDescription">Description</Label>
                  <Input
                    id="payDescription"
                    value={newPayment.description}
                    onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                    placeholder="Payment description"
                  />
                </div>
                <Button onClick={sendPayment} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    "Send Payment"
                  )}
                </Button>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Pending Payments</h3>
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{payment.from}</p>
                      <p className="text-sm text-gray-500">
                        ${payment.amount} - {payment.description}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button size="sm" onClick={() => acceptPayment(payment.id)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => rejectPayment(payment.id)}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingPayments.length === 0 && <p className="text-gray-500">No pending payments</p>}
              </div>
            </Card>
          </div>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Payment History</h3>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{payment.status === "sent" ? payment.to : payment.from}</p>
                    <p className="text-sm text-gray-500">
                      ${payment.amount} - {payment.description}
                    </p>
                    <p className="text-xs text-gray-400">{new Date(payment.date).toLocaleString()}</p>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === "sent" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {payment.status === "sent" ? "Sent" : "Received"}
                    </span>
                  </div>
                </div>
              ))}
              {payments.length === 0 && <p className="text-gray-500">No payment history</p>}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

