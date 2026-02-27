"use client";

import { z } from "zod";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatErrorMessage } from "@/lib/errorHandler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
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
      const res = await api.post("users/login", data);
      const token = res.data.token;
      const user = res.data.data.user;
      const message = res.data.message;

      login(token, user);
      toast.success(message || "Welcome back!");

      // استخدام setTimeout لضمان حفظ البيانات قبل التوجيه
      setTimeout(() => {
        router.replace("/dashboard");
      }, 100);
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl text-center bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome back
          </CardTitle>
          <p className="text-center text-gray-500 mt-2">
            Sign in to your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register("email")}
                placeholder="Email"
                type="email"
                disabled={loading}
                className={errors.email ? "ring-red-500 ring-1" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register("password")}
                placeholder="Password"
                type="password"
                disabled={loading}
                className={errors.password ? "ring-red-500 ring-1" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Do you have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-black font-medium hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
