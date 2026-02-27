"use client";

import { z } from "zod";
import { X } from "lucide-react";
import { VALIDATION } from "@/constants";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ServiceSchema = z.object({
  title: z.string().min(VALIDATION.MIN_SERVICE_TITLE, {
    message: `العنوان يجب أن يكون ${VALIDATION.MIN_SERVICE_TITLE} أحرف على الأقل`,
  }),
  description: z
    .string()
    .max(VALIDATION.MAX_SERVICE_DESCRIPTION, {
      message: `الوصف لا يجب أن يتجاوز ${VALIDATION.MAX_SERVICE_DESCRIPTION} حرف`,
    })
    .optional()
    .or(z.literal("")),
  duration: z.number().min(VALIDATION.MIN_SERVICE_DURATION, {
    message: `المدة يجب أن تكون ${VALIDATION.MIN_SERVICE_DURATION} دقيقة على الأقل`,
  }),
  price: z.number().min(VALIDATION.MIN_SERVICE_PRICE, {
    message: `السعر يجب أن يكون ${VALIDATION.MIN_SERVICE_PRICE}$ على الأقل`,
  }),
  isActive: z.boolean().default(true),
});

export function ServiceForm({ service, onSubmit, onCancel, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(ServiceSchema),
    defaultValues: service || {
      title: "",
      description: "",
      duration: 30,
      price: 50,
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (service) {
      reset({
        title: service.title || "",
        description: service.description || "",
        duration: service.duration || 30,
        price: service.price || 50,
        isActive: service.isActive ?? true,
      });
    }
  }, [service, reset]);

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    if (!service && !isLoading) {
      reset({
        title: "",
        description: "",
        duration: 30,
        price: 50,
        isActive: true,
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{service ? "تعديل الخدمة" : "إضافة خدمة جديدة"}</CardTitle>
        {onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X size={16} />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("title")}
              placeholder="عنوان الخدمة"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <textarea
              {...register("description")}
              placeholder="وصف الخدمة (اختياري)"
              rows={4}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                {...register("duration", { valueAsNumber: true })}
                placeholder="المدة (بالدقائق)"
                type="number"
                min="30"
                disabled={isLoading}
              />
              {errors.duration && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div>
              <Input
                {...register("price", { valueAsNumber: true })}
                placeholder="السعر ($)"
                type="number"
                min="50"
                step="0.01"
                disabled={isLoading}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              checked={isActive}
              onChange={(e) => setValue("isActive", e.target.checked)}
              className="rounded border-gray-300"
              disabled={isLoading}
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              الخدمة نشطة
            </label>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "جاري الحفظ..." : service ? "تحديث" : "إضافة"}
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
