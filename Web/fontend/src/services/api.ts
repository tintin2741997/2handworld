const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost/2handworld/Web/backend/api';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  details?: unknown;
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  const payload = (await response.json().catch(() => ({}))) as ApiResponse<T>;

  if (!response.ok || payload.success === false) {
    throw new ApiError(
      payload.message || 'Không thể kết nối tới máy chủ.',
      response.status,
      payload.details
    );
  }

  return payload.data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: data === undefined ? undefined : JSON.stringify(data)
    }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: data === undefined ? undefined : JSON.stringify(data)
    }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: data === undefined ? undefined : JSON.stringify(data)
    }),
  delete: <T>(path: string) =>
    request<T>(path, {
      method: 'DELETE'
    })
};
