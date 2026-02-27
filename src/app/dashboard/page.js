"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { ROLES } from "@/constants";

export default function DashboardPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();

  // الحصول على user من localStorage أو store
  const currentUser = useMemo(() => {
    if (user) return user;

    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          return JSON.parse(storedUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }

    return null;
  }, [user]);

  // تحميل user في store إذا كان موجوداً في localStorage
  useEffect(() => {
    if (!user && currentUser) {
      useAuthStore.getState().setUser(currentUser);
    }
  }, [user, currentUser]);

  // إعادة التوجيه حسب الدور
  useEffect(() => {
    if (currentUser) {
      const roleRoutes = {
        [ROLES.ADMIN]: "/dashboard/admin",
        [ROLES.FREELANCER]: "/dashboard/freelancer",
        [ROLES.CLIENT]: "/dashboard/client",
      };

      const redirectTo = roleRoutes[currentUser.role];
      if (redirectTo) {
        router.replace(redirectTo);
      }
    }
  }, [currentUser, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-600">جاري التحويل...</p>
      </div>
    </div>
  );
}
