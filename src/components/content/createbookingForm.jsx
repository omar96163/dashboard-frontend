"use client";

import { z } from "zod";
import React from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBooking } from "@/hooks/useBookings";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BookingSchema = z.object({
  bookingDate: z
    .string()
    .refine(
      (date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
      { message: "تاريخ الحجز يجب أن يكون في المستقبل" },
    ),
  bookingPrice: z.number().min(50, { message: "السعر يجب أن لا يقل عن 50 $" }),
  notes: z
    .string()
    .max(500, { message: "الملاحظات يجب أن لا تتجاوز 500 حرف" })
    .optional(),
});

export default function CreateBookingForm({ service, booking, onCancel }) {
  const createBookingMutation = useCreateBooking();
  const isLoading = createBookingMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BookingSchema),
    defaultValues: booking || {
      bookingDate: "",
      bookingPrice: service?.price || 0,
      notes: "",
    },
  });

  const handleFormSubmit = async (data) => {
    await createBookingMutation.mutateAsync({
      serviceId: service?._id,
      ...data,
    });
    if (onCancel) onCancel();
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="mb-6 p-6 bg-white rounded-xl border-4 border-gray-300">
        <CardHeader className="flex flex-row items-center justify-between mb-6 font-bold text-xl">
          <CardTitle>{`${booking ? "تعديل حجز : " : "حجز خدمة : "} ${service?.title}`}</CardTitle>
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="cursor-pointer"
            >
              <X size={16} />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الحجز
              </label>
              <input
                {...register("bookingDate")}
                type="date"
                min={minDate}
                disabled={isLoading}
                className="w-full bg-white/50 border border-indigo-200/50 rounded-md px-3 py-2 text-sm placeholder:text-gray-500 
                focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.bookingDate && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.bookingDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السعر ( $ )
              </label>
              <input
                {...register("bookingPrice", { valueAsNumber: true })}
                type="number"
                min="50"
                step="0.01"
                disabled={isLoading}
                placeholder={service?.price?.toString()}
                className="w-full bg-white/50 border border-indigo-200/50 rounded-md px-3 py-2 text-sm placeholder:text-gray-500 
                focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.bookingPrice && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.bookingPrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملاحظات ( اختياري )
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full bg-white/50 border border-indigo-200/50 rounded-md px-3 py-2 text-sm placeholder:text-gray-500 
                focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="أضف ملاحظاتك ..."
                disabled={isLoading}
              />
              {errors.notes && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.notes.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-linear-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    جاري حجز الخدمة ...
                    <span className="inline-block animate-spin">⏳</span>
                  </span>
                ) : booking ? (
                  "تعديل الحجز"
                ) : (
                  "إحجز الآن"
                )}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="text-indigo-600 cursor-pointer"
                >
                  إلغاء
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </div>
    </motion.div>
  );
}
