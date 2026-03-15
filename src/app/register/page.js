"use client";

import { z } from "zod";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatErrorMessage } from "@/lib/errorHandler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "يجب أن يكون الإسم مكون من حرفين علي الأقل" }),
    email: z
      .string()
      .email({ message: "من فضلك أدخل بريداً إلكترونياً صحيحاً" }),
    password: z.string().min(8, {
      message: "يجب أن تكون كلمة المرور مكونة من 8 أحرف علي الاأقل",
    }),
    confirmPassword: z.string().min(8, { message: "من فضلك أكد كلمة المرور" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمت المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;

      // إعداد FormData لرفع الصورة
      const formData = new FormData();
      Object.keys(registerData).forEach((key) => {
        formData.append(key, registerData[key]);
      });
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await api.post("/api/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const token = res.data.token;
      const user = res.data.data.newuser || res.data.data.user || res.data.data;
      const message = res.data.message;

      login(token, user);
      toast.success(message || "Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br via-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card
          className="md:w-125 shadow-xl border border-indigo-200 bg-linear-to-br via-indigo-100 
          hover:shadow-2xl hover:shadow-gray-400 transition-all duration-300 p-6"
        >
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              قم بإنشاء حساب جديد
            </CardTitle>
            <p className="text-center text-gray-500 mt-2">
              ابدأ رحلتك معنا الآن
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col items-center bg-linear-to-bl via-indigo-200 rounded-full py-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  صورتك الشخصية (اختياري)
                </label>
                <div className="relative w-32 h-32 rounded-full bg-indigo-100 overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow border-2 border-indigo-300">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-indigo-500 text-3xl">
                      📷
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={loading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setAvatarFile(file);
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setAvatarPreview(url);
                      } else {
                        setAvatarPreview(null);
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">انقر لتغيير الصورة</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسمك الكامل
                </label>
                <Input
                  {...register("name")}
                  placeholder="محمد علي"
                  type="text"
                  disabled={loading}
                  className={`bg-white/50 border border-indigo-200/50 focus:border-indigo-500 focus:ring-indigo-500 ${
                    errors.name ? "ring-red-500 ring-1" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                    <span>❌</span> {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <Input
                  {...register("email")}
                  placeholder="example@example.com"
                  type="email"
                  disabled={loading}
                  className={`bg-white/50 border border-indigo-200/50 focus:border-indigo-500 focus:ring-indigo-500 ${
                    errors.email ? "ring-red-500 ring-1" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                    <span>❌</span> {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <Input
                  {...register("password")}
                  placeholder="••••••••"
                  type="password"
                  disabled={loading}
                  className={`bg-white/50 border border-indigo-200/50 focus:border-indigo-500 focus:ring-indigo-500 ${
                    errors.password ? "ring-red-500 ring-1" : ""
                  }`}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                    <span>❌</span> {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <Input
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  type="password"
                  disabled={loading}
                  className={`bg-white/50 border border-indigo-200/50 focus:border-indigo-500 focus:ring-indigo-500 ${
                    errors.confirmPassword ? "ring-red-500 ring-1" : ""
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                    <span>❌</span> {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-linear-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block animate-spin">⏳</span>
                      جاري إنشاء الحساب...
                    </span>
                  ) : (
                    "إنشاء حساب"
                  )}
                </Button>
              </motion.div>
              <p className="text-center text-sm text-gray-600 mt-6">
                هل لديك حسلب بالفعل ؟ {""}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors cursor-pointer"
                >
                  تسجيل الدخول
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
