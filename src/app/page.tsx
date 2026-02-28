"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDevAuth, isMockAuthEnabled } from "@/lib/auth";

export default function RootPage() {
  const router = useRouter();
  const { isLoading, user } = useDevAuth();

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.replace("/home");
      return;
    }

    if (isMockAuthEnabled()) {
      router.replace("/home");
      return;
    }

    router.replace("/login");
  }, [isLoading, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="font-mono text-sm" style={{ color: "var(--muted)" }}>
        Loading...
      </div>
    </div>
  );
}
