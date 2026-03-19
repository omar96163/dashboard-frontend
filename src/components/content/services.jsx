"use client";

import { useState } from "react";
import { ROLES } from "@/constants";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Briefcase, Loader2 } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useAuthStore } from "@/store/useAuthStore";
import { ErrorAlert } from "@/components/ErrorAlert";
import BookingForm from "@/components/content/bookingForm";

export default function AllServices() {
  const { user } = useAuthStore();
  const userRole = user.role;
  const [selectedService, setSelectedService] = useState(null);

  const limit = 9;
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useServices(page, limit);

  const results = data?.results;
  const services = data?.services;
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
        <h1 className="font-semibold px-4 py-2">قائمة الخدمات</h1>
        <strong
          title="عدد الخدمات في الصفحة الحالية"
          className="cursor-context-menu rounded-full px-2 bg-gray-300 hover:scale-110 transition-all duration-300"
        >
          {results}
        </strong>
      </div>
      <div>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg">
              <BookingForm
                service={selectedService}
                onCancel={() => setSelectedService(null)}
              />
            </div>
          </div>
        )}
        {services && services.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {services.map((service, index) => (
                <motion.div
                  key={service._id}
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
                          الخدمة : {service.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {service.description
                            ? `تفاصيل عن الخدمة : ${service.description}`
                            : "لا توجد تفاصيل"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        service.isActive
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {service.isActive ? "متاحة" : "غير متاحة"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">المدة :</span>
                      <span className="font-medium">
                        {service.duration
                          ? `${service.duration} دقيقة`
                          : "غير محدد"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">السعر :</span>
                      <span className="font-medium">
                        {service.price ? `${service.price} $` : "غير محدد"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">البائع :</span>
                      <span className="font-medium" dir="ltr">
                        {service.sellerEmail
                          ? `${service.sellerEmail}`
                          : "غير محدد"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t-[3px] pt-4 border-gray-300">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">تاريخ الإنشاء :</span>
                      <span className="font-medium">
                        {new Date(service.createdAt).toLocaleDateString(
                          "ar-SA",
                        )}
                      </span>
                    </div>
                  </div>

                  {userRole === ROLES.CLIENT && (
                    <Button
                      onClick={() => setSelectedService(service)}
                      className="w-full mt-8 bg-linear-to-r from-indigo-600 to-blue-500 text-white 
                      hover:from-indigo-700 hover:to-blue-600 cursor-pointer"
                    >
                      حجز الخدمة
                    </Button>
                  )}
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
            <p className="text-gray-500 text-lg">لا يوجد خدمات</p>
            <p className="text-gray-400 text-sm mt-1">
              سيتم عرض الخدمات هنا عند توفرهم
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
