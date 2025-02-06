"use client";

import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    payslip: boolean;
  };
}

interface AttachedFile extends File {
  preview: string;
}

export default function SettingsPage() {
  return (
    <ErrorBoundary>
      <SettingsContent />
    </ErrorBoundary>
  );
}

function SettingsContent() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notifications: {
      email: false,
      sms: false,
      payslip: true,
    },
  });
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [toast]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      attachedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [attachedFiles]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) throw new Error("Failed to update password");

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      // Reset form
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map((file) =>
      Object.assign(file, {
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : "",
      })
    );
    setAttachedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (file: AttachedFile) => {
    URL.revokeObjectURL(file.preview);
    setAttachedFiles((prev) => prev.filter((f) => f.preview !== file.preview));
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    type: "bug" | "feature" | "improvement"
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("type", type);
    formData.append("userEmail", user?.email || "");
    formData.append("userName", `${user?.firstName} ${user?.lastName}`);

    // Append files
    attachedFiles.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        body: formData,
      });

      if (response.status === 429) {
        setIsRateLimited(true);
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      if (!response.ok) throw new Error("Failed to submit feedback");

      const data = await response.json();
      toast({
        title: "Thank you!",
        description: data.message,
      });

      // Reset form and files
      e.currentTarget.reset();
      setAttachedFiles([]);
      setIsRateLimited(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
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
              <CardDescription>
                Update your personal information here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{`${profileData.firstName[0]}${profileData.lastName[0]}`}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button onClick={handleProfileUpdate} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. We recommend using a strong, unique
                password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={profileData.notifications.email}
                  onCheckedChange={(checked) =>
                    setProfileData({
                      ...profileData,
                      notifications: {
                        ...profileData.notifications,
                        email: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={profileData.notifications.sms}
                  onCheckedChange={(checked) =>
                    setProfileData({
                      ...profileData,
                      notifications: {
                        ...profileData.notifications,
                        sms: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="payslipNotifications">
                    New Payslip Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a new payslip is available
                  </p>
                </div>
                <Switch
                  id="payslipNotifications"
                  checked={profileData.notifications.payslip}
                  onCheckedChange={(checked) =>
                    setProfileData({
                      ...profileData,
                      notifications: {
                        ...profileData.notifications,
                        payslip: checked,
                      },
                    })
                  }
                />
              </div>
              <Button onClick={handleProfileUpdate} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="support" className="space-y-4">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Help us improve!</h2>
            <p className="text-sm text-muted-foreground">
              Your feedback helps us make the app better. Let us know about any
              issues, feature requests, or suggestions for improvement.
            </p>
          </div>

          {/* Bug Report Card */}
          <Card>
            <CardHeader>
              <CardTitle>Report a Bug</CardTitle>
              <CardDescription>
                Let us know about any issues you've encountered.
                {isRateLimited && (
                  <p className="text-destructive mt-2">
                    You've reached the maximum number of submissions. Please try
                    again later.
                  </p>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => handleFeedbackSubmit(e, "bug")}
              >
                <div className="space-y-2">
                  <Label htmlFor="bugTitle">Bug Title</Label>
                  <Input
                    id="bugTitle"
                    name="bugTitle"
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bugDescription">Bug Description</Label>
                  <Textarea
                    id="bugDescription"
                    name="bugDescription"
                    placeholder="Please provide details about the bug, including steps to reproduce"
                    rows={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Attachments (Optional)</Label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        multiple
                        accept="image/*,.pdf,text/plain"
                        aria-label="File upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isRateLimited}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Add Files
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Max 5MB per file. Images, PDFs, and text files only.
                      </p>
                    </div>

                    {attachedFiles.length > 0 && (
                      <ScrollArea className="h-32 w-full rounded-md border">
                        <div className="p-4 space-y-2">
                          {attachedFiles.map((file) => (
                            <div
                              key={file.preview || file.name}
                              className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                            >
                              {file.type.startsWith("image/") &&
                              file.preview ? (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  className="h-8 w-8 rounded object-cover"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs">
                                  {file.type.split("/")[1]?.toUpperCase() ||
                                    "FILE"}
                                </div>
                              )}
                              <span className="text-sm flex-1 truncate">
                                {file.name}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting || isRateLimited}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Bug Report"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Feature Request Card */}
          <Card>
            <CardHeader>
              <CardTitle>Request a Feature</CardTitle>
              <CardDescription>
                Suggest new features that would help you work better.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => handleFeedbackSubmit(e, "feature")}
              >
                <div className="space-y-2">
                  <Label htmlFor="featureTitle">Feature Title</Label>
                  <Input
                    id="featureTitle"
                    name="featureTitle"
                    placeholder="Brief description of the feature"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featureDescription">
                    Feature Description
                  </Label>
                  <Textarea
                    id="featureDescription"
                    name="featureDescription"
                    placeholder="Please describe the feature and how it would benefit you"
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feature Request"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Improvements Card */}
          <Card>
            <CardHeader>
              <CardTitle>Suggest Improvements</CardTitle>
              <CardDescription>
                Share your ideas on how we can enhance the app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => handleFeedbackSubmit(e, "improvement")}
              >
                <div className="space-y-2">
                  <Label htmlFor="improvementArea">Area for Improvement</Label>
                  <Select name="improvementArea" required>
                    <SelectTrigger id="improvementArea">
                      <SelectValue placeholder="Select an area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ui">User Interface</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="functionality">
                        Functionality
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="improvementTitle">Title</Label>
                  <Input
                    id="improvementTitle"
                    name="improvementTitle"
                    placeholder="Brief description of your suggestion"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="improvementDescription">
                    Suggestion Details
                  </Label>
                  <Textarea
                    id="improvementDescription"
                    name="improvementDescription"
                    placeholder="Please describe your suggestion and its benefits"
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Suggestion"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
