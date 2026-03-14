"use client";

import { z } from "zod";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BookingSchema = z.object({
  bookingDate: z
    .string()
    .refine(
      (date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
      { message: "تاريخ الحجز يجب أن يكون في المستقبل" },
    ),
  bookingPrice: z
    .number()
    .min(50, { message: "السعر يجب أن يكون 50$ على الأقل" }),
  notes: z
    .string()
    .max(500, { message: "الملاحظات لا يجب أن تتجاوز 500 حرف" })
    .optional(),
});

export function BookingForm({
  service,
  booking,
  onSubmit,
  onCancel,
  isLoading,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(BookingSchema),
    defaultValues: booking || {
      bookingDate: "",
      bookingPrice: service?.price || 0,
      notes: "",
    },
  });

  // عند تغيير التاريخ، تحديث السعر إذا لم يكن محجوز مسبقاً
  const bookingDate = watch("bookingDate");

  // تعيين الحد الأدنى للتاريخ (اليوم)
  const minDate = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {booking ? "تعديل الحجز" : `حجز خدمة: ${service?.title}`}
          </CardTitle>
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X size={16} />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ الحجز
              </label>
              <Input
                {...register("bookingDate")}
                type="date"
                min={minDate}
                disabled={isLoading}
                className="bg-white/50 border border-indigo-200/50 focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.bookingDate && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.bookingDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السعر ($)
              </label>
              <Input
                {...register("bookingPrice", { valueAsNumber: true })}
                type="number"
                min="50"
                step="0.01"
                disabled={isLoading}
                placeholder={service?.price?.toString()}
                className="bg-white/50 border border-indigo-200/50 focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.bookingPrice && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.bookingPrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ملاحظات (اختياري)
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full bg-white/50 border border-indigo-200/50 rounded-md px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="أضف ملاحظات إضافية..."
                disabled={isLoading}
              />
              {errors.notes && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.notes.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-linear-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600"
              >
                {isLoading
                  ? "جاري الحفظ..."
                  : booking
                    ? "تحديث الحجز"
                    : "حجز الآن"}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="text-indigo-600"
                >
                  إلغاء
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
