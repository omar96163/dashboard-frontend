"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

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
      <Card className="w-full max-w-md">
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
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              إلغاء
            </Button>
            <Button onClick={onConfirm} disabled={isLoading}>
              {isLoading ? "جاري..." : "تأكيد"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
