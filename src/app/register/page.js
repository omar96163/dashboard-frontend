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

const RegisterSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
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

      const res = await api.post("users/register", formData, {
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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl text-center bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Create an account
          </CardTitle>
          <p className="text-center text-gray-500 mt-2">
            Sign up to get started
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الصورة الشخصية (اختياري)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
                disabled={loading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800 disabled:opacity-50"
              />
            </div>
            <div>
              <Input
                {...register("name")}
                placeholder="Full Name"
                type="text"
                disabled={loading}
                className={errors.name ? "ring-red-500 ring-1" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.name.message}
                </p>
              )}
            </div>
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
            <div>
              <Input
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                type="password"
                disabled={loading}
                className={errors.confirmPassword ? "ring-red-500 ring-1" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-black font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
