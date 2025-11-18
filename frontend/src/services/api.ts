// This file will handle all communication with the backend API.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// A utility function to get the auth token from localStorage
const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const tokenData = localStorage.getItem('whatzboot-token');
    if (!tokenData) return null;

    try {
        const token: { access_token: string } = JSON.parse(tokenData);
        return token.access_token;
    } catch (e) {
        console.error('Failed to parse token from localStorage', e);
        localStorage.removeItem('whatzboot-token');
        return null;
    }
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !options.headers?.hasOwnProperty('Authorization')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An unknown API error occurred' }));
      // The error structure from FastAPI is often { detail: '...' } or { detail: [{...}] }
      let errorMessage = 'An error occurred.';
      if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(e => `${e.loc[1]} - ${e.msg}`).join(', ');
      }
      throw new Error(errorMessage);
    }

    // Handle cases with no content in response
    if (response.status === 204) {
      return Promise.resolve(null as T);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export default request;
