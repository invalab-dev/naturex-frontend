'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { User } from '@/lib/data-type';

const AuthContext = createContext<
  | {
      user: User | null;
      isAuthLoading: boolean;
      refreshUser: () => Promise<void>;
      login: (email: string, password: string) => Promise<boolean>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const refreshUser = async (): Promise<void> => {
    try {
      const res = await fetch(
        new URL('/auth/me', process.env.NEXT_PUBLIC_NATUREX_BACKEND),
        {
          method: 'GET',
          credentials: 'include',
        },
      );

      if (!res.ok) {
        setUser(null);
        return;
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
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    return await fetch(
      new URL('/auth/login', process.env.NEXT_PUBLIC_NATUREX_BACKEND),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      },
    ).then<boolean, boolean>(
      async (res) => {
        if (!res.ok) {
          console.error(res.statusText);
          return false;
        }

        await refreshUser();

        return true;
      },
      (error) => {
        console.error(error);
        return false;
      },
    );
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
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthLoading, refreshUser, login, logout }}
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
