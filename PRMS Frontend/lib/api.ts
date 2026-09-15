export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8085/api/v1',
  timeout: 30000,
  retries: 3,
};

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  status: number;
  message: string;
  errors?: string[];
  timestamp: string;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private retries: number;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.timeout = API_CONFIG.timeout;
    this.retries = API_CONFIG.retries;
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = `Bearer dev_admin_token`;
      }
    }
    return headers;
  }

  private parseErrorBody(body: unknown, statusText: string): { message: string; errors: string[] } {
    if (!body || typeof body !== 'object') return { message: statusText || 'Request failed', errors: [] };
    const record = body as Record<string, unknown>;
    const message =
      (typeof record.detail === 'string' && record.detail) ||
      (typeof record.message === 'string' && record.message) ||
      (typeof record.title === 'string' && record.title) ||
      statusText ||
      'Request failed';
    const errors: string[] = [];
    if (Array.isArray(record.errors)) {
      errors.push(...record.errors.filter((e): e is string => typeof e === 'string'));
    }
    if (record.violations && typeof record.violations === 'object') {
      Object.values(record.violations as Record<string, unknown>).forEach((v) => {
        if (typeof v === 'string') errors.push(v);
      });
    }
    return { message, errors };
  }

  private normalizeSuccessBody<T>(body: unknown): ApiResponse<T> {
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      return body as ApiResponse<T>;
    }
    return { success: true, data: body as T };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json') || contentType.includes('application/problem+json');
    const body = isJson ? await response.json().catch(() => null) : null;

    if (!response.ok) {
      const { message, errors } = this.parseErrorBody(body, response.statusText);
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      throw { status: response.status, message, errors, timestamp: new Date().toISOString() } as ApiError;
    }

    if (response.status === 204 || body === null) return { success: true, data: undefined as T };
    return this.normalizeSuccessBody<T>(body);
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = this.getAuthHeaders();
      const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers },
        signal: AbortSignal.timeout(this.timeout),
      });
      return await this.handleResponse<T>(response);
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      if (retryCount < this.retries && this.shouldRetry(err)) {
        await this.delay(Math.pow(2, retryCount) * 1000);
        return this.makeRequest(endpoint, options, retryCount + 1);
      }
      if (err && typeof err === 'object' && (err as { name?: string }).name === 'AbortError') {
        throw { status: 408, message: 'Request timeout', timestamp: new Date().toISOString() } as ApiError;
      }
      if (err && typeof err['status'] === 'number') throw error as ApiError;
      throw { status: 500, message: 'Network error occurred', timestamp: new Date().toISOString() } as ApiError;
    }
  }

  private shouldRetry(error: Record<string, unknown>): boolean {
    const status = error['status'];
    return !status || (typeof status === 'number' && status >= 500 && status < 600);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    let path = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) searchParams.append(key, String(value));
      });
      const qs = searchParams.toString();
      if (qs) path = `${endpoint}?${qs}`;
    }
    return this.makeRequest<T>(path);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PUT', body: data ? JSON.stringify(data) : undefined });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

export const handleApiError = (error: ApiError): string => {
  switch (error.status) {
    case 400: return error.errors?.join(', ') || 'Invalid request data';
    case 401: return 'Authentication required — please log in again';
    case 403: return 'Access denied';
    case 404: return 'Resource not found';
    case 409: return 'Resource conflict';
    case 422: return error.errors?.join(', ') || 'Validation failed';
    case 500: return 'Server error occurred';
    case 503: return 'Service temporarily unavailable';
    default: return error.message || 'An unexpected error occurred';
  }
};

export const isApiError = (error: unknown): error is ApiError =>
  error !== null &&
  typeof error === 'object' &&
  typeof (error as ApiError).status === 'number' &&
  typeof (error as ApiError).message === 'string';

export const queryKeys = {
  suppliers: ['suppliers'] as const,
  supplier: (id: string) => ['suppliers', id] as const,
  purchaseRequests: ['purchase-requests'] as const,
  purchaseRequest: (id: string) => ['purchase-requests', id] as const,
  approvals: ['approvals'] as const,
  pendingApprovals: ['approvals', 'pending'] as const,
  approval: (id: string) => ['approvals', id] as const,
  rfqs: ['rfqs'] as const,
  rfq: (id: string) => ['rfqs', id] as const,
  quotations: ['quotations'] as const,
  quotation: (id: string) => ['quotations', id] as const,
  purchaseOrders: ['purchase-orders'] as const,
  purchaseOrder: (id: string) => ['purchase-orders', id] as const,
  goodsReceipts: ['goods-receipts'] as const,
  goodsReceipt: (id: string) => ['goods-receipts', id] as const,
  invoices: ['invoices'] as const,
  invoice: (id: string) => ['invoices', id] as const,
  contracts: ['contracts'] as const,
  contract: (id: string) => ['contracts', id] as const,
  dashboardStats: ['dashboard', 'stats'] as const,
  reports: ['reports'] as const,
  auditLogs: ['audit-logs'] as const,
  settings: ['settings'] as const,
  workflows: ['workflows'] as const,
};
