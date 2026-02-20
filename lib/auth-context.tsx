'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { User } from '@/lib/data-type';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<
  | {
      user: User | null;
      isAuthLoading: boolean;
      refreshUser: () => Promise<void>;
      login: (email: string, password: string) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const router = useRouter();

  const getUser = async (): Promise<void> => {
    try {
      const res = await fetch(
        new URL('/auth/me', process.env.NEXT_PUBLIC_NATUREX_BACKEND),
        {
          method: 'GET',
          credentials: 'include',
        },
      );

      if (!res.ok) {
        throw new Error('Failed to authenticate user');
      }

      const data = (await res.json()) as User;
      setUser(new User(data));
    } catch (e) {
      console.error(e);
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(
      new URL('/auth/login', process.env.NEXT_PUBLIC_NATUREX_BACKEND),
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      },
    );
    const { success } = await res.json();
    if (success) {
      await getUser();
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    await fetch(
      new URL('/auth/logout', process.env.NEXT_PUBLIC_NATUREX_BACKEND),
      {
        method: 'PUT',
        credentials: 'include',
      },
    );
    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthLoading, refreshUser: getUser, login, logout }}
    >
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
