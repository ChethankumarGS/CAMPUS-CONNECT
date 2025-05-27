"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types/user";
import { authService } from "../services/auth.service";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token and load user data
      const loadUserData = async () => {
        try {
          const response = await authService.verifyToken(token);
          console.log("verifytoken response", response);

          setUser(response.data);
        } catch (error) {
          console.error("Failed to load user data:", error);
          localStorage.removeItem("token");
        }
        setLoading(false);
      };

      loadUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("token");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
