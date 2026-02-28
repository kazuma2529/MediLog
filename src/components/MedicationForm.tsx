"use client";

import { useState, useCallback } from "react";
import { db } from "@/lib/db";
import { id } from "@instantdb/react";
import { useAuthUserId } from "@/lib/auth";
import { todayNum } from "@/lib/utils";
import { TIMINGS, type TimingKey } from "@/lib/utils";

type MedicationFormProps = {
  defaultName?: string;
  defaultDosage?: string;
  defaultMemo?: string;
  defaultTimings?: string[];
  defaultIsActive?: boolean;
  medicationId?: string;
  onSuccess?: () => void;
};

export function MedicationForm({
  defaultName = "",
  defaultDosage = "",
  defaultMemo = "",
  defaultTimings = [],
  defaultIsActive = true,
  medicationId,
  onSuccess,
}: MedicationFormProps) {
  const userId = useAuthUserId();
  const [name, setName] = useState(defaultName);
  const [dosage, setDosage] = useState(defaultDosage);
  const [memo, setMemo] = useState(defaultMemo);
  const [timings, setTimings] = useState<Set<TimingKey>>(
    () => new Set(defaultTimings as TimingKey[])
  );
  const [isActive, setIsActive] = useState(defaultIsActive);
  const [saving, setSaving] = useState(false);

  const toggleTiming = useCallback((key: TimingKey) => {
    setTimings((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const isFormValid =
    name.trim().length > 0 && dosage.trim().length > 0 && timings.size > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    if (!userId) {
      alert("ログインが必要です。ログイン画面からログインしてください。");
      return;
    }
    setSaving(true);

    try {
      const timingsJson = JSON.stringify([...timings]);
      const now = Date.now();

      if (medicationId) {
        db.transact(
          db.tx.medications[medicationId].update({
            name: name.trim(),
            dosage: dosage.trim(),
            memo: memo.trim() || undefined,
            timings: timingsJson,
            isActive,
          })
        );
      } else {
        const medId = id();
        db.transact(
          db.tx.medications[medId]
            .create({
              name: name.trim(),
              dosage: dosage.trim(),
              memo: memo.trim() || undefined,
              timings: timingsJson,
              isActive,
              startDate: todayNum(),
              createdAt: now,
            })
            .link({ user: userId })
        );
      }
      onSuccess?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-4 pb-8">
      <div>
        <label className="mb-1 block font-mono text-xs" style={{ color: "var(--muted)" }}>
          名前
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="例：ビタミンC"
          className="w-full border-b border-border bg-transparent py-2 outline-none"
          style={{ color: "var(--foreground)" }}
        />
      </div>
      <div>
        <label className="mb-1 block font-mono text-xs" style={{ color: "var(--muted)" }}>
          用量
        </label>
        <input
          type="text"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          required
          placeholder="例：1錠"
          className="w-full border-b border-border bg-transparent py-2 outline-none"
          style={{ color: "var(--foreground)" }}
        />
      </div>
      <div>
        <label className="mb-1 block font-mono text-xs" style={{ color: "var(--muted)" }}>
          服用時間帯（複数選択可）
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {TIMINGS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleTiming(key)}
              className="rounded px-3 py-1.5 text-sm font-mono"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: timings.has(key) ? "var(--accent)" : "transparent",
                color: timings.has(key) ? "var(--background)" : "var(--foreground)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block font-mono text-xs" style={{ color: "var(--muted)" }}>
          メモ（任意）
        </label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="例：食後に飲む"
          className="w-full border-b border-border bg-transparent py-2 outline-none"
          style={{ color: "var(--foreground)" }}
        />
      </div>
      {medicationId && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="isActive" className="text-sm" style={{ color: "var(--foreground)" }}>
            服用中（オフにすると一覧から非表示、履歴は保持）
          </label>
        </div>
      )}
      <button
        type="submit"
        disabled={saving || !isFormValid}
        className="w-full py-3 font-mono text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        style={{
          border: "1px solid var(--accent)",
          backgroundColor: isFormValid && !saving ? "var(--accent)" : "transparent",
          color: isFormValid && !saving ? "var(--background)" : "var(--muted)",
          cursor: isFormValid && !saving ? "pointer" : "not-allowed",
        }}
      >
        {saving ? "保存中..." : "保存"}
      </button>
    </form>
  );
}
