"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";

const HIDE_NAV_PATHS = ["/login", "/"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !HIDE_NAV_PATHS.includes(pathname ?? "");

  return (
    <>
      <main className="min-h-screen pb-16">{children}</main>
      {showNav && <BottomNav />}
    </>
  );
}
