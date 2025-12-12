"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  avatar?: string;
  role: 'user' | 'student' | 'admin' | 'mentor' | 'instructor' | 'superadmin';
  status?: 'active' | 'inactive' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      setUser(res.data.data.user);
      localStorage.setItem("token", res.data.data.access_token);
      return { success: true };
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response: { data: { message: string } } }).response?.data?.message || 'Credenciais inválidas'
        : 'Credenciais inválidas';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    setUser(res.data.data.user);
    localStorage.setItem("token", res.data.data.access_token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found in localStorage");
        setLoading(false);
        return;
      }

      console.log("Loading user with token:", token.substring(0, 20) + "...");
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("User loaded:", res.data);
      setUser(res.data);
    } catch (err: unknown) {
      console.log("loadUser error:", (err as { response?: { status?: number; data?: any } }).response?.status, (err as { response?: { data?: any } }).response?.data);
      
      // If 401, clear invalid token
      if ((err as { response?: { status?: number } }).response?.status === 401) {
        console.log("Invalid token, clearing...");
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const roleHierarchy = {
      'user': 1,
      'student': 2,
      'mentor': 3,
      'instructor': 4,
      'admin': 5,
      'superadmin': 6
    };
    
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[permission as keyof typeof roleHierarchy] || 0;
    
    return userLevel >= requiredLevel;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user,
      hasPermission 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
