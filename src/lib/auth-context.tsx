"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AUTH_STORAGE_KEY = "dollar_prompt_user_auth";
const DRAFT_PROMPT_KEY = "dollar_prompt_anonymous_draft";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  saveAnonymousDraft: (draft: any) => void;
  getAnonymousDraft: () => any | null;
  clearAnonymousDraft: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  saveAnonymousDraft: () => {},
  getAnonymousDraft: () => null,
  clearAnonymousDraft: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // ignore
    }
  }, []);

  const login = (email: string, name?: string) => {
    const newUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email,
      name: name || email.split("@")[0] || "User",
    };
    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const saveAnonymousDraft = (draft: any) => {
    localStorage.setItem(DRAFT_PROMPT_KEY, JSON.stringify(draft));
  };

  const getAnonymousDraft = () => {
    try {
      const data = localStorage.getItem(DRAFT_PROMPT_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const clearAnonymousDraft = () => {
    localStorage.removeItem(DRAFT_PROMPT_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        saveAnonymousDraft,
        getAnonymousDraft,
        clearAnonymousDraft,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
