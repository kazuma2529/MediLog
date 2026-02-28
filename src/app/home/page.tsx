"use client";

import { useMemo, useState } from "react";
import { db } from "@/lib/db";
import { TIMINGS, todayNum, getCurrentTimingKey, formatDateJa } from "@/lib/utils";
import { IntakeSection } from "@/components/IntakeSection";

export default function HomePage() {
  const today = useMemo(() => new Date(), []);
  const todayStr = todayNum();
  const currentTiming = getCurrentTimingKey();

  const [expandedTimings, setExpandedTimings] = useState<Set<string>>(
    () => new Set([currentTiming])
  );

  const { data, isLoading, error } = db.useQuery({
    medications: {
      $: { where: { isActive: true } },
      intakeLogs: {
        $: { where: { date: todayStr } },
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
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

  const medications = data?.medications ?? [];

  return (
    <div className="mx-auto max-w-lg">
      <header className="border-b border-border px-4 py-6">
        <h1 className="text-2xl font-light tracking-tight" style={{ color: "var(--foreground)" }}>
          MediLog
        </h1>
        <p className="mt-1 font-mono text-sm" style={{ color: "var(--muted)" }}>
          {formatDateJa(today)}
        </p>
      </header>

      {medications.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p className="font-mono text-sm" style={{ color: "var(--muted)" }}>
            登録された薬がありません
          </p>
          <a
            href="/medications/new"
            className="mt-4 inline-block text-sm underline"
            style={{ color: "var(--accent)" }}
          >
            薬を追加する
          </a>
        </div>
      ) : (
        <div>
          {TIMINGS.map(({ key, label }) => (
            <IntakeSection
              key={key}
              timingKey={key}
              label={label}
              medications={medications}
              isExpanded={expandedTimings.has(key)}
              onToggleExpand={() =>
                setExpandedTimings((prev) => {
                  const next = new Set(prev);
                  if (next.has(key)) next.delete(key);
                  else next.add(key);
                  return next;
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
