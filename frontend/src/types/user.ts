export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  courses?: string[]; // Array of course IDs
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "student" | "lecturer";
}

export interface AuthResponse {
  user: User;
  token: string;
}
