import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function PayslipsPage() {
  const payslips = [
    {
      id: "jan-2024",
      month: "January 2024",
      grossPay: 4800.0,
      deductions: 300.0,
      netPay: 4500.0,
      status: "Paid",
      paidOn: "2024-01-25",
    },
    {
      id: "dec-2023",
      month: "December 2023",
      grossPay: 4800.0,
      deductions: 300.0,
      netPay: 4500.0,
      status: "Paid",
      paidOn: "2023-12-24",
    },
    {
      id: "nov-2023",
      month: "November 2023",
      grossPay: 4800.0,
      deductions: 300.0,
      netPay: 4500.0,
      status: "Paid",
      paidOn: "2023-11-25",
    },
    {
      id: "oct-2023",
      month: "October 2023",
      grossPay: 4800.0,
      deductions: 300.0,
      netPay: 4500.0,
      status: "Paid",
      paidOn: "2023-10-25",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pay Slips</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pay Slips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payslips.map((payslip) => (
              <Link key={payslip.id} href={`/payslips/${payslip.id}`} className="block">
                <div className="flex flex-col gap-4 rounded-lg border p-4 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{payslip.month}</span>
                      <Badge variant="outline">{payslip.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Paid on {new Date(payslip.paidOn).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-row-reverse">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Gross Pay:</span>
                        <span className="font-medium">${payslip.grossPay.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Deductions:</span>
                        <span className="font-medium text-secondary">-${payslip.deductions.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Net Pay:</span>
                        <span className="font-bold text-primary">${payslip.netPay.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Year-to-Date Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total Earnings</div>
              <div className="text-2xl font-bold">$57,600.00</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total Deductions</div>
              <div className="text-2xl font-bold text-secondary">$3,600.00</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Net Income</div>
              <div className="text-2xl font-bold text-primary">$54,000.00</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

