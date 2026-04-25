"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { UserRole } from "@/types";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  profilePhoto?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithToken: (user: AuthUser, token: string, remember?: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage (remembered) or sessionStorage (not remembered)
  useEffect(() => {
    const storedToken = localStorage.getItem("token") ?? sessionStorage.getItem("token");
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        const u = json.data ?? json;
        const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://127.0.0.1:8000/storage";
        const photo = u.candidate?.profile_photo
          ? `${storageUrl}/${u.candidate.profile_photo}`
          : null;
        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as UserRole,
          profilePhoto: photo,
        });
        setToken(storedToken);
      })
      .catch(() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const loginWithToken = (userData: AuthUser, userToken: string, remember = true) => {
    if (remember) {
      localStorage.setItem("token", userToken);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", userToken);
      localStorage.removeItem("token");
    }
    setToken(userToken);
    setUser(userData);
  };

  const logout = async () => {
    const storedToken = localStorage.getItem("token") ?? sessionStorage.getItem("token");
    if (storedToken) {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      }).catch(() => {});
    }
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        loginWithToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
