"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Briefcase, Loader2 } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { ErrorAlert } from "@/components/ErrorAlert";

export default function AllBookings() {
  const limit = 9;
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useBookings(page, limit);

  const results = data?.results;
  const bookings = data?.bookings;
  const pagination = data?.pagination;

  const handlePageChange = (newPage) => {
    if (!pagination) return;
    const pageNum = Math.max(1, Math.min(newPage, pagination.totalPages));
    setPage(pageNum);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <p className="mt-4 text-gray-600 animate-pulse">جاري التهيئه ...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="p-6 border-l-4 border-t-4 rounded-tr-3xl border-gray-300"
    >
      <div className=" flex items-center justify-between mb-8">
        <h1 className="font-semibold px-4 py-2">قائمة الحجوزات </h1>
        <strong
          title="عدد الحجوزات في الصفحة الحالية"
          className="cursor-context-menu rounded-full px-2 bg-gray-300 hover:scale-110 transition-all duration-300"
        >
          {results}
        </strong>
      </div>
      <div>
        {bookings && bookings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className="border-t-[3px] border-r-[3px] rounded-tl-3xl border-gray-300 p-6 hover:bg-linear-to-bl from-gray-100"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          سعر الخدمة : {booking.bookingPrice} $
                        </h3>
                        <p className="text-sm text-gray-500">
                          {booking.notes
                            ? `ملاحظات : ${booking.notes}`
                            : "لا توجد ملاحظات"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : booking.status === "completed"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">المشتري :</span>
                      <span className="font-medium" dir="ltr">
                        {booking.buyerEmail
                          ? `${booking.buyerEmail}`
                          : "غير محدد"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">البائع :</span>
                      <span className="font-medium" dir="ltr">
                        {booking.sellerEmail
                          ? `${booking.sellerEmail}`
                          : "غير محدد"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">الخدمة :</span>
                      <span className="font-medium">
                        {booking.bookedServiceTitle
                          ? `${booking.bookedServiceTitle}`
                          : "غير محدد"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">تاريخ الحجز :</span>
                      <span className="font-medium">
                        {new Date(booking.bookingDate).toLocaleDateString(
                          "ar-SA",
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="border-t-[3px] pt-4 border-gray-300">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">تاريخ طلب الخدمة :</span>
                      <span className="font-medium">
                        {new Date(booking.createdAt).toLocaleDateString(
                          "ar-SA",
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {pagination?.totalPages > 1 && (
              <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  الصفحة {pagination.currentPage} من {pagination.totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                  >
                    السابق
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: "easeOut",
            }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">لا يوجد حجوزات</p>
            <p className="text-gray-400 text-sm mt-1">
              سيتم عرض الحجوزات هنا عند توفرهم
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
