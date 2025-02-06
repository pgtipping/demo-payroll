"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { employeeApi, ApiProfileResponse } from "@/lib/services/api";
import { showToast } from "@/components/ui/toast";
import { useFeatures } from "@/lib/config/features";
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
  const [profileData, setProfileData] = useState<ApiProfileResponse>({
    firstName: "",
    lastName: "",
    email: "",
    notifications: {
      email: false,
      push: false,
      sms: false,
    },
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { isEnabled } = useFeatures();

  useEffect(() => {
    // MVP: Profile management is a core feature for all users
    if (!isEnabled("profileManagement")) {
      router.push("/dashboard");
      return;
    }

    loadProfile();
  }, [isEnabled, router]);

  const loadProfile = async () => {
    // MVP: Profile data loading is essential for user information management
    if (!isEnabled("profileManagement")) {
      router.push("/dashboard");
      return;
    }
    try {
      const response = await employeeApi.getProfile();
      if (response.data) {
        const data = response.data as ApiProfileResponse;
        setProfileData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          notifications: data.notifications || {
            email: false,
            push: false,
            sms: false,
          },
        });
      } else if (response.error) {
        showToast.error("Failed to load profile", {
          description: response.error,
        });
      }
    } catch (error) {
      showToast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // MVP: Profile updates are essential for user data management
    if (!isEnabled("profileManagement")) {
      return;
    }
    setIsSaving(true);

    try {
      const response = await employeeApi.updateProfile(profileData);
      if (response.error) {
        throw new Error(response.error);
      }
      showToast.success("Profile updated successfully");
    } catch (error) {
      showToast.error("Failed to update profile", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // MVP: Password management is essential for user account security
    if (!isEnabled("basicAuth")) {
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast.error("Passwords do not match");
      return;
    }

    setIsSaving(true);

    try {
      const response = await employeeApi.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      if (response.error) {
        throw new Error(response.error);
      }
      showToast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showToast.error("Failed to change password", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // MVP: File attachment handling is essential for user support documentation
    if (!isEnabled("profileManagement")) {
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
    // MVP: User feedback submission is essential for product improvement
    if (!isEnabled("profileManagement")) {
      return;
    }
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
      showToast.success(data.message);

      e.currentTarget.reset();
      setAttachedFiles([]);
      setIsRateLimited(false);
    } catch (error) {
      showToast.error("Failed to submit feedback", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationSettings = async () => {
    // MVP: Notification preferences management is essential for user communication
    if (!isEnabled("profileManagement")) {
      return;
    }

    try {
      const response = await employeeApi.updateProfile({
        ...profileData,
        notifications: profileData.notifications,
      });
      if (response.error) {
        throw new Error(response.error);
      }
      showToast.success("Notification settings updated successfully");
    } catch (error) {
      showToast.error("Failed to update notification settings", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  if (isLoading) {
    return <PageLoading />;
  }

  // MVP: Profile management view is restricted to authenticated users
  if (!isEnabled("profileManagement")) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                          setProfileData((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
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
                          setProfileData((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
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
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
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
                        setProfileData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Input
                      id="address"
                      value={profileData.address || ""}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
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

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
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
                        setPasswordData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
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
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
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
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
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
                    checked={profileData.notifications.push}
                    onCheckedChange={(checked) =>
                      setProfileData({
                        ...profileData,
                        notifications: {
                          ...profileData.notifications,
                          push: checked,
                        },
                      })
                    }
                  />
                </div>
                <Button
                  onClick={handleNotificationSettings}
                  disabled={isSaving}
                >
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
