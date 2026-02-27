"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { User, Loader2, Camera } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useMyAccount, useUpdateUser } from "@/hooks/useUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z
    .string()
    .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" })
    .optional()
    .or(z.literal("")),
});

export default function ProfilePage() {
  const { data: myAccount, isLoading } = useMyAccount();
  const updateUser = useUpdateUser();
  const { user, setUser } = useAuthStore();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (myAccount) {
      reset({
        name: myAccount.name || "",
        email: myAccount.email || "",
        password: "",
      });

      if (myAccount.avatar && myAccount.avatar !== "default") {
        setTimeout(() => {
          setAvatarPreview(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}uploads/${myAccount.avatar}`,
          );
        }, 0);
      }
    }
  }, [myAccount, reset]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const updateData = {
      name: data.name,
      email: data.email,
    };
    if (data.password) {
      updateData.password = data.password;
    }

    try {
      const updatedUser = await updateUser.mutateAsync({
        id: myAccount._id,
        data: updateData,
        file: avatarFile,
      });

      // تحديث الـ store
      setUser(updatedUser);
    } catch (error) {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
          <p className="text-gray-600 mt-2">إدارة معلومات حسابك</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User size={20} />
              <span>المعلومات الشخصية</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      width={96}
                      height={96}
                      className="rounded-full object-cover border-4 border-gray-200 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-2xl font-semibold border-4 border-gray-200 shadow-md">
                      {myAccount?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer hover:bg-gray-800 transition-colors shadow-lg"
                  >
                    <Camera size={16} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={updateUser.isPending}
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    الصورة الشخصية
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    اضغط على الأيقونة لتغيير الصورة
                  </p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم
                </label>
                <Input
                  {...register("name")}
                  placeholder="الاسم الكامل"
                  disabled={updateUser.isPending}
                  className={errors.name ? "ring-red-500 ring-1" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="example@email.com"
                  disabled={updateUser.isPending}
                  className={errors.email ? "ring-red-500 ring-1" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الجديدة (اتركها فارغة إذا لم ترد التغيير)
                </label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="كلمة المرور الجديدة"
                  disabled={updateUser.isPending}
                  className={errors.password ? "ring-red-500 ring-1" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Role Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الدور
                </label>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm">
                  {myAccount?.role === "admin"
                    ? "مدير"
                    : myAccount?.role === "freelancer"
                      ? "مستقل"
                      : "عميل"}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={updateUser.isPending}
                  className="min-w-30"
                >
                  {updateUser.isPending ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 ml-2" />
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
