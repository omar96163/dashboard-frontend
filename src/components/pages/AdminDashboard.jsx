"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useUsers } from "@/hooks/useUsers";
import { useServices } from "@/hooks/useServices";
import { useBookings } from "@/hooks/useBookings";
import { useAuthStore } from "@/store/useAuthStore";
import AllUsers from "@/components/adminContent/users";
import { Card, CardContent } from "@/components/ui/card";
import AllServices from "@/components/adminContent/services";
import AllBookings from "@/components/adminContent/bookings";
import { Users as UsersIcon, Briefcase, Calendar, Icon } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const { data: users } = useUsers();
  const { data: services } = useServices();
  const { data: bookings } = useBookings();

  const [ActiveButton, setActiveButton] = useState("قائمة المستخدمين");

  const stats = {
    totalServices: services?.totalServices || 0,
    totalBookings: bookings?.length || 0,
    totalUsers: users?.usersCount?.totalUsers || 0,
    totalAdmins: users?.usersCount?.totalAdmins || 0,
    totalClientes: users?.usersCount?.totalClientes || 0,
    totalFreelanceres: users?.usersCount?.totalFreelanceres || 0,
  };

  const buttons = [
    {
      label: "قائمة المستخدمين",
      icon: UsersIcon,
    },
    {
      label: "قائمة الخدمات",
      icon: Briefcase,
    },
    {
      label: "قائمة الحجوزات",
      icon: Calendar,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="space-y-6 text-gray-700"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: "easeOut",
        }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-medium">
            مرحباً بك ,{" "}
            <strong className="text-5xl bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {user.name}
            </strong>{" "}
            👋
          </h1>
          <p className="text-gray-600 mt-4">نظرة عامة على النظام</p>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: "easeOut",
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200 p-6">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[18px] font-medium text-blue-600">
                  إجمالي المستخدمين
                </p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {stats.totalUsers || 0}
                </p>
              </div>
              <div className="bg-blue-500 rounded-full p-3">
                <UsersIcon className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200 p-6">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[18px] font-medium text-green-600">
                  إجمالي الخدمات
                </p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {stats.totalServices}
                </p>
              </div>
              <div className="bg-green-500 rounded-full p-3">
                <Briefcase className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-purple-50 to-purple-100 border-purple-200 p-6">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[18px] font-medium text-purple-600">
                  إجمالي الحجوزات
                </p>
                <p className="text-3xl font-bold text-purple-900 mt-2">
                  {stats.totalBookings}
                </p>
              </div>
              <div className="bg-purple-500 rounded-full p-3">
                <Calendar className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
          ease: "easeOut",
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[16px]">المديرين</span>
              <span className="text-xl font-bold text-red-600">
                {stats.totalAdmins || 0}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[16px]">المبدعين</span>
              <span className="text-xl font-bold text-blue-600">
                {stats.totalFreelanceres || 0}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[16px]">العملاء</span>
              <span className="text-xl font-bold text-green-600">
                {stats.totalClientes || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <section className="grid grid-cols-1 md:grid-cols-[2fr_11fr] gap-10 mt-16">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.4,
            ease: "easeOut",
          }}
          className="flex flex-col items-start gap-3 border-r-4 border-t-4 rounded-tl-3xl py-6 pl-9 pr-3 border-indigo-300 h-fit"
        >
          {buttons.map((button) => {
            const Icon = button.icon;
            return (
              <button
                key={button.label}
                onClick={() => setActiveButton(button.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  ActiveButton === button.label
                    ? "bg-linear-to-r from-indigo-600 to-blue-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    ActiveButton === button.label
                      ? "text-white"
                      : "text-indigo-600"
                  }
                />

                <span>{button.label}</span>
              </button>
            );
          })}
        </motion.div>
        <section>
          {ActiveButton === "قائمة المستخدمين" ? (
            <AllUsers />
          ) : ActiveButton === "قائمة الخدمات" ? (
            <AllServices />
          ) : ActiveButton === "قائمة الحجوزات" ? (
            <AllBookings />
          ) : null}
        </section>
      </section>
    </motion.div>
  );
}
