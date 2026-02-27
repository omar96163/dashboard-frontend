"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Image from "next/image";
import {
  LogOut,
  User,
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout } = useAuthStore();
  const hydrate = useAuthStore((s) => s.hydrate);

  // ✅ state للتحكم بالـ Hydration
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrate();
    setTimeout(() => setMounted(true), 0);
  }, [hydrate]);

  // 🟡 منع أي رندر قبل mount
  if (!mounted) return null;

  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج بنجاح");
    router.push("/");
  };

  const getNavItems = () => {
    if (!user) return [];

    const items = [
      {
        label: "الرئيسية",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "الملف الشخصي",
        href: "/dashboard/profile",
        icon: User,
      },
    ];

    if (user.role === "admin") {
      items.push({
        label: "المستخدمين",
        href: "/dashboard/admin",
        icon: Users,
      });
    } else if (user.role === "freelancer") {
      items.push({
        label: "خدماتي",
        href: "/dashboard/freelancer",
        icon: Briefcase,
      });
    } else if (user.role === "client") {
      items.push({
        label: "حجوزاتي",
        href: "/dashboard/client",
        icon: Calendar,
      });
    }

    return items;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="shrink-0 flex items-center">
                  <h1 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                </div>
                <div className="flex space-x-2">
                  {getNavItems().map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href === "/dashboard" &&
                        pathname.startsWith("/dashboard/"));
                    return (
                      <button
                        key={item.href}
                        onClick={() => router.push(item.href)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-black text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100 hover:text-black"
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {user && (
                  <button
                    onClick={() => router.push("/dashboard/profile")}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-black transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    {user.avatar && user.avatar !== "default" ? (
                      <Image
                        src={`${
                          process.env.NEXT_PUBLIC_API_BASE_URL ||
                          "https://current-janela-omaralbaz-22690ac0.koyeb.app/api"
                        }/uploads/${user.avatar}`}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover border-2 border-gray-200"
                        unoptimized // لحل مشاكل backend headers لو ظهرت
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-semibold">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">
                        {user.role === "admin"
                          ? "مدير"
                          : user.role === "freelancer"
                          ? "مستقل"
                          : "عميل"}
                      </span>
                    </div>
                  </button>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut size={18} />
                  <span>تسجيل الخروج</span>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
