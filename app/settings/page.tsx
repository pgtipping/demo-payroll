"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import ErrorBoundary from "@/components/ErrorBoundary"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  return (
    <ErrorBoundary>
      <SettingsContent />
    </ErrorBoundary>
  )
}

function SettingsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+1234567890" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. We recommend using a strong, unique password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch id="emailNotifications" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch id="smsNotifications" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="payslipNotifications">New Payslip Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when a new payslip is available</p>
                </div>
                <Switch id="payslipNotifications" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report a Bug</CardTitle>
              <CardDescription>Let us know about any issues you've encountered.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bugTitle">Bug Title</Label>
                  <Input id="bugTitle" placeholder="Brief description of the issue" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bugDescription">Bug Description</Label>
                  <Textarea
                    id="bugDescription"
                    placeholder="Please provide details about the bug, including steps to reproduce"
                    rows={5}
                  />
                </div>
                <Button type="submit">Submit Bug Report</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Request a Feature</CardTitle>
              <CardDescription>Suggest new features or improvements.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="featureTitle">Feature Title</Label>
                  <Input id="featureTitle" placeholder="Brief description of the feature" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featureDescription">Feature Description</Label>
                  <Textarea
                    id="featureDescription"
                    placeholder="Please provide details about the feature and why it would be useful"
                    rows={5}
                  />
                </div>
                <Button type="submit">Submit Feature Request</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Suggest Improvements</CardTitle>
              <CardDescription>Share your ideas on how we can enhance the app.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="improvementArea">Area for Improvement</Label>
                  <Select>
                    <SelectTrigger id="improvementArea">
                      <SelectValue placeholder="Select an area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ui">User Interface</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="functionality">Functionality</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="improvementDescription">Suggestion Details</Label>
                  <Textarea
                    id="improvementDescription"
                    placeholder="Please describe your suggestion for improvement"
                    rows={5}
                  />
                </div>
                <Button type="submit">Submit Suggestion</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

