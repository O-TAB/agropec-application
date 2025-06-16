
// src/services/api.ts

const BASE_URL = 'http://localhost:3000/api'; // Substitua pela URL da sua API

interface RequestOptions extends RequestInit {
  body?: any; // Permite que o body seja de qualquer tipo
}

async function request<T>(
  url: string,
  method: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config: RequestInit = {
    method,
    headers,
    ...options,
  };

  if (options.body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro na requisição');
    }

    // Tenta parsear JSON, mas retorna vazio se não houver conteúdo
    const data = await response.json().catch(() => ({}));
    return data as T;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

export const api = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, 'GET', options),

  post: <T>(url: string, data: any, options?: RequestOptions) =>
    request<T>(url, 'POST', { ...options, body: data }),

  put: <T>(url: string, data: any, options?: RequestOptions) =>
    request<T>(url, 'PUT', { ...options, body: data }),

  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, 'DELETE', options),

  patch: <T>(url: string, data: any, options?: RequestOptions) =>
    request<T>(url, 'PATCH', { ...options, body: data }),
};



