"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUsers, useDeleteUser } from "@/hooks/useUsers";
import { useServices } from "@/hooks/useServices";
import { useBookings } from "@/hooks/useBookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Users as UsersIcon,
  Loader2,
  Briefcase,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { ROLE_LABELS, ROLES } from "@/constants";

export default function AdminDashboard() {
  const { data: users, isLoading, error } = useUsers();
  const { data: services } = useServices();
  const { data: bookings } = useBookings();
  const deleteUser = useDeleteUser();
  const [deletingId, setDeletingId] = useState(null);
  const confirmDialog = useConfirmDialog();

  // إحصائيات
  const stats = {
    totalUsers: users?.length || 0,
    totalServices: services?.length || 0,
    totalBookings: bookings?.length || 0,
    admins: users?.filter((u) => u.role === ROLES.ADMIN).length || 0,
    freelancers: users?.filter((u) => u.role === ROLES.FREELANCER).length || 0,
    clients: users?.filter((u) => u.role === ROLES.CLIENT).length || 0,
  };

  const handleDelete = async (id) => {
    const userToDelete = users?.find((u) => u._id === id);
    confirmDialog.open(
      "حذف المستخدم",
      `هل أنت متأكد من حذف المستخدم "${userToDelete?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`,
      async () => {
        setDeletingId(id);
        try {
          await deleteUser.mutateAsync(id);
        } catch (error) {
          // Error handled by hook
        } finally {
          setDeletingId(null);
        }
      },
    );
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="text-center text-red-600">
          حدث خطأ في تحميل المستخدمين
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              لوحة تحكم الإدارة
            </h1>
            <p className="text-gray-600 mt-2">نظرة عامة على النظام</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    إجمالي المستخدمين
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="bg-blue-500 rounded-full p-3">
                  <UsersIcon className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
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

          <Card className="bg-linear-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">
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

          <Card className="bg-linear-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">
                    المستقلين
                  </p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    {stats.freelancers}
                  </p>
                </div>
                <div className="bg-orange-500 rounded-full p-3">
                  <TrendingUp className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">المديرين</span>
                <span className="text-xl font-bold text-red-600">
                  {stats.admins}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">المستقلين</span>
                <span className="text-xl font-bold text-blue-600">
                  {stats.freelancers}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">العملاء</span>
                <span className="text-xl font-bold text-green-600">
                  {stats.clients}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            {users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
                        الاسم
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
                        البريد الإلكتروني
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
                        الدور
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
                        تاريخ التسجيل
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : user.role === "freelancer"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {ROLE_LABELS[user.role] || user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(user._id)}
                            disabled={deletingId === user._id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {deletingId === user._id ? (
                              <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                لا يوجد مستخدمين
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.handleConfirm}
        title={confirmDialog.config.title}
        message={confirmDialog.config.message}
        isLoading={deleteUser.isPending}
      />
    </ProtectedRoute>
  );
}
