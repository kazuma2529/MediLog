"use client";

import { db } from "./db";
import { clearRefreshToken } from "./session";

export function useDevAuth() {
  return db.useAuth();
}

export function useAuthUserId(): string | null {
  const { user } = useDevAuth();
  return user?.id ?? null;
}

export function signOut(): Promise<void> {
  clearRefreshToken();
  return db.auth.signOut();
}

export function isMockAuthEnabled(): boolean {
  return (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_MOCK_AUTH === "true"
  );
}
