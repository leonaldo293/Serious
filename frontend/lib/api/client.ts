export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // FORÇAR HARDCODE - problema com variáveis de ambiente
  const API_BASE_URL = 'http://localhost:5000';
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🔍 API Debug:', { 
    url, 
    endpoint, 
    API_BASE_URL,
    processEnv: process.env.NEXT_PUBLIC_API_URL,
    isClient: typeof window !== 'undefined',
    endpointType: typeof endpoint,
    urlType: typeof url
  });
  
  console.log('🔍 API Debug (JSON):', JSON.stringify({
    url, 
    endpoint, 
    API_BASE_URL,
    processEnv: process.env.NEXT_PUBLIC_API_URL,
    isClient: typeof window !== 'undefined',
    endpointType: typeof endpoint,
    urlType: typeof url
  }, null, 2));
  
  // Validar URL antes de continuar
  if (!url || url.includes('undefined/') || !url.startsWith('http')) {
    console.error('❌ URL Inválida:', { url, API_BASE_URL, endpoint });
    throw new Error(`URL inválida: ${url} - verifique variáveis de ambiente`);
  }
  
  // Get token from localStorage for authenticated requests
  const user = typeof window !== 'undefined' ? localStorage.getItem('eltx-user') : null;
  const token = user ? JSON.parse(user).token : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Important for cookies if using httpOnly tokens
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || 'An error occurred',
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('🚨 Network Error Details:', {
      error,
      url,
      endpoint,
      API_BASE_URL,
      isClient: typeof window !== 'undefined'
    });
    throw new Error('Network error occurred');
  }
}

// Helper methods for common HTTP methods
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean>, options: RequestInit = {}) => {
    // Build URL with query parameters
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url = `${endpoint}?${queryString}`;
      }
    }
    return apiClient<T>(url, { ...options, method: 'GET' });
  },
  
  post: <T>(endpoint: string, body: unknown, options: RequestInit = {}) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown, options: RequestInit = {}) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options: RequestInit = {}) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),

  patch: <T>(endpoint: string, body: unknown, options: RequestInit = {}) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
};
