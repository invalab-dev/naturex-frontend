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
      login: (email: string, password: string) => Promise<boolean>;
      logout: () => void;
    }
  | undefined
>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    return await fetch(
      new URL('/auth/login', process.env.NEXT_PUBLIC_NATUREX_BACKEND),
      {
        method: 'POST',
        headers: {
          contentType: 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      },
    ).then<boolean, boolean>(
      async (res) => {
        if (!res.ok) {
          console.error(res.statusText);
          return false;
        }
        const user = new User(await res.json());
        setUser(user);
        return true;
      },
      (error) => {
        console.error(error);
        return false;
      },
    );
  };

  const logout = async () => {
    setUser(null);
    await fetch(
      new URL('/auth/logout', process.env.NEXT_PUBLIC_NATUREX_BACKEND),
      {
        method: 'PUT',
      },
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
