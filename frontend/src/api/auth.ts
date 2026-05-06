import apiClient from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  message?: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const authService = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/login', data);
    return response.data;
  },
  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/register', data);
    return response.data;
  },
  logout: async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },
  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },
  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await apiClient.post("/reset-password", data);
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await apiClient.patch('/profile', data);
    return response.data;
  },
};
