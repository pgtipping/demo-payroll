"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { employeeApi, ApiProfileResponse } from "@/lib/services/api";
import { showToast } from "@/components/ui/toast";
import { useFeatures } from "@/lib/config/features";
import type { FeatureFlag } from "@/lib/config/features";
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
import { PageLoading } from "@/components/ui/loading";
import { useTheme } from "next-themes";

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface AttachedFile extends File {
  preview: string;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences>({
      email: true,
      push: false,
      sms: false,
    });
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { isEnabled } = useFeatures();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!isEnabled("payslipView")) {
      router.push("/dashboard");
      return;
    }

    loadSettings();
  }, [isEnabled, router]);

  const loadSettings = async () => {
    try {
      const [profileRes, notificationsRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/settings/notifications"),
      ]);

      if (profileRes.ok) {
        const profile = await profileRes.json();
        setProfileData(profile);
      }

      if (notificationsRes.ok) {
        const { preferences } = await notificationsRes.json();
        setNotificationPreferences(preferences);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEnabled("payslipView")) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEnabled("payslipView")) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) throw new Error("Failed to change password");

      toast({
        title: "Success",
        description: "Password changed successfully.",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
      toast({
        title: "Error",
        description: "Failed to change password. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = async (
    key: keyof NotificationPreferences
  ) => {
    const newPreferences = {
      ...notificationPreferences,
      [key]: !notificationPreferences[key],
    };

    try {
      const response = await fetch("/api/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: newPreferences }),
      });

      if (!response.ok)
        throw new Error("Failed to update notification preferences");

      setNotificationPreferences(newPreferences);
      toast({
        title: "Success",
        description: "Notification preferences updated.",
      });
    } catch (error) {
      console.error("Failed to update notification preferences:", error);
      toast({
        title: "Error",
        description:
          "Failed to update notification preferences. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEnabled("payslipView")) {
      router.push("/dashboard");
      return;
    }
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

  const handleFeedbackSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    type: "bug" | "feature" | "improvement"
  ) => {
    e.preventDefault();
    if (!isEnabled("payslipView")) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("type", type);
    formData.append("userEmail", profileData.email);
    formData.append(
      "userName",
      `${profileData.firstName} ${profileData.lastName}`
    );

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
        title: "Success",
        description: data.message,
      });

      e.currentTarget.reset();
      setAttachedFiles([]);
      setIsRateLimited(false);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
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
                        required
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
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone || ""}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Input
                      id="address"
                      value={profileData.address || ""}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email.
                    </p>
                  </div>
                  <Switch
                    checked={notificationPreferences.email}
                    onCheckedChange={() => handleNotificationChange("email")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser.
                    </p>
                  </div>
                  <Switch
                    checked={notificationPreferences.push}
                    onCheckedChange={() => handleNotificationChange("push")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS.
                    </p>
                  </div>
                  <Switch
                    checked={notificationPreferences.sms}
                    onCheckedChange={() => handleNotificationChange("sms")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the app looks and feels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred theme.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Changing Password..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Help us improve!</h2>
              <p className="text-sm text-muted-foreground">
                Your feedback helps us make the app better. Let us know about
                any issues, feature requests, or suggestions for improvement.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Report a Bug</CardTitle>
                <CardDescription>
                  Let us know about any issues you've encountered.
                  {isRateLimited && (
                    <p className="text-destructive mt-2">
                      You've reached the maximum number of submissions. Please
                      try again later.
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

                  <Button
                    type="submit"
                    disabled={isSubmitting || isRateLimited}
                  >
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
                    <Label htmlFor="improvementArea">
                      Area for Improvement
                    </Label>
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
    </ErrorBoundary>
  );
}
