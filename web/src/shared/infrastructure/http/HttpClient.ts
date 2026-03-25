const ENV_API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'];

const BASE_URL =
  (typeof window !== 'undefined' &&
    (window as Window & typeof globalThis & { __API_BASE_URL__?: string }).__API_BASE_URL__) ||
  ENV_API_BASE_URL ||
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
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

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

  private async tryRefreshToken(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = (await response.json()) as { data?: { accessToken?: string } };
      const newAccessToken = data?.data?.accessToken;
      if (newAccessToken) {
        localStorage.setItem('access_token', newAccessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  private async handleRefresh(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }
    this.isRefreshing = true;
    this.refreshPromise = this.tryRefreshToken().finally(() => {
      this.isRefreshing = false;
      this.refreshPromise = null;
    });
    return this.refreshPromise;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
    config?: RequestConfig,
    isRetry = false,
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
      if (response.status === 401 && typeof window !== 'undefined' && !isRetry) {
        const refreshed = await this.handleRefresh();
        if (refreshed) {
          return this.request<T>(path, options, config, true);
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }

      if (response.status === 401 && typeof window !== 'undefined' && isRetry) {
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
