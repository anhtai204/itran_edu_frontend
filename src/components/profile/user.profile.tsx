"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  User,
  Settings,
  Shield,
  BarChart2,
  Edit2,
  Calendar,
  Phone,
  MapPin,
  Mail,
  EyeOff,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ai from "../../assets/images/ai.webp";
import { sendRequest } from "@/utils/api";
import { auth } from "@/auth";
import { changePasswordWithoutCode, handleGetUserById } from "@/utils/action";
import { Switch } from "@/components/ui/switch";

// User type based on schema
interface UserData {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  address: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: {
    id: number;
    name: string;
  };
  is_active: boolean;
  last_login_at: string | null;
  failed_login_attempts: number | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  notification_preferences: {
    name: string;
    status: boolean;
  }[];
  created_at: string;
  updated_at: string;
}

const mockUser: UserData = {
  id: "123",
  username: "johndoe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  bio: "Passionate about web development and open source.",
  address: "123 Tech St, San Francisco, CA",
  full_name: "John Doe",
  avatar_url: "/placeholder.svg?height=200&width=200",
  role: {
    id: 1,
    name: "Admin",
  },
  is_active: true,
  last_login_at: "2025-04-06",
  failed_login_attempts: 0,
  date_of_birth: "1990-01-01",
  gender: "male",
  notification_preferences: [
    { name: "email", status: true },
    { name: "sms", status: false },
  ],
  created_at: "2020-05-10",
  updated_at: "2025-04-06",
};

const ProfilePage = () => {
  const [user, setUser] = useState<UserData>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: user.full_name || "",
    username: user.username,
    email: user.email,
    phone: user.phone || "",
    bio: user.bio || "",
    address: user.address || "",
    date_of_birth: user.date_of_birth ? format(parseISO(user.date_of_birth), "yyyy-MM-dd") : "",
    gender: user.gender || "other",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await handleGetUserById();
        if (res.statusCode === 200) {
          // Xử lý các giá trị null thành chuỗi rỗng
          const fetchedUser: UserData = {
            ...res.data,
            phone: res.data.phone ?? "",
            bio: res.data.bio ?? "",
            address: res.data.address ?? "",
            full_name: res.data.full_name ?? "",
            avatar_url: res.data.avatar_url ?? "",
            last_login_at: res.data.last_login_at ?? "",
            failed_login_attempts: res.data.failed_login_attempts ?? 0,
            date_of_birth: res.data.date_of_birth ?? "",
            gender: res.data.gender ?? "other",
            notification_preferences: res.data.notification_preferences ?? [
              { name: "email", status: true },
              { name: "sms", status: false },
            ],
          };
          console.log('>>>fetchedUser', fetchedUser);
          setUser(fetchedUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      }
    })();
  }, []);

  useEffect(() => {
    setEditFormData({
      full_name: user.full_name || "",
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      bio: user.bio || "",
      address: user.address || "",
      date_of_birth: user.date_of_birth ? format(parseISO(user.date_of_birth), "yyyy-MM-dd") : "",
      gender: user.gender || "other",
    });
  }, [user]);

  const handleEditProfile = () => setIsEditing(true);

  const handleSaveProfile = async () => {
    try {
      const res = await sendRequest<any>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/postgres/${user.id}`,
        body: {
          ...editFormData,
          notification_preferences: user.notification_preferences, // Gửi mảng trực tiếp
        },
      });

      if (res.statusCode === 200) {
        setUser({
          ...user,
          ...editFormData,
          role: res.data.role,
        });
        setIsEditing(false);
        toast("Profile updated successfully!");
      } else {
        toast.error(res.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("An error occurred while updating profile.");
    }
  };

  // Hàm xử lý đổi mật khẩu
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ các trường mật khẩu.");
      return;
    }

    try {
      const res = await changePasswordWithoutCode(
        user.id,
        oldPassword,
        newPassword,
        confirmPassword
      );
      if (res?.statusCode === 200) {
        toast("Đổi mật khẩu thành công!");
        // Reset các trường sau khi thành công
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res?.message || "Đổi mật khẩu thất bại.");
      }
    } catch (error: any) {
      toast.error(error.message || "Đã xảy ra lỗi khi đổi mật khẩu.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      full_name: user.full_name || "",
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      bio: user.bio || "",
      address: user.address || "",
      date_of_birth: user.date_of_birth || "",
      gender: user.gender || "other",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
        <Image
          src={ai || "/placeholder.svg"}
          alt="Cover Image"
          width={1200}
          height={300}
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute bottom-0 left-4 md:left-8 flex items-end gap-4 -translate-y-1/2">
          <Avatar className="w-10 h-10 md:w-20 md:h-20 border-4 border-white dark:border-gray-900">
            <AvatarImage src={user.avatar_url || ""} alt={user.username} />
            <AvatarFallback>
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="p-3 rounded-t-lg shadow">
            <h1 className="text-2xl md:text-2xl font-bold text-white dark:text-white">
              {user.full_name || user.username}
            </h1>
            <p className="text-sm text-gray-200 dark:text-gray-400">
              @{user.username}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <Card className="mt-16 md:mt-20">
        <CardContent className="pt-6 space-y-6">
          {isEditing ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="full_name" className="mb-2">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  value={editFormData.full_name}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      full_name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="username" className="mb-2">
                  Username
                </Label>
                <Input
                  id="username"
                  value={editFormData.username}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email" className="mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone" className="mb-2">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="date_of_birth" className="mb-2">
                  Date of Birth
                </Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={editFormData.date_of_birth}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      date_of_birth: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Gender</Label>
                <Select
                  value={editFormData.gender}
                  onValueChange={(value) =>
                    setEditFormData({
                      ...editFormData,
                      gender: value as "male" | "female" | "other",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio" className="mb-2">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={editFormData.bio}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, bio: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="mb-2">
                  Address
                </Label>
                <Input
                  id="address"
                  value={editFormData.address}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      address: e.target.value,
                    })
                  }
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>Save</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                {user.bio || "No bio provided."}
              </p>
              <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{user.address}</span>
                  </div>
                )}
                {user.date_of_birth && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Born{" "}
                      {format(new Date(user.date_of_birth), "MMMM d, yyyy")}
                    </span>
                  </div>
                )}
                {user.gender && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      {user.gender.charAt(0).toUpperCase() +
                        user.gender.slice(1)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {format(new Date(user.created_at), "MMMM yyyy")}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleEditProfile}
                className="rounded-full"
              >
                <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Card>
        <Tabs defaultValue="overview" className="w-full px-3">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <TabsTrigger
              value="overview"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-500"
            >
              <BarChart2 className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-500"
            >
              <Settings className="h-4 w-4 mr-2" /> Settings
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-500"
            >
              <Shield className="h-4 w-4 mr-2" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <CardContent className="pt-6 space-y-4">
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                A summary of your activity and stats.
              </CardDescription>
              <Separator className="my-4" />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Account Status</Label>
                  <p>
                    <Badge variant={user.is_active ? "default" : "destructive"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label>Last Login</Label>
                  <p>
                    {user.last_login_at
                      ? format(new Date(user.last_login_at), "MMMM d, yyyy")
                      : "Never"}
                  </p>
                </div>
                <div>
                  <Label>Failed Login Attempts</Label>
                  <p>
                    <Badge variant="secondary">
                      {user.failed_login_attempts || 0}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label>Role</Label>
                  <p>
                    <Badge variant="outline">
                      {user.role.name.charAt(0).toUpperCase() +
                        user.role.name.slice(1)}
                    </Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="settings">
            <CardContent className="pt-6 space-y-4">
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your account preferences.
              </CardDescription>
              <Separator className="my-4" />
              <div className="grid gap-4">
                <div>
                  <Label className="mb-2">Notification Preferences</Label>
                  <div className="space-y-2">
                    {user.notification_preferences.map((pref) => (
                      <div
                        key={pref.name}
                        className="flex items-center justify-between rounded-lg border p-3 shadow-sm"
                      >
                        <Label
                          htmlFor={pref.name}
                          className="cursor-pointer flex-1"
                        >
                          {pref.name.charAt(0).toUpperCase() +
                            pref.name.slice(1)}{" "}
                          Notifications
                        </Label>
                        <Switch
                          id={pref.name}
                          checked={pref.status}
                          onCheckedChange={(checked) => {
                            const updatedPrefs =
                              user.notification_preferences.map((p) =>
                                p.name === pref.name
                                  ? { ...p, status: checked }
                                  : p
                              );
                            setUser({
                              ...user,
                              notification_preferences: updatedPrefs,
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    try {
                      const res = await sendRequest<any>({
                        method: "PATCH",
                        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/postgres/${user.id}`,
                        body: {
                          notification_preferences:
                            user.notification_preferences, // Gửi mảng trực tiếp
                        },
                      });
                      if (res.statusCode === 200) {
                        toast("Settings saved!");
                      } else {
                        toast.error(res.message || "Failed to save settings.");
                      }
                    } catch (error) {
                      console.error("Error saving settings:", error);
                      toast.error("An error occurred while saving settings.");
                    }
                  }}
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="security">
            <CardContent className="pt-6 space-y-4">
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your account security settings.
              </CardDescription>
              <Separator className="my-4" />
              <div className="grid gap-4">
                <div>
                  <Label className="mb-2">Change Password</Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Current Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <Button variant="outline" className="mt-2">
                    Enable 2FA
                  </Button>
                </div>
                <Button onClick={handleChangePassword}>Update Security</Button>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfilePage;
