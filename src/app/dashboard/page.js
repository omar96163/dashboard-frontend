"use client";

import Image from "next/image";
import { toast } from "sonner";
import { ROLES } from "@/constants";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useMemo, useState } from "react";
import ProfilePage from "@/components/pages/ProfilePage";
import AdminDashboard from "@/components/pages/AdminDashboard";
import ClientDashboard from "@/components/pages/ClientDashboard";
import FreelancerDashboard from "@/components/pages/FreelancerDashboard";
import {
  LogOut,
  User,
  Users,
  Briefcase,
  Calendar,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout, hydrate, isHydrated } = useAuthStore();

  const [view, setView] = useState(null);

  const [activeItem, setActiveItem] = useState(null);
  const [showProfile, setshowProfile] = useState(false);

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
      return;
    }
    if (!user || !token) {
      logout();
      toast.error("من فضلك سجل الدخول مرة أُخري");
      router.replace("/");
    }
  }, [isHydrated]);

  useEffect(() => {
    setTimeout(() => {
      if (user?.role === ROLES.ADMIN) {
        setActiveItem("لوحة تحكم الإدارة");
        setView(ROLES.ADMIN);
      }
      if (user?.role === ROLES.CLIENT) {
        setActiveItem("لوحة تحكم العملاء");
        setView(ROLES.CLIENT);
      }
      if (user?.role === ROLES.FREELANCER) {
        setActiveItem("لوحة تحكم المبدعين");
        setView(ROLES.FREELANCER);
      }
    }, 0);
  }, [user?.role]);

  const navItems = useMemo(() => {
    if (!user) return [];
    const items = [
      {
        label: "الملف الشخصي",
        icon: User,
        action: () => {
          setshowProfile(true);
        },
      },
    ];
    if (user.role === ROLES.ADMIN) {
      items.push({
        label: "لوحة تحكم الإدارة",
        icon: Users,
        action: () => {
          setshowProfile(false);
        },
      });
    } else if (user.role === ROLES.FREELANCER) {
      items.push({
        label: "لوحة تحكم المبدعين",
        icon: Briefcase,
        action: () => {
          setshowProfile(false);
        },
      });
    } else if (user.role === ROLES.CLIENT) {
      items.push({
        label: "لوحة تحكم العملاء",
        icon: Calendar,
        action: () => {
          setshowProfile(false);
        },
      });
    }
    return items;
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج بنجاح");
    router.push("/");
  };

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <p className="mt-4 text-gray-600 animate-pulse">
          جاري تحديث البيانات ...
        </p>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <p className="mt-4 text-gray-600 animate-pulse">
          جاري التحويل إلي الصفحة الرئيسية ...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-50/50 via-white to-blue-50/50">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.1,
          ease: "easeOut",
        }}
        viewport={{ once: true }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex flex-row-reverse gap-3">
                {navItems.map((item) => {
                  const isActive = activeItem === item.label;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setActiveItem(item.label);
                        item.action?.();
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-linear-to-r from-indigo-600 to-blue-500 text-white shadow-md"
                          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={isActive ? "text-white" : "text-indigo-600"}
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <button
                  onClick={() => {
                    setshowProfile(true);
                    setActiveItem("الملف الشخصي");
                  }}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-black transition-colors px-3 py-2 rounded-lg 
                  hover:bg-gray-100 cursor-pointer"
                >
                  {user.avatar && user.avatar !== "default" ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${user.avatar}`}
                      alt={user.name}
                      width={0}
                      height={0}
                      className="rounded-full object-cover border-2 border-gray-200 w-9 h-9"
                      unoptimized // لحل مشاكل backend headers لو ظهرت
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-gray-500">
                      {user.role === ROLES.ADMIN
                        ? "مدير"
                        : user.role === ROLES.FREELANCER
                          ? "مستقل"
                          : user.role === ROLES.CLIENT
                            ? "عميل"
                            : ""}
                    </span>
                  </div>
                </button>
              )}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 cursor-pointer"
              >
                <span>تسجيل الخروج</span>
                <LogOut size={18} className="text-indigo-600 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-340 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showProfile ? (
          <ProfilePage />
        ) : (
          <>
            {view === ROLES.ADMIN && <AdminDashboard />}
            {view === ROLES.CLIENT && <ClientDashboard />}
            {view === ROLES.FREELANCER && <FreelancerDashboard />}
          </>
        )}
      </main>
    </div>
  );
}
