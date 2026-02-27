import api from "@/lib/api";
import { toast } from "sonner";
import { QUERY_STALE_TIME } from "@/constants";
import { formatErrorMessage } from "@/lib/errorHandler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// جلب جميع المستخدمين (Admin only)
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await api.get("users");
        if (res.data?.status === "success" && res.data?.data?.users) {
          return res.data.data.users;
        }
        throw new Error("Invalid response format");
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
    staleTime: QUERY_STALE_TIME.SHORT,
  });
}

// جلب حسابي الشخصي
export function useMyAccount() {
  return useQuery({
    queryKey: ["myAccount"],
    queryFn: async () => {
      try {
        const res = await api.get("users/myAccount");
        if (res.data?.status === "success" && res.data?.data?.myAccount) {
          return res.data.data.myAccount;
        }
        throw new Error("Invalid response format");
      } catch (error) {
        console.error("Error fetching my account:", error);
        throw error;
      }
    },
  });
}

// تحديث مستخدم
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, file }) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      if (file) {
        formData.append("avatar", file);
      }

      const res = await api.patch(`users/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.data.updateduser;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["myAccount"] });
      toast.success("تم التحديث بنجاح");
    },
    onError: (error) => {
      const errorMsg = formatErrorMessage(error);
      toast.error(errorMsg);
      console.error("Update user error:", error);
    },
  });
}

// حذف مستخدم
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`users/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      // Optimistic update
      queryClient.setQueryData(["users"], (old) => {
        if (!old) return old;
        return old.filter((user) => user._id !== deletedId);
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("تم حذف المستخدم بنجاح");
    },
    onError: (error) => {
      const errorMsg = formatErrorMessage(error);
      toast.error(errorMsg);
      console.error("Delete user error:", error);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}