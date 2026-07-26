const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function apiFetch(path: string, options: FetchOptions = {}) {
  const { params, headers, ...restOptions } = options;
  
  let url = `${API_BASE}${path}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...restOptions,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: 'include', // Important for cookies (if using session/jwt in cookies)
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Fallback if parsing json fails
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function apiGet<T>(path: string, options?: FetchOptions): Promise<T> {
  return apiFetch(path, { ...options, method: 'GET' });
}

export function apiPost<T>(path: string, data?: unknown, options?: FetchOptions): Promise<T> {
  return apiFetch(path, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function apiPut<T>(path: string, data?: unknown, options?: FetchOptions): Promise<T> {
  return apiFetch(path, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function apiDelete<T>(path: string, options?: FetchOptions): Promise<T> {
  return apiFetch(path, { ...options, method: 'DELETE' });
}
