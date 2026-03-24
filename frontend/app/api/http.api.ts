// app/api/http.ts
import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ─── Axios instance ───────────────────────────────────────────────────────────

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor — injectează Bearer token din Zustand store ──────────

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const raw = localStorage.getItem("auth-storage");
    if (raw) {
      const { state } = JSON.parse(raw) as { state?: { accessToken?: string } };
      if (state?.accessToken) {
        config.headers["Authorization"] = `Bearer ${state.accessToken}`;
      }
    }
  } catch {
    // localStorage invalid — continuă fără token
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// ─── Response interceptor — auto-refresh on 401 ──────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token!);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const raw = localStorage.getItem("auth-storage");
        const { state } = JSON.parse(raw || "{}") as {
          state?: { refreshToken?: string };
        };

        if (!state?.refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${state.refreshToken}` } },
        );

        const newAccess: string = data.accessToken;
        const newRefresh: string = data.refreshToken;

        // Update Zustand persisted store
        const parsed = JSON.parse(raw || "{}");
        parsed.state = {
          ...parsed.state,
          accessToken: newAccess,
          refreshToken: newRefresh,
        };
        localStorage.setItem("auth-storage", JSON.stringify(parsed));

        processQueue(null, newAccess);
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear auth state and redirect to login
        localStorage.removeItem("auth-storage");
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ─── Error class ──────────────────────────────────────────────────────────────

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown,
  ) {
    super(`HTTP Error ${status}: ${statusText}`);
    this.name = "HttpError";
  }
}

// ─── Generic request wrapper ──────────────────────────────────────────────────

export async function http<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new HttpError(
        error.response.status,
        error.response.statusText ?? "",
        error.response.data,
      );
    }
    throw new Error("Network error. Please try again.");
  }
}

// ─── Convenience methods ──────────────────────────────────────────────────────

export const httpClient = {
  /** GET request — params sunt serializați automat de axios ca query string */
  get: <T>(endpoint: string, options?: AxiosRequestConfig) =>
    http<T>({ ...options, method: "GET", url: endpoint }),

  /** POST request — data se serializează automat ca JSON */
  post: <T>(endpoint: string, data?: unknown, options?: AxiosRequestConfig) =>
    http<T>({ ...options, method: "POST", url: endpoint, data }),

  /** PATCH request */
  patch: <T>(endpoint: string, data?: unknown, options?: AxiosRequestConfig) =>
    http<T>({ ...options, method: "PATCH", url: endpoint, data }),

  /** DELETE request */
  delete: <T>(endpoint: string, options?: AxiosRequestConfig) =>
    http<T>({ ...options, method: "DELETE", url: endpoint }),
};
