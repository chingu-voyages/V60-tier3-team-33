import apiClient from "./client";

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
  token_type?: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  message?: string;
}

export const authService = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/login", data);
    return response.data;
  },
  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/register", data);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post("/logout");
    localStorage.removeItem("auth_token");
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get("/profile");
    return response.data;
  },
};
