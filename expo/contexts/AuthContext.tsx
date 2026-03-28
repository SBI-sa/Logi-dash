import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export type UserRole = 'admin' | 'fullViewer' | 'limitedViewer';

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



  const login = useCallback(async (accessCode: string) => {
    const limitedViewerPassword = process.env.EXPO_PUBLIC_VIEWER_PASSWORD!;
    const fullViewerPassword = process.env.EXPO_PUBLIC_FULL_VIEWER_PASSWORD!;
    const adminPassword = process.env.EXPO_PUBLIC_ADMIN_PASSWORD!;

    if (accessCode === limitedViewerPassword) {
      const mockUser: User = {
        id: '3',
        name: 'Limited Viewer',
        email: 'limited@logipoint.com',
        role: 'limitedViewer',
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }

    if (accessCode === fullViewerPassword) {
      const mockUser: User = {
        id: '2',
        name: 'Full Viewer',
        email: 'viewer@logipoint.com',
        role: 'fullViewer',
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }
    
    if (accessCode === adminPassword) {
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
  const isFullViewer = user?.role === 'fullViewer';
  const isLimitedViewer = user?.role === 'limitedViewer';
  const hasFullAccess = isAdmin || isFullViewer;

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    isFullViewer,
    isLimitedViewer,
    hasFullAccess,
    login,
    logout,
  }), [user, isLoading, isAdmin, isFullViewer, isLimitedViewer, hasFullAccess, login, logout]);
});
