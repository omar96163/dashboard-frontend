import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { formatErrorMessage } from "@/lib/errorHandler";
import { Card, CardContent } from "@/components/ui/card";

export function ErrorAlert({ error }) {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="flex flex-col items-center justify-center space-y-6 px-4"
    >
      <Card className="max-w-md w-full border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-2xl font-semibold text-red-700 mb-8">
              حدث خطأ
            </h3>
            <p className="text-center text-red-600">
              {formatErrorMessage(error)}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
