"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Upload, Download, CheckCircle, XCircle, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinancial } from "@/contexts/FinancialContext"
import { useState } from "react"
import ErrorBoundary from "@/components/ErrorBoundary"
import { Switch } from "@/components/ui/switch"

export default function AdminPortalPage() {
  return (
    <ErrorBoundary>
      <AdminPortalContent />
    </ErrorBoundary>
  )
}

function AdminPortalContent() {
  const { country, currency, setCountry, setCurrency } = useFinancial()
  const [localCountry, setLocalCountry] = useState(country)
  const [localCurrency, setLocalCurrency] = useState(currency)

  const handleSaveFinancialSettings = () => {
    setCountry(localCountry)
    setCurrency(localCurrency)
    alert("Financial settings saved")
  }

  const [featureToggles, setFeatureToggles] = useState({
    payslips: true,
    financialTools: true,
    dashboard: true,
    onDemandPay: true,
    wellnessProgram: true,
  })

  const handleFeatureToggle = (feature: keyof typeof featureToggles) => {
    setFeatureToggles((prev) => ({ ...prev, [feature]: !prev[feature] }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Admin Portal</h1>
        <div className="flex flex-wrap gap-2">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload Data
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency}675,000</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payrollMonth">Month</Label>
                <Select>
                  <SelectTrigger id="payrollMonth">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month) => (
                      <SelectItem key={month} value={month.toLowerCase()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payrollYear">Year</Label>
                <Select>
                  <SelectTrigger id="payrollYear">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2023, 2024, 2025].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full">Run Payroll</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="approvals">
        <TabsList className="w-full">
          <TabsTrigger value="approvals" className="whitespace-normal min-w-0">
            Pending Approvals
          </TabsTrigger>
          <TabsTrigger value="tax-tables" className="whitespace-normal min-w-0">
            Tax Tables
          </TabsTrigger>
          <TabsTrigger value="employee-id" className="whitespace-normal min-w-0">
            Employee ID Rules
          </TabsTrigger>
          <TabsTrigger value="financial-settings" className="whitespace-normal min-w-0">
            Financial Settings
          </TabsTrigger>
          <TabsTrigger value="feature-toggles" className="whitespace-normal min-w-0">
            Feature Toggles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "John Doe", type: "Address Update", status: "pending" },
                    { name: "Jane Smith", type: "Phone Update", status: "pending" },
                    { name: "Mike Johnson", type: "Bank Details", status: "pending" },
                  ].map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Pending</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-secondary">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-tables">
          <Card>
            <CardHeader>
              <CardTitle>Tax Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Current Tax Brackets</h3>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tax Bracket
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bracket</TableHead>
                      <TableHead>Min Income</TableHead>
                      <TableHead>Max Income</TableHead>
                      <TableHead>Tax Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { bracket: 1, min: 0, max: 18200, rate: "0%" },
                      { bracket: 2, min: 18201, max: 45000, rate: "19%" },
                      { bracket: 3, min: 45001, max: 120000, rate: "32.5%" },
                      { bracket: 4, min: 120001, max: 180000, rate: "37%" },
                      { bracket: 5, min: 180001, max: null, rate: "45%" },
                    ].map((item) => (
                      <TableRow key={item.bracket}>
                        <TableCell>{item.bracket}</TableCell>
                        <TableCell>
                          {currency}
                          {item.min.toLocaleString()}
                        </TableCell>
                        <TableCell>{item.max ? `${currency}${item.max.toLocaleString()}` : "No limit"}</TableCell>
                        <TableCell>{item.rate}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employee-id">
          <Card>
            <CardHeader>
              <CardTitle>Employee ID Generation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="prefix">Prefix</Label>
                    <Input id="prefix" placeholder="e.g., EMP" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Input id="dateFormat" placeholder="e.g., YYMMDD" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="separator">Separator</Label>
                    <Input id="separator" placeholder="e.g., -" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serialDigits">Serial Number Digits</Label>
                    <Input id="serialDigits" type="number" placeholder="e.g., 4" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button>Save Employee ID Rules</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial-settings">
          <Card>
            <CardHeader>
              <CardTitle>Financial Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select onValueChange={setLocalCountry} defaultValue={localCountry}>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      {/* Add more countries as needed */}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select onValueChange={setLocalCurrency} defaultValue={localCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">USD ($)</SelectItem>
                      <SelectItem value="£">GBP (£)</SelectItem>
                      <SelectItem value="€">EUR (€)</SelectItem>
                      {/* Add more currencies as needed */}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSaveFinancialSettings}>Save Financial Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feature-toggles">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(featureToggles).map(([feature, isEnabled]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <Label htmlFor={feature} className="text-sm font-medium">
                        {feature.charAt(0).toUpperCase() + feature.slice(1)}
                      </Label>
                      <Switch
                        id={feature}
                        checked={isEnabled}
                        onCheckedChange={() => handleFeatureToggle(feature as keyof typeof featureToggles)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

