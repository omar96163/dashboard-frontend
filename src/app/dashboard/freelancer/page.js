"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "@/hooks/useServices";
import { useBookings } from "@/hooks/useBookings";
import { ServiceForm } from "@/components/ServiceForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  Briefcase,
  Loader2,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { BOOKING_STATUS, BOOKING_STATUS_LABELS } from "@/constants";

export default function FreelancerDashboard() {
  const { data: services, isLoading, error } = useServices();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState("services"); // services or bookings
  const confirmDialog = useConfirmDialog();

  // إحصائيات
  const stats = {
    totalServices: services?.length || 0,
    activeServices: services?.filter((s) => s.isActive).length || 0,
    totalBookings: bookings?.length || 0,
    totalEarnings:
      bookings?.reduce((sum, b) => sum + (b.bookingPrice || 0), 0) || 0,
  };

  const handleCreate = async (data) => {
    await createService.mutateAsync(data);
    setShowForm(false);
  };

  const handleUpdate = async (data) => {
    await updateService.mutateAsync({ id: editingService._id, data });
    setEditingService(null);
  };

  const handleDelete = async (id) => {
    const serviceToDelete = services?.find((s) => s._id === id);
    confirmDialog.open(
      "حذف الخدمة",
      `هل أنت متأكد من حذف الخدمة "${serviceToDelete?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.`,
      async () => {
        setDeletingId(id);
        try {
          await deleteService.mutateAsync(id);
        } catch (error) {
          // Error handled by hook
        } finally {
          setDeletingId(null);
        }
      }
    );
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      [BOOKING_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
      [BOOKING_STATUS.CONFIRMED]: "bg-blue-100 text-blue-800",
      [BOOKING_STATUS.COMPLETED]: "bg-green-100 text-green-800",
      [BOOKING_STATUS.CANCELLED]: "bg-red-100 text-red-800",
    };
    const color = statusColors[status] || statusColors[BOOKING_STATUS.PENDING];
    const label =
      BOOKING_STATUS_LABELS[status] ||
      BOOKING_STATUS_LABELS[BOOKING_STATUS.PENDING];

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["freelancer"]}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["freelancer"]}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              لوحة تحكم المستقل
            </h1>
            <p className="text-gray-600 mt-2">إدارة خدماتك وحجوزاتك</p>
          </div>
          {!showForm && !editingService && (
            <Button onClick={() => setShowForm(true)}>
              <Plus size={18} className="ml-2" />
              إضافة خدمة جديدة
            </Button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    إجمالي الخدمات
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {stats.totalServices}
                  </p>
                </div>
                <div className="bg-blue-500 rounded-full p-3">
                  <Briefcase className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    الخدمات النشطة
                  </p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {stats.activeServices}
                  </p>
                </div>
                <div className="bg-green-500 rounded-full p-3">
                  <TrendingUp className="text-white" size={24} />
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
                    إجمالي الأرباح
                  </p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    ${stats.totalEarnings}
                  </p>
                </div>
                <div className="bg-orange-500 rounded-full p-3">
                  <DollarSign className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab("services")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "services"
                ? "border-b-2 border-black text-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <Briefcase size={18} className="inline ml-2" />
            خدماتي ({services?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "bookings"
                ? "border-b-2 border-black text-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <Calendar size={18} className="inline ml-2" />
            حجوزاتي ({bookings?.length || 0})
          </button>
        </div>

        {(showForm || editingService) && activeTab === "services" && (
          <ServiceForm
            service={editingService}
            onSubmit={editingService ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isLoading={createService.isPending || updateService.isPending}
          />
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <>
            {error && (
              <div className="text-center text-red-600">
                حدث خطأ في تحميل الخدمات
              </div>
            )}

            {services && services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">
                          {service.title}
                        </CardTitle>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            service.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service.isActive ? "نشط" : "غير نشط"}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {service.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {service.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">المدة:</span>
                          <span className="font-medium">
                            {service.duration} دقيقة
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">السعر:</span>
                          <span className="font-bold text-lg">
                            ${service.price}
                          </span>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(service)}
                            className="flex-1"
                          >
                            <Edit size={16} className="ml-2" />
                            تعديل
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(service._id)}
                            disabled={deletingId === service._id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {deletingId === service._id ? (
                              <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              !showForm && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase
                      size={48}
                      className="mx-auto mb-4 text-gray-400"
                    />
                    <p className="text-gray-600 mb-4">لا توجد خدمات بعد</p>
                    <Button onClick={() => setShowForm(true)}>
                      <Plus size={18} className="ml-2" />
                      إضافة خدمة جديدة
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
          </>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <>
            {bookingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
              </div>
            ) : bookings && bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking._id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {typeof booking.serviceId === "object" &&
                              booking.serviceId?.title
                                ? booking.serviceId.title
                                : "خدمة"}
                            </h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar size={16} />
                              <span>
                                {new Date(
                                  booking.bookingDate
                                ).toLocaleDateString("ar-SA", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">السعر: </span>
                              <span className="font-bold">
                                ${booking.bookingPrice}
                              </span>
                            </div>
                            {booking.notes && (
                              <div>
                                <span className="font-medium">
                                  ملاحظات العميل:{" "}
                                </span>
                                <span>{booking.notes}</span>
                              </div>
                            )}
                            {typeof booking.buyerId === "object" &&
                              booking.buyerId?.name && (
                                <div>
                                  <span className="font-medium">العميل: </span>
                                  <span>{booking.buyerId.name}</span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">لا توجد حجوزات بعد</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.handleConfirm}
        title={confirmDialog.config.title}
        message={confirmDialog.config.message}
        isLoading={deleteService.isPending}
      />
    </ProtectedRoute>
  );
}
