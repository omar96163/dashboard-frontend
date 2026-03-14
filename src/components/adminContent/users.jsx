"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ROLE_LABELS } from "@/constants";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ErrorAlert";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useUsers, useDeleteUser } from "@/hooks/useUsers";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { Trash2, Users as UsersIcon, Loader2 } from "lucide-react";

export default function AllUsers() {
  const { data, isLoading, error } = useUsers(1, 10);

  const users = data?.users;
  const results = data?.results;
  const pagination = data?.pagination;

  const deleteUser = useDeleteUser();
  const [deletingId, setDeletingId] = useState(null);

  const confirmDialog = useConfirmDialog();

  const handleDelete = async (id) => {
    const userToDelete = users?.find((u) => u._id === id);
    confirmDialog.open(
      "حذف المستخدم",
      `هل أنت متأكد من حذف المستخدم "${userToDelete?.name}" ؟ هذا الإجراء لا يمكن التراجع عنه.`,
      async () => {
        setDeletingId(id);
        try {
          await deleteUser.mutateAsync(id);
        } catch (error) {
        } finally {
          setDeletingId(null);
        }
      },
    );
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
        <h1 className="font-semibold px-4 py-2">قائمة المستخدمين </h1>
        <strong
          title="عدد المستخدمين في الصفحة الحالية"
          className="cursor-context-menu rounded-full px-2 bg-gray-300 hover:scale-110 transition-all duration-300"
        >
          {results}
        </strong>
      </div>
      <div>
        {users && users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {users.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="border-t-[3px] border-r-[3px] rounded-tl-3xl border-gray-300 p-6 space-y-4 hover:bg-linear-to-bl from-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      title={user.name}
                      className="w-10 h-10 bg-linear-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center ml-3"
                    >
                      <span className="text-white font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900" title="Name">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500" title="E-mail">
                        {user.email.split("@")[0]} @
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : user.role === "freelancer"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                </div>

                <div className="border-t-[3px] pt-4 border-gray-300">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">تاريخ التسجيل:</span>
                    <span className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                    disabled={deletingId === user._id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 cursor-pointer"
                  >
                    {deletingId === user._id ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
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
              <UsersIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">لا يوجد مستخدمين</p>
            <p className="text-gray-400 text-sm mt-1">
              سيتم عرض المستخدمين هنا عند توفرهم
            </p>
          </motion.div>
        )}
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.handleConfirm}
        title={confirmDialog.config.title}
        message={confirmDialog.config.message}
        isLoading={deleteUser.isPending}
      />
    </motion.section>
  );
}
