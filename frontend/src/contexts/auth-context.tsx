'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api';
import { User, LoginRequest, TokenResponse } from '@/types/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: user, isLoading: loading, error, refetch } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: () => apiGet<User>('/api/v1/auth/me'),
    retry: false, // Don't retry auth checks if unauthorized
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const login = useCallback(async (credentials: LoginRequest) => {
    // Note: Assuming standard OAuth2 password flow which typically expects form data
    // but using json API client. Adjust if backend needs application/x-www-form-urlencoded
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const data = await response.json();
        errorMessage = data.detail || errorMessage;
      } catch (e) {}
      throw new Error(errorMessage);
    }
    
    try {
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('session_token', data.token);
      }
    } catch (e) {}
    
    // Depending on backend, the token could be in cookies (HttpOnly) or response body.
    // Assuming backend sets HttpOnly cookie for session management.
    await refetch();
  }, [refetch]);

  const logout = useCallback(async () => {
    try {
      await apiPost('/api/v1/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('session_token');
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.clear();
      // Optionally redirect to login here, but usually handled by components
    }
  }, [queryClient]);

  // If there's an auth error (like 401), treat user as null
  const activeUser = error ? null : (user || null);

  return (
    <AuthContext.Provider value={{ user: activeUser, loading, login, logout }}>
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
