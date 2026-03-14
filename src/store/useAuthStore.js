import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isHydrated: false,

  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },

  hydrate: () => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      set({
        token,
        user: user ? JSON.parse(user) : null,
        isHydrated: true,
      });
    } catch (e) {
      console.error("Hydration error:", e);
      set({ token: null, user: null });
    }
  },
}));
