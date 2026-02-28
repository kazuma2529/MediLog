"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/home", label: "ホーム" },
  { href: "/medications", label: "薬一覧" },
  { href: "/history", label: "履歴" },
  { href: "/settings", label: "設定" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-lg justify-around">
        {navItems.map(({ href, label }) => {
          const isActive =
            pathname === href ||
            (href !== "/home" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex min-h-[56px] min-w-[64px] flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2 text-[11px] transition-colors"
              style={{
                color: isActive ? "var(--accent)" : "var(--muted)",
                fontWeight: isActive ? 500 : 400,
              }}
            >
              <span className="font-mono tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
