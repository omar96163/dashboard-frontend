import api from "@/lib/api";
import { toast } from "sonner";
import { QUERY_STALE_TIME } from "@/constants";
import { formatErrorMessage } from "@/lib/errorHandler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// جلب جميع الحجوزات
export function useBookings(page, limit) {
  return useQuery({
    queryKey: ["bookings", page, limit],

    queryFn: async () => {
      try {
        const { data } = await api.get(
          `/api/bookings?page=${page}&limit=${limit}`,
        );

        if (data?.status !== "success") {
          throw new Error(error);
        }

        return {
          bookings: data.data,
          results: data.results,
          pagination: data.pagination,
          totalBookings: data.totalBookings,
        };
      } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }
    },
    staleTime: QUERY_STALE_TIME.SHORT,
    keepPreviousData: true,
  });
}

// جلب حجز محدد
export function useBooking(id) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: async () => {
      try {
        const res = await api.get(`/api/bookings/${id}`);
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
    mutationFn: async (details) => {
      try {
        const { data } = await api.post("/api/bookings", details);

        if (data?.status !== "success") {
          throw new Error(error);
        }

        return {
          booking: data.data,
          message: data.message,
        };
      } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(data.message);
    },
    onError: (error) => {
      const errorMsg = formatErrorMessage(error);
      toast.error(errorMsg);
      console.error("Error creating booking::", error);
    },
  });
}

// تحديث حجز
export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, details }) => {
      try {
        const { data } = await api.patch(`/api/bookings/${id}`, details);

        if (data?.status !== "success") {
          throw new Error(error);
        }

        return {
          booking: data.data,
          message: data.message,
        };
      } catch (error) {
        console.error("Error updating booking:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["bookings"], (bookings) => {
        if (!bookings) return bookings;
        return bookings.map((booking) =>
          booking._id === variables.id ? data.booking : booking,
        );
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success(data.message);
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
        await api.delete(`/api/bookings/${id}`);
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
