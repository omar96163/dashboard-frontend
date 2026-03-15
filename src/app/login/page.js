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

const LoginSchema = z.object({
  email: z.string().email({ message: "من فضلك أدخل بريداً إلكترونياً صحيحاً" }),
  password: z
    .string()
    .min(8, { message: "كلمة المرور يجب أن تكون علي الأقل 8 أحرف" }),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/api/users/login", data);
      const token = res.data.token;
      const user = res.data.data.user;
      const message = res.data.message;

      login(token, user);
      toast.success(message || "Welcome back!");
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
          className="md:w-125 shadow-xl border border-indigo-200 hover:shadow-2xl p-6
          hover:shadow-gray-400 transition-all duration-300 bg-linear-to-br via-indigo-100"
        >
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              أهلاً بعودتك
            </CardTitle>
            <p className="text-center text-gray-500 mt-2">
              سجل الدخول إلى حسابك
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      جاري تسجيل الدخول...
                    </span>
                  ) : (
                    "تسجيل الدخول"
                  )}
                </Button>
              </motion.div>
              <p className="text-center text-sm text-gray-600 mt-6">
                ليس لديك حساب ؟ {""}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors cursor-pointer"
                >
                  إنشاء حساب جديد
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
