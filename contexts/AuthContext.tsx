import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

const STORAGE_KEY = '@logipoint_user';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);



  const login = useCallback(async (password: string, viewerCode?: string) => {
    if (__DEV__) {
      console.warn(
        '[SECURITY WARNING] Using hardcoded credentials for development. ' +
        'Replace with secure authentication in production.'
      );
    }

    if (viewerCode) {
      const mockUser: User = {
        id: '2',
        name: 'Viewer User',
        email: 'viewer@logipoint.com',
        role: 'viewer',
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }
    
    if (password === 'Logi@2030') {
      const mockUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@logipoint.com',
        role: 'admin',
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }
    
    throw new Error('Invalid credentials');
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    login,
    logout,
  }), [user, isLoading, isAdmin, login, logout]);
});
