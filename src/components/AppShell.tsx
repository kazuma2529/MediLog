"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { useDevAuth } from "@/lib/auth";
import { saveRefreshToken } from "@/lib/session";

const HIDE_NAV_PATHS = ["/login", "/"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !HIDE_NAV_PATHS.includes(pathname ?? "");
  const { user } = useDevAuth();

  // ログイン中は refresh_token を localStorage に保存しておく
  useEffect(() => {
    const token = (user as { refresh_token?: string } | null | undefined)?.refresh_token;
    if (token) {
      saveRefreshToken(token);
    }
  }, [user]);

  return (
    <>
      <main className="min-h-screen pb-16">{children}</main>
      {showNav && <BottomNav />}
    </>
  );
}
