'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface User {
  id: string;
  email: string;
  role: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('authToken');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to check authentication:', error);
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  const setAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  return {
    user,
    loading,
    isAuthenticated,
    logout,
    setAuthToken,
  };
}
