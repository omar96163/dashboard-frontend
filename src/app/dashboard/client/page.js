"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useServices } from "@/hooks/useServices";
import {
  useBookings,
  useCreateBooking,
  useUpdateBooking,
  useDeleteBooking,
} from "@/hooks/useBookings";
import { BookingForm } from "@/components/BookingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Briefcase,
  Edit,
  Trash2,
  Loader2,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { BOOKING_STATUS, BOOKING_STATUS_LABELS } from "@/constants";

export default function ClientDashboard() {
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const createBooking = useCreateBooking();
  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();

  const [selectedService, setSelectedService] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState("services"); // services or bookings
  const confirmDialog = useConfirmDialog();

  // تصفية الخدمات النشطة فقط
  const activeServices = services?.filter((service) => service.isActive) || [];

  // إحصائيات
  const stats = {
    totalBookings: bookings?.length || 0,
    totalSpent:
      bookings?.reduce((sum, b) => sum + (b.bookingPrice || 0), 0) || 0,
    pendingBookings:
      bookings?.filter((b) => b.status === "pending").length || 0,
    activeServices: activeServices.length,
  };

  const handleCreateBooking = async (data) => {
    await createBooking.mutateAsync({
      serviceId: selectedService._id,
      ...data,
    });
    setSelectedService(null);
  };

  const handleUpdateBooking = async (data) => {
    await updateBooking.mutateAsync({
      id: editingBooking._id,
      data,
    });
    setEditingBooking(null);
  };

  const handleDeleteBooking = async (id) => {
    const bookingToDelete = bookings?.find((b) => b._id === id);
    confirmDialog.open(
      "حذف الحجز",
      `هل أنت متأكد من حذف هذا الحجز؟ هذا الإجراء لا يمكن التراجع عنه.`,
      async () => {
        setDeletingId(id);
        try {
          await deleteBooking.mutateAsync(id);
        } catch (error) {
          // Error handled by hook
        } finally {
          setDeletingId(null);
        }
      }
    );
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

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              لوحة تحكم العميل
            </h1>
            <p className="text-gray-600 mt-2">تصفح الخدمات وإدارة حجوزاتك</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    إجمالي الحجوزات
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {stats.totalBookings}
                  </p>
                </div>
                <div className="bg-blue-500 rounded-full p-3">
                  <Calendar className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    إجمالي الإنفاق
                  </p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    ${stats.totalSpent}
                  </p>
                </div>
                <div className="bg-green-500 rounded-full p-3">
                  <DollarSign className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">
                    الحجوزات المعلقة
                  </p>
                  <p className="text-3xl font-bold text-yellow-900 mt-2">
                    {stats.pendingBookings}
                  </p>
                </div>
                <div className="bg-yellow-500 rounded-full p-3">
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
                    الخدمات المتاحة
                  </p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">
                    {stats.activeServices}
                  </p>
                </div>
                <div className="bg-purple-500 rounded-full p-3">
                  <Briefcase className="text-white" size={24} />
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
            الخدمات المتاحة
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

        {/* Booking Form */}
        {selectedService && (
          <BookingForm
            service={selectedService}
            onSubmit={handleCreateBooking}
            onCancel={() => setSelectedService(null)}
            isLoading={createBooking.isPending}
          />
        )}

        {editingBooking && (
          <BookingForm
            service={{ title: "تعديل الحجز" }}
            booking={editingBooking}
            onSubmit={handleUpdateBooking}
            onCancel={() => setEditingBooking(null)}
            isLoading={updateBooking.isPending}
          />
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div>
            {servicesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
              </div>
            ) : activeServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeServices.map((service) => (
                  <Card key={service._id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {service.description && (
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {service.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">المدة:</span>
                          <span className="font-medium">
                            {service.duration} دقيقة
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">السعر:</span>
                          <span className="font-bold text-xl">
                            ${service.price}
                          </span>
                        </div>
                        <Button
                          className="w-full mt-4"
                          onClick={() => {
                            setSelectedService(service);
                            setActiveTab("services");
                          }}
                        >
                          حجز الآن
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">لا توجد خدمات متاحة حالياً</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
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
                                <span className="font-medium">الملاحظات: </span>
                                <span>{booking.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {booking.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingBooking(booking)}
                              >
                                <Edit size={16} className="ml-2" />
                                تعديل
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteBooking(booking._id)}
                                disabled={deletingId === booking._id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                {deletingId === booking._id ? (
                                  <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </Button>
                            </>
                          )}
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
                  <p className="text-gray-600 mb-4">لا توجد حجوزات بعد</p>
                  <Button onClick={() => setActiveTab("services")}>
                    تصفح الخدمات
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.handleConfirm}
        title={confirmDialog.config.title}
        message={confirmDialog.config.message}
        isLoading={deleteBooking.isPending}
      />
    </ProtectedRoute>
  );
}
