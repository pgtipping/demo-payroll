import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function PaySlipPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/payslips">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">January 2024 Pay Slip</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pay Details</CardTitle>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold">Earnings</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Basic Salary</span>
                    <span>$4,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Housing Allowance</span>
                    <span>$500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transport Allowance</span>
                    <span>$300.00</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Deductions</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$200.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Health Insurance</span>
                    <span>$50.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pension</span>
                    <span>$50.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-semibold">Gross Pay</span>
                <span className="font-semibold">$4,800.00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Deductions</span>
                <span className="font-semibold text-secondary">-$300.00</span>
              </div>
              <div className="flex justify-between border-t mt-2 pt-2">
                <span className="text-lg font-bold">Net Pay</span>
                <span className="text-lg font-bold text-primary">$4,500.00</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deduction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: "Health Insurance",
                amount: 50,
                startDate: "Jan 2024",
                endDate: "Dec 2024",
                progress: 70,
              },
              {
                type: "Student Loan",
                amount: 200,
                startDate: "Jan 2024",
                endDate: "Dec 2025",
                progress: 30,
              },
            ].map((deduction) => (
              <div key={deduction.type} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{deduction.type}</div>
                  <Badge variant="outline">${deduction.amount}/month</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {deduction.startDate} - {deduction.endDate}
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${deduction.progress}%` }} />
                </div>
                <div className="text-sm text-muted-foreground">{deduction.progress}% complete</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

