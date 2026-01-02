"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTokenExpiry, isTokenExpired } from "../utils/token";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );

  const logoutWithMessage = (msg: string) => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    router.replace(`/login?reason=${encodeURIComponent(msg)}`);
  };

  

  useEffect(() => {
    if (!token) return;

    if (isTokenExpired(token)) {
      logoutWithMessage("Session expired. Please login again.");
      return;
    }
    const expiryTime = getTokenExpiry(token);
    if (!expiryTime) return;

    const timeout = expiryTime - Date.now();

    const timer = setTimeout(() => {
      logoutWithMessage("Session expired. Please login again.");
    }, timeout);

    return () => clearTimeout(timer);
  }, [token]);


  const [user, setUser] = useState<User | null>(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null
  );

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
