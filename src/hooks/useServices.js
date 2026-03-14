import api from "@/lib/api";
import { toast } from "sonner";
import { QUERY_STALE_TIME } from "@/constants";
import { formatErrorMessage } from "@/lib/errorHandler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// جلب جميع الخدمات
export function useServices(page, limit) {
  return useQuery({
    queryKey: ["services", page, limit],

    queryFn: async () => {
      try {
        const { data } = await api.get(`/services?page=${page}&limit=${limit}`);

        if (data?.status !== "success") {
          throw new Error(error);
        }

        return {
          services: data.data,
          results: data.results,
          pagination: data.pagination,
          totalServices: data.totalServices,
        };
      } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
      }
    },

    staleTime: QUERY_STALE_TIME.SHORT,
    keepPreviousData: true,
  });
}

// جلب خدمة محددة
export function useService(id) {
  return useQuery({
    queryKey: ["services", id],
    queryFn: async () => {
      const res = await api.get(`services/${id}`);
      return res.data.data.service;
    },
    enabled: id ? true : false,
  });
}

// إنشاء خدمة
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      try {
        const res = await api.post("services", data);
        if (res.data?.status === "success" && res.data?.data?.service) {
          return res.data.data.service;
        }
        throw new Error("Invalid response format");
      } catch (error) {
        console.error("Error creating service:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("تم إنشاء الخدمة بنجاح");
    },
    onError: (error) => {
      const errorMsg = formatErrorMessage(error);
      toast.error(errorMsg);
      console.error("Create service error:", error);
    },
  });
}

// تحديث خدمة
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const res = await api.patch(`services/${id}`, data);
        if (res.data?.status === "success" && res.data?.data?.service) {
          return res.data.data.service;
        }
        throw new Error("Invalid response format");
      } catch (error) {
        console.error("Error updating service:", error);
        throw error;
      }
    },
    onSuccess: (updatedService, variables) => {
      queryClient.setQueryData(["services"], (services) => {
        if (!services) return services;
        return services.map((service) =>
          service._id === variables.id ? updatedService : service,
        );
      });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("تم تحديث الخدمة بنجاح");
    },
    onError: (error) => {
      const errorMsg = formatErrorMessage(error);
      toast.error(errorMsg);
      console.error("Update service error:", error);
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

// حذف خدمة
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        await api.delete(`services/${id}`);
        return id;
      } catch (error) {
        console.error("Error deleting service:", error);
        throw error;
      }
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["services"], (services) => {
        if (!services) return services;
        return services.filter((service) => service._id !== deletedId);
      });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("تم حذف الخدمة بنجاح");
    },
    onError: (error) => {
      const errorMsg = formatErrorMessage(error);
      toast.error(errorMsg);
      console.error("Delete service error:", error);
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
