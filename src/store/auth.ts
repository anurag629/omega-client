import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import api from '@/lib/api';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  email_verified: boolean;
  is_approved: boolean;
  date_joined: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    invitation_token: string;
  }) => Promise<void>;
  joinWaitlist: (data: {
    email: string;
    name: string;
    reason?: string;
  }) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      // Initialize auth state from cookies
      initAuth: async () => {
        // Check if tokens exist
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          set({ isLoading: true, error: null });
          // Get user profile
          const response = await api.getProfile();
          set({
            isAuthenticated: true,
            user: response.data,
            isLoading: false,
          });
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: 'Authentication failed',
          });
          // Clear cookies
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
        }
      },

      // Login
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.login({ email, password });
          
          // Get data from response
          const { access, refresh, user } = response.data;
          
          // Set cookies
          Cookies.set('accessToken', access, { expires: 1 }); // 1 day
          Cookies.set('refreshToken', refresh, { expires: 7 }); // 7 days
          
          set({
            isAuthenticated: true,
            user,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || 'Login failed',
          });
        }
      },

      // Register
      register: async (data) => {
        try {
          set({ isLoading: true, error: null });
          await api.register(data);
          
          set({
            isLoading: false,
          });
          
          // Don't automatically log in - require email verification
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || 'Registration failed',
          });
        }
      },

      // Join Waitlist
      joinWaitlist: async (data) => {
        try {
          set({ isLoading: true, error: null });
          await api.joinWaitlist(data);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || 'Failed to join waitlist',
          });
        }
      },

      // Logout
      logout: () => {
        // Clear cookies
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        
        // Reset state
        set({
          isAuthenticated: false,
          user: null,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore; 