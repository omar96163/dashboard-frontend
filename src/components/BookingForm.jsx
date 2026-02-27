"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

const BookingSchema = z.object({
  bookingDate: z
    .string()
    .refine(
      (date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
      { message: "تاريخ الحجز يجب أن يكون في المستقبل" }
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
    <Card className="mb-6">
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
              placeholder={service?.price.toString()}
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
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="أضف ملاحظات إضافية..."
              disabled={isLoading}
            />
            {errors.notes && (
              <p className="text-sm text-red-500 mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
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
              >
                إلغاء
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
