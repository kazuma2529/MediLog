"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";

export default function LoginPage() {
  const router = useRouter();
  const [sentEmail, setSentEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const codeInputRef = useRef<HTMLInputElement>(null);

  if (!sentEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="border-b border-border pb-8">
            <h1 className="text-3xl font-light tracking-tight" style={{ color: "var(--foreground)" }}>
              MediLog
            </h1>
            <p className="mt-2 font-mono text-xs" style={{ color: "var(--muted)" }}>
              薬・サプリメント服用管理
            </p>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              const input = e.currentTarget.querySelector<HTMLInputElement>('input[type="email"]');
              const email = input?.value?.trim();
              if (!email) return;

              setSending(true);
              try {
                await db.auth.sendMagicCode({ email });
                setSentEmail(email);
              } catch (err) {
                setError(err instanceof Error ? err.message : "送信に失敗しました");
              } finally {
                setSending(false);
              }
            }}
            className="mt-8 space-y-6"
          >
            <div>
              <label className="mb-1 block font-mono text-xs" style={{ color: "var(--muted)" }}>
                メールアドレス
              </label>
              <input
                type="email"
                required
                placeholder="example@email.com"
                className="w-full border-b border-border bg-transparent py-3 outline-none"
                style={{ color: "var(--foreground)" }}
              />
            </div>
            {error && (
              <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded py-3 font-mono text-sm tracking-wider disabled:opacity-50"
              style={{
                backgroundColor: "var(--accent)",
                border: "1px solid var(--accent)",
                color: "var(--foreground)",
              }}
            >
              {sending ? "送信中..." : "認証コードを送信"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="border-b border-border pb-8">
          <h1 className="text-3xl font-light tracking-tight" style={{ color: "var(--foreground)" }}>
            MediLog
          </h1>
          <p className="mt-2 font-mono text-xs" style={{ color: "var(--muted)" }}>
            認証コードを入力
          </p>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            const code = codeInputRef.current?.value?.trim();
            if (!code) return;

            setVerifying(true);
            try {
              await db.auth.signInWithMagicCode({ email: sentEmail, code });
              router.push("/home");
            } catch (err) {
              setError(err instanceof Error ? err.message : "認証に失敗しました");
              codeInputRef.current?.focus();
            } finally {
              setVerifying(false);
            }
          }}
          className="mt-8 space-y-6"
        >
          <p className="text-sm" style={{ color: "var(--foreground)" }}>
            <strong>{sentEmail}</strong> に送信した6桁のコードを入力してください
          </p>
          <div>
            <label className="mb-1 block font-mono text-xs" style={{ color: "var(--muted)" }}>
              認証コード
            </label>
            <input
              ref={codeInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              placeholder="123456"
              className="w-full border-b border-border bg-transparent py-3 font-mono text-xl tracking-[0.5em] outline-none"
              style={{ color: "var(--foreground)" }}
            />
          </div>
          {error && (
            <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={verifying}
            className="w-full rounded py-3 font-mono text-sm tracking-wider disabled:opacity-50"
            style={{
              backgroundColor: "var(--accent)",
              border: "1px solid var(--accent)",
              color: "var(--foreground)",
            }}
          >
            {verifying ? "確認中..." : "ログイン"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setSentEmail("")}
          className="mt-4 text-sm"
          style={{ color: "var(--muted)" }}
        >
          ← 別のメールアドレスで送信
        </button>
      </div>
    </div>
  );
}
