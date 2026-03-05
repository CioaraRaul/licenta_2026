// app/api/http.ts
import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ─── Axios instance ───────────────────────────────────────────────────────────

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor — injectează Bearer token din Zustand store ──────────

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const raw = localStorage.getItem('auth-storage');
      if (raw) {
        const { state } = JSON.parse(raw) as { state?: { accessToken?: string } };
        if (state?.accessToken) {
          config.headers['Authorization'] = `Bearer ${state.accessToken}`;
        }
      }
    } catch {
      // localStorage invalid — continuă fără token
    }
    return config;
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
    this.name = 'HttpError';
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
        error.response.statusText ?? '',
        error.response.data,
      );
    }
    throw new Error('Network error. Please try again.');
  }
}

// ─── Convenience methods ──────────────────────────────────────────────────────

export const httpClient = {
  /** GET request — params sunt serializați automat de axios ca query string */
  get: <T>(endpoint: string, options?: AxiosRequestConfig) =>
    http<T>({ ...options, method: 'GET', url: endpoint }),

  /** POST request — data se serializează automat ca JSON */
  post: <T>(endpoint: string, data?: unknown, options?: AxiosRequestConfig) =>
    http<T>({ ...options, method: 'POST', url: endpoint, data }),

  /** PATCH request */
  patch: <T>(endpoint: string, data?: unknown, options?: AxiosRequestConfig) =>
    http<T>({ ...options, method: 'PATCH', url: endpoint, data }),

  /** DELETE request */
  delete: <T>(endpoint: string, options?: AxiosRequestConfig) =>
    http<T>({ ...options, method: 'DELETE', url: endpoint }),
};
