/**
 * Shared API helpers for all frontend API calls.
 */

const API_BASE = '/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API ${options?.method ?? 'GET'} ${url}: ${res.statusText}`);
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.message ?? 'Unknown error');
  return json.data;
}

function jsonHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

// ─── Generic CRUD factory ───────────────────────────────────────────

export function createCrudApi<T, TCreate, TUpdate>(resource: string) {
  const base = `${API_BASE}/${resource}`;

  return {
    async fetchAll(query?: string): Promise<T[]> {
      const url = query ? `${base}?q=${encodeURIComponent(query)}` : base;
      return request<T[]>(url);
    },

    async fetchById(id: string): Promise<T> {
      return request<T>(`${base}/${id}`);
    },

    async create(data: TCreate): Promise<T> {
      return request<T>(base, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      });
    },

    async update(id: string, data: TUpdate): Promise<T> {
      return request<T>(`${base}/${id}`, {
        method: 'PUT',
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      });
    },

    async remove(id: string): Promise<void> {
      const res = await fetch(`${base}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Failed to delete ${resource}: ${res.statusText}`);
    },
  };
}
