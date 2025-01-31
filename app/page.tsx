"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Edit2, Download, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useFinancial } from "@/contexts/FinancialContext"
import ErrorBoundary from "@/components/ErrorBoundary"

export default function HomePage() {
  return (
    <ErrorBoundary>
      <HomePageContent />
    </ErrorBoundary>
  )
}

function HomePageContent() {
  const { currency } = useFinancial()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome, John Doe</h1>
            <p className="text-sm text-muted-foreground">Employee ID: JD230901</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full md:w-auto">
          <Edit2 className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Basic Salary</CardTitle>
            <Badge variant="outline">Monthly</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency}4,000.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allowances</CardTitle>
            <Badge variant="outline">Monthly</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency}800.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deductions</CardTitle>
            <Badge variant="outline">Monthly</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency}300.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Pay</CardTitle>
            <Badge variant="outline">Monthly</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency}4,500.00</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Emergency Fund</p>
                  <p className="text-sm text-muted-foreground">3 months of expenses saved</p>
                </div>
                <div>
                  {currency}13,500 / {currency}18,000
                </div>
              </div>
              <Progress value={75} className="mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Retirement Savings</p>
                  <p className="text-sm text-muted-foreground">On track for retirement at 65</p>
                </div>
                <div>{currency}150,000 saved</div>
              </div>
              <Progress value={60} className="mt-2" />
            </div>
            <Link href="/financial-tools">
              <Button className="w-full mt-4">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Financial Tools
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Pay Slips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["January 2024", "December 2023", "November 2023"].map((month) => (
              <div key={month} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="font-semibold">{month}</div>
                  <div className="text-sm text-muted-foreground">Net Pay: {currency}4,500.00</div>
                </div>
                <Link href={`/payslips/${month.toLowerCase().replace(" ", "-")}`} passHref>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

