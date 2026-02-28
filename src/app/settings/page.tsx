"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { useDevAuth, signOut } from "@/lib/auth";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading, error } = useDevAuth();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) return;
    const ok = confirm(
      "アカウントを削除すると、服用履歴を含むすべてのデータが完全に削除されます。この操作は取り消せません。本当に削除しますか？"
    );
    if (!ok) return;

    setDeleting(true);
    try {
      const refreshToken = (user as { refresh_token?: string }).refresh_token;
      if (!refreshToken) {
        alert("セッション情報が取得できません。一度ログアウトして再度ログインしてください。");
        setDeleting(false);
        return;
      }

      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to delete");
      }

      await signOut();
      router.push("/login");
    } catch (err) {
      alert(err instanceof Error ? err.message : "削除に失敗しました");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="font-mono text-sm" style={{ color: "var(--muted)" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <header className="border-b border-border px-4 py-6">
        <h1 className="text-2xl font-light tracking-tight" style={{ color: "var(--foreground)" }}>
          設定
        </h1>
      </header>

      <div className="px-4 py-6 space-y-8">
        {user && (
          <section>
            <h2 className="mb-2 font-mono text-xs" style={{ color: "var(--muted)" }}>
              アカウント
            </h2>
            <p className="text-sm" style={{ color: "var(--foreground)" }}>
              {user.email ?? "未設定"}
            </p>
          </section>
        )}

        <section>
          <h2 className="mb-2 font-mono text-xs" style={{ color: "var(--muted)" }}>
            ログアウト
          </h2>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              router.push("/login");
            }}
            className="rounded border px-4 py-2 text-sm font-mono"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            ログアウト
          </button>
        </section>

        <section>
          <h2 className="mb-2 font-mono text-xs" style={{ color: "var(--error)" }}>
            危険な操作
          </h2>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="rounded border px-4 py-2 text-sm font-mono disabled:opacity-50"
            style={{ borderColor: "var(--error)", color: "var(--error)" }}
          >
            {deleting ? "削除中..." : "アカウント削除"}
          </button>
          <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
            アカウントを削除すると、すべてのデータが完全に削除され、復元できません。
          </p>
        </section>
      </div>
    </div>
  );
}
