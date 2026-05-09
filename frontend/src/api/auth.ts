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

export interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateNotificationsPayload {
  push_notifications?: boolean;
  email_notifications?: boolean;
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
    // Add timestamp to prevent browser from serving a stale cached response
    const response = await apiClient.get(`/user?_t=${Date.now()}`);
    return response.data;
  },
  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await apiClient.post("/reset-password", data);
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await apiClient.patch('/user', data);
    return response.data;
  },
  updatePassword: async (data: UpdatePasswordPayload) => {
    const response = await apiClient.patch('/user/password', data);
    return response.data;
  },
  updateNotifications: async (data: { notification_settings: any }) => {
    const response = await apiClient.patch('/user/notifications', data);
    return response.data;
  },
  uploadDocument: async (file: File) => {
    const formData = new FormData();
    
    // Ensure the file has a MIME type, fallback based on extension if OS failed to provide one
    let mimeType = file.type;
    if (!mimeType) {
      if (file.name.toLowerCase().endsWith('.pdf')) mimeType = 'application/pdf';
      else if (file.name.toLowerCase().endsWith('.doc')) mimeType = 'application/msword';
      else if (file.name.toLowerCase().endsWith('.docx')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else mimeType = 'application/octet-stream';
    }
    
    const safeFile = new File([file], file.name, { type: mimeType });
    formData.append('document', safeFile);
    
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${apiClient.defaults.baseURL}/user/documents`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
        // Crucially, DO NOT set Content-Type. The browser will automatically set it to multipart/form-data with the correct boundary.
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to upload document');
    }
    
    return await response.json();
  },
  deleteDocument: async (id: string | number) => {
    const response = await apiClient.delete(`/user/documents/${id}`);
    return response.data;
  },
  addLink: async (data: { label: string; url: string }) => {
    const response = await apiClient.post('/user/links', data);
    return response.data;
  },
  deleteLink: async (id: string | number) => {
    const response = await apiClient.delete(`/user/links/${id}`);
    return response.data;
  },
  editLink: async (id: string | number, data: { label: string; url: string }) => {
    // The backend does not have an edit link endpoint, so we simulate it
    // by deleting the old link and adding a new one with the updated data.
    await apiClient.delete(`/user/links/${id}`);
    const response = await apiClient.post('/user/links', data);
    return response.data;
  },
};
