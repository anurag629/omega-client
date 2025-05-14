import axios from 'axios';
import Cookies from 'js-cookie';

// API base URL - should be set to your Django backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        
        // Update the tokens
        Cookies.set('accessToken', access, { expires: 1 }); // 1 day
        
        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API functions
export const api = {
  // Auth
  joinWaitlist: (data: { email: string; name: string; reason?: string }) => 
    apiClient.post('/api/auth/waiting-list/', data),
  
  register: (data: { 
    email: string; 
    password: string; 
    password2: string; 
    first_name: string; 
    last_name: string; 
    invitation_token: string; 
  }) => apiClient.post('/api/auth/register/', data),
  
  login: (data: { email: string; password: string }) => 
    apiClient.post('/api/auth/login/', data),
  
  verifyEmail: (token: string) => 
    apiClient.post('/api/auth/verify-email/', { token }),
  
  getProfile: () => 
    apiClient.get('/api/auth/profile/'),
  
  // Manim scripts
  generateScript: (data: { 
    prompt: string; 
    provider: 'gemini' | 'azure_openai'; 
    execute?: boolean; 
  }) => apiClient.post('/api/generate-manim/', data),
  
  getScripts: () => 
    apiClient.get('/api/scripts/'),
  
  getScript: (id: string) => 
    apiClient.get(`/api/scripts/${id}/`),
};

export default api; 