"use client";

import Link from "next/link";
import { db } from "@/lib/db";
import { TIMINGS } from "@/lib/utils";

export default function MedicationsPage() {
  const { data, isLoading, error } = db.useQuery({
    medications: {
      $: {
        order: { createdAt: "desc" },
      },
    },
  });

  const medications = data?.medications ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="font-mono text-sm" style={{ color: "var(--muted)" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p style={{ color: "var(--error)" }}>エラー: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <header className="border-b border-border px-4 py-6">
        <h1 className="text-2xl font-light tracking-tight" style={{ color: "var(--foreground)" }}>
          薬・サプリ一覧
        </h1>
      </header>
      <div className="px-4">
        <Link
          href="/medications/new"
          className="mb-4 flex items-center justify-center gap-2 rounded py-3 text-sm font-mono"
          style={{
            backgroundColor: "var(--accent)",
            border: "1px solid var(--accent)",
            color: "var(--foreground)",
          }}
        >
          + 新規登録
        </Link>
        {medications.length === 0 ? (
          <p className="py-8 text-center font-mono text-sm" style={{ color: "var(--muted)" }}>
            登録された薬がありません
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {medications.map((m) => {
              let timingsLabel = "";
              try {
                const keys: string[] = JSON.parse(m.timings || "[]");
                timingsLabel = keys
                  .map((k) => TIMINGS.find((t) => t.key === k)?.label ?? k)
                  .join("・");
              } catch {
                timingsLabel = "-";
              }

              return (
                <li key={m.id}>
                  <Link
                    href={`/medications/${m.id}`}
                    className="block py-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          className="font-medium"
                          style={{
                            color: m.isActive ? "var(--foreground)" : "var(--muted)",
                          }}
                        >
                          {m.name}
                        </span>
                        {!m.isActive && (
                          <span className="ml-2 text-xs" style={{ color: "var(--muted)" }}>
                            （服用中止）
                          </span>
                        )}
                        <p className="mt-0.5 font-mono text-xs" style={{ color: "var(--muted)" }}>
                          {m.dosage} — {timingsLabel}
                        </p>
                      </div>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
