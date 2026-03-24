const BASE_URL =
  (typeof window !== 'undefined' &&
    (window as Window & typeof globalThis & { __API_BASE_URL__?: string }).__API_BASE_URL__) ||
  (typeof process !== 'undefined' && process.env['NEXT_PUBLIC_API_URL']) ||
  'http://localhost:3000/api';

export interface ApiResponse<T> {
  message?: string;
  data: T;
  valid?: boolean;
}

interface RequestConfig {
  token?: string;
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    try {
      return localStorage.getItem('access_token');
    } catch {
      return null;
    }
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
    config?: RequestConfig,
  ): Promise<T> {
    const token = config?.token ?? this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }

      const errorBody = (await response.json().catch(() => ({ message: response.statusText }))) as {
        message?: string;
      };
      throw new Error(errorBody.message ?? response.statusText);
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { method: 'GET' }, config);
  }

  post<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(
      path,
      {
        method: 'POST',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      config,
    );
  }

  put<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(
      path,
      {
        method: 'PUT',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      config,
    );
  }

  patch<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(
      path,
      {
        method: 'PATCH',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      config,
    );
  }

  delete<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' }, config);
  }
}

export const httpClient = new HttpClient(BASE_URL);
