"use client";

import type { TimingKey } from "@/lib/utils";

type IntakeButtonProps = {
  medicationId: string;
  medicationName: string;
  dosage: string;
  timing: TimingKey;
  isTaken: boolean;
  intakeLogId: string | null;
  onToggle: () => void;
};

export function IntakeButton({
  medicationName,
  dosage,
  isTaken,
  onToggle,
}: IntakeButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 border-b border-border py-4 transition-colors last:border-b-0 active:opacity-80"
      style={{
        minHeight: 56,
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col items-start text-left">
        <span className="truncate text-base font-medium" style={{ color: "var(--foreground)" }}>
          {medicationName}
        </span>
        <span className="text-sm" style={{ color: "var(--muted)" }}>
          {dosage}
        </span>
      </div>
      <div
        className="flex-shrink-0 rounded px-4 py-2 text-sm font-mono tracking-wider"
        style={{
          minWidth: 72,
          minHeight: 40,
          border: "1px solid var(--border)",
          backgroundColor: isTaken ? "var(--success)" : "transparent",
          color: isTaken ? "var(--background)" : "var(--foreground)",
        }}
      >
        {isTaken ? "完了" : "飲んだ"}
      </div>
    </button>
  );
}
