import api from "@/lib/api";
import { toast } from "sonner";
import { QUERY_STALE_TIME } from "@/constants";
import { formatErrorMessage } from "@/lib/errorHandler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// جلب جميع الحجوزات
export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      try {
        const res = await api.get("bookings");
        if (res.data?.status === "success" && res.data?.data?.bookings) {
          return res.data.data.bookings;
        }
        throw new Error("Invalid response format");
      } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }
    },
    staleTime: QUERY_STALE_TIME.SHORT,
  });
}

// جلب حجز محدد
export function useBooking(id) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: async () => {
      try {
        const res = await api.get(`bookings/${id}`);
        if (res.data?.status === "success" && res.data?.data?.booking) {
          return res.data.data.booking;
        }
        throw new Error("Invalid response format");
      } catch (error) {
        console.error("Error fetching booking:", error);
        throw error;
      }
    },
    enabled: id ? true : false,
  });
}

// إنشاء حجز
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      try {
        const res = await api.post("bookings", data);
        if (res.data?.status === "success" && res.data?.data?.booking) {
          return res.data.data.booking;
        }
        throw new Error("Invalid response format");
      } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("تم إنشاء الحجز بنجاح");
    },
    onError: (error) => {
      const errorMsg = formatErrorMessage(error);
      toast.error(errorMsg);
      console.error("Create booking error:", error);
    },
  });
}

// تحديث حجز
export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const res = await api.patch(`bookings/${id}`, data);
        if (res.data?.status === "success" && res.data?.data?.booking) {
          return res.data.data.booking;
        }
        throw new Error("Invalid response format");
      } catch (error) {
        console.error("Error updating booking:", error);
        throw error;
      }
    },
    onSuccess: (updatedBooking, variables) => {
      queryClient.setQueryData(["bookings"], (bookings) => {
        if (!bookings) return bookings;
        return bookings.map((booking) =>
          booking._id === variables.id ? updatedBooking : booking,
        );
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("تم تحديث الحجز بنجاح");
    },
    onError: (error) => {
      const errorMsg = formatErrorMessage(error);
      toast.error(errorMsg);
      console.error("Update booking error:", error);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// حذف حجز
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        await api.delete(`bookings/${id}`);
        return id;
      } catch (error) {
        console.error("Error deleting booking:", error);
        throw error;
      }
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["bookings"], (bookings) => {
        if (!bookings) return bookings;
        return bookings.filter((booking) => booking._id !== deletedId);
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("تم حذف الحجز بنجاح");
    },
    onError: (error) => {
      const errorMsg = formatErrorMessage(error);
      toast.error(errorMsg);
      console.error("Delete booking error:", error);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
