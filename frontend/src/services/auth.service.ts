import { ApiResponse } from "@/types/api";
import axios from "../lib/axios";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "../types/user";

export const authService = {
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await axios.post("/auth/login", credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post("/auth/signup", data);
    return response.data;
  },

  updateUser: async (
    id: string,
    data: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const response = await axios.put(`/users/${id}`, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axios.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
    }
  },

  verifyToken: async (token: string): Promise<ApiResponse<User>> => {
    const response = await axios.get("/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
