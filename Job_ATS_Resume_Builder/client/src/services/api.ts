const API_BASE = 'http://localhost:3001/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || 'Request failed');
  }

  return data.data;
}

// ===== Connections =====
export const api = {
  // Connections
  getConnections: () => request<any[]>('/connections'),

  getProviders: () => request<any[]>('/connections/providers'),

  getConnection: (id: string) => request<any>(`/connections/${id}`),

  testConnection: (data: { provider: string; modelName: string; apiKey: string }) =>
    request<{ message: string }>('/connections/test', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createConnection: (data: {
    connectionName: string;
    provider: string;
    modelName: string;
    apiKey: string;
  }) =>
    request<any>('/connections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateConnection: (id: string, data: { provider?: string; modelName?: string; apiKey?: string }) =>
    request<any>(`/connections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteConnection: (id: string) =>
    request<any>(`/connections/${id}`, { method: 'DELETE' }),

  scanLocalConnections: () =>
    request<{ added: number; connections: any[] }>('/connections/scan-local', { method: 'POST' }),

  // Analysis
  analyzeResume: (formData: FormData) =>
    request<any>('/analyze', {
      method: 'POST',
      body: formData,
    }),

  // Resume Builder
  buildResume: (data: { analysisId: string; connectionId: string }) =>
    request<any>('/build-resume', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  downloadResume: async (resumeId: string, format: 'docx' | 'pdf') => {
    if (format === 'docx') {
      const res = await fetch(`${API_BASE}/build-resume/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, format: 'docx' }),
      });
      if (!res.ok) throw new Error('Download failed');
      return res.blob();
    } else {
      const data = await request<{ content: string }>('/build-resume/download', {
        method: 'POST',
        body: JSON.stringify({ resumeId, format: 'text' }),
      });
      return data.content;
    }
  },

  // History
  getHistory: () => request<any[]>('/history'),

  getHistoryDetail: (id: string) => request<any>(`/history/${id}`),
};
