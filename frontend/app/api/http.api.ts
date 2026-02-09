// app/api/http.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface HttpOptions extends RequestInit {
  headers?: Record<string, string>;
}

class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any,
  ) {
    super(`HTTP Error ${status}: ${statusText}`);
    this.name = "HttpError";
  }
}

export async function http<T>(
  endpoint: string,
  options: HttpOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Default headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem("auth-storage");
  if (token) {
    try {
      const authData = JSON.parse(token);
      if (authData.state?.accessToken) {
        headers["Authorization"] = `Bearer ${authData.state.accessToken}`;
      }
    } catch (e) {
      // Invalid token format
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Parse response
    let data: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle errors
    if (!response.ok) {
      throw new HttpError(response.status, response.statusText, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    // Network error or other issues
    throw new Error("Network error. Please try again.");
  }
}

// Convenience methods
export const httpClient = {
  get: <T>(endpoint: string, options?: HttpOptions) =>
    http<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: any, options?: HttpOptions) =>
    http<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any, options?: HttpOptions) =>
    http<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: HttpOptions) =>
    http<T>(endpoint, { ...options, method: "DELETE" }),
};
