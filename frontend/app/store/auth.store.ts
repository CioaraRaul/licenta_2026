import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "~/interface/auth.interface";

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) => {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },
      setUsers: (user) => {
        set({
          user,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      isTokenValid: () => {
        const { accessToken } = get();
        if (!accessToken) return false;

        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          const isExpired = payload.exp * 1000 < Date.now();
          return !isExpired;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
