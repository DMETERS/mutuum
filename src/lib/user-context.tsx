"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Dentist } from "./types";
import { dentistById } from "@/data/dentists";

const STORAGE_KEY = "mutuum.activeUser";

interface UserContextValue {
  user: Dentist | null;
  userId: string | null;
  ready: boolean;
  signIn: (dentistId: string) => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && dentistById(stored)) setUserId(stored);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const signIn = useCallback((dentistId: string) => {
    setUserId(dentistId);
    try {
      window.localStorage.setItem(STORAGE_KEY, dentistId);
    } catch {
      /* ignore */
    }
  }, []);

  const signOut = useCallback(() => {
    setUserId(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const user = userId ? dentistById(userId) ?? null : null;

  return (
    <UserContext.Provider value={{ user, userId, ready, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de <UserProvider>");
  return ctx;
}
