"use client";

import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle>{title || "تأكيد الإجراء"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              {message || "هل أنت متأكد من هذا الإجراء؟"}
            </p>
            <div className="flex space-x-2 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="text-gray-700"
              >
                إلغاء
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className="bg-linear-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600"
              >
                {isLoading ? "جاري..." : "تأكيد"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
