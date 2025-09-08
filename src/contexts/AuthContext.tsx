'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userAPI, authAPI } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  checkUsername: (username: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, userType?: string, firstName?: string, lastName?: string, phone?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化時檢查自動登入
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await userAPI.checkAutoLogin();
        if (currentUser) {
          // 如果找到有效 token，直接自動登入
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 登入
  const login = async (username: string, password: string) => {
    try {
      const data = await authAPI.login(username, password);
      if (data.success) {
        localStorage.setItem('fovy_token', data.token);
        localStorage.setItem('fovy_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // 登出
  const logout = async () => {
    try {
      const token = userAPI.getToken();
      if (token) {
        await authAPI.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      userAPI.clearUser();
      setUser(null);
    }
  };

  // 檢查用戶名是否存在
  const checkUsername = async (username: string) => {
    try {
      const data = await authAPI.checkUsername(username);
      return data.exists;
    } catch (error) {
      console.error('Check username error:', error);
      return false;
    }
  };

  // 註冊
  const register = async (username: string, email: string, password: string, userType: string = 'freelancer', firstName: string = '', lastName: string = '', phone: string = '') => {
    try {
      const data = await authAPI.register(username, email, password, userType, firstName, lastName, phone);
      if (data.success) {
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const value = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    logout,
    checkUsername,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
