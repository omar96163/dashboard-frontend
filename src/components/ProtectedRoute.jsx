"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { ROLES } from "@/constants";

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { token, user } = useAuthStore();

  // حساب حالة الـ auth من localStorage مباشرة
  const authState = useMemo(() => {
    if (typeof window === "undefined") {
      return { hasToken: false, hasUser: false };
    }

    const storedToken = localStorage.getItem("token");
    let storedUser = null;

    try {
      const userStr = localStorage.getItem("user");
      storedUser = userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }

    const hasToken = !!(storedToken || token);
    const currentUser = user || storedUser;
    const hasUser = !!currentUser;

    return { hasToken, hasUser, user: currentUser, storedToken };
  }, [token, user]);

  // تحميل user من localStorage إذا لم يكن موجوداً في store
  useEffect(() => {
    if (authState.hasToken && !user && authState.user) {
      useAuthStore.getState().setUser(authState.user);
    }
  }, [authState.hasToken, authState.user, user]);

  // التحقق من token وإعادة التوجيه
  useEffect(() => {
    if (!authState.hasToken) {
      router.replace("/");
    }
  }, [authState.hasToken, router]);

  // التحقق من الصلاحيات وإعادة التوجيه
  useEffect(() => {
    if (!authState.hasToken || !authState.hasUser) return;

    const currentUser = user || authState.user;
    if (currentUser && allowedRoles.length > 0) {
      if (!allowedRoles.includes(currentUser.role)) {
        const roleRoutes = {
          [ROLES.ADMIN]: "/dashboard/admin",
          [ROLES.FREELANCER]: "/dashboard/freelancer",
          [ROLES.CLIENT]: "/dashboard/client",
        };
        const redirectTo = roleRoutes[currentUser.role] || "/dashboard";
        router.replace(redirectTo);
      }
    }
  }, [
    authState.hasToken,
    authState.hasUser,
    authState.user,
    user,
    allowedRoles,
    router,
  ]);

  // إذا لم يكن هناك token
  if (!authState.hasToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // التحقق من الصلاحيات
  const currentUser = user || authState.user;
  if (
    allowedRoles.length > 0 &&
    currentUser &&
    !allowedRoles.includes(currentUser.role)
  ) {
    return null;
  }

  return children;
}
