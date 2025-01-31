"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useFinancial } from "@/contexts/FinancialContext"
import { useState } from "react"
import ErrorBoundary from "@/components/ErrorBoundary"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calculator, Wallet, TrendingUp, AlertCircle } from "lucide-react"

export default function FinancialToolsPage() {
  return (
    <ErrorBoundary>
      <FinancialToolsContent />
    </ErrorBoundary>
  )
}

function FinancialToolsContent() {
  const { currency } = useFinancial()
  const [onDemandAmount, setOnDemandAmount] = useState("")
  const maxOnDemandAmount = 2250 // 50% of monthly salary
  const currentEarnings = 4500

  const handleOnDemandPay = (e: React.FormEvent) => {
    e.preventDefault()
    if (Number(onDemandAmount) > maxOnDemandAmount) {
      alert("Amount exceeds maximum allowed")
      return
    }
    alert(`Request for ${currency}${onDemandAmount} on-demand pay submitted.`)
  }

  const savingsData = [
    { month: "Jan", amount: 4200 },
    { month: "Feb", amount: 4500 },
    { month: "Mar", amount: 4800 },
    { month: "Apr", amount: 5100 },
    { month: "May", amount: 5400 },
    { month: "Jun", amount: 5700 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Tools</h1>
        <p className="text-muted-foreground">Manage your finances and access your earnings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>On-Demand Pay</CardTitle>
            <CardDescription>Access up to 50% of your earned wages before payday</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOnDemandPay} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Earnings This Month</Label>
                <div className="text-2xl font-bold">
                  {currency}
                  {currentEarnings.toFixed(2)}
                </div>
                <Progress value={(currentEarnings / (maxOnDemandAmount * 2)) * 100} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Request Amount</Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    placeholder={`Max: ${currency}${maxOnDemandAmount}`}
                    value={onDemandAmount}
                    onChange={(e) => setOnDemandAmount(e.target.value)}
                    min="0"
                    max={maxOnDemandAmount}
                    step="0.01"
                  />
                  <Button type="submit">Request</Button>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>On-demand pay requests will be deducted from your next paycheck.</AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wellness Program Allocation</CardTitle>
            <CardDescription>Manage your wellness benefits and subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Gym Membership</div>
                  <div className="text-sm text-muted-foreground">Monthly deduction</div>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Health Insurance</div>
                  <div className="text-sm text-muted-foreground">Monthly deduction</div>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Mental Health Support</div>
                  <div className="text-sm text-muted-foreground">Monthly deduction</div>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Savings Tracker</CardTitle>
            <CardDescription>Monitor your savings growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${currency}${value}`} />
                  <Area type="monotone" dataKey="amount" stroke="#0070f3" fill="#0070f3" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Financial Health Overview</CardTitle>
            <CardDescription>Track your key financial metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-sm font-medium">Monthly Budget</div>
                  <div className="text-2xl font-bold">{currency}5,000</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-sm font-medium">Emergency Fund</div>
                  <div className="text-2xl font-bold">{currency}15,000</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-sm font-medium">Retirement Savings</div>
                  <div className="text-2xl font-bold">{currency}150,000</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

