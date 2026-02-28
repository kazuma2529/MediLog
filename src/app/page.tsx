"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { useDevAuth, isMockAuthEnabled } from "@/lib/auth";
import { getRefreshToken, clearRefreshToken } from "@/lib/session";

export default function RootPage() {
  const router = useRouter();
  const { isLoading, user } = useDevAuth();
  // 保存済みトークンでの復元を試みている間は true
  const [isRestoringSession, setIsRestoringSession] = useState(false);

  // アプリ起動時に一度だけ: 保存済みトークンがあれば再認証を試みる
  useEffect(() => {
    const token = getRefreshToken();
    if (!token) return;

    setIsRestoringSession(true);
    db.auth.signInWithToken(token)
      .catch(() => {
        // トークンが無効・期限切れの場合はクリアしてログインへ
        clearRefreshToken();
      })
      .finally(() => {
        setIsRestoringSession(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // InstantDB のセッション確認中、または独自のトークン復元中は待機
    if (isLoading || isRestoringSession) return;

    if (user) {
      router.replace("/home");
      return;
    }

    if (isMockAuthEnabled()) {
      router.replace("/home");
      return;
    }

    router.replace("/login");
  }, [isLoading, isRestoringSession, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="font-mono text-sm" style={{ color: "var(--muted)" }}>
        Loading...
      </div>
    </div>
  );
}
