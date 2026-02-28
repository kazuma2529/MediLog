"use client";

import { IntakeButton } from "./IntakeButton";
import type { TimingKey } from "@/lib/utils";
import { todayNum } from "@/lib/utils";
import { db } from "@/lib/db";
import { id } from "@instantdb/react";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  timings: string;
  intakeLogs: Array<{
    id: string;
    timing: string;
  }>;
};

type IntakeSectionProps = {
  timingKey: TimingKey;
  label: string;
  medications: Medication[];
  isExpanded: boolean;
  onToggleExpand: () => void;
};

export function IntakeSection({
  timingKey,
  label,
  medications,
  isExpanded,
  onToggleExpand,
}: IntakeSectionProps) {
  const filtered = medications.filter((m) => {
    try {
      const timings: string[] = JSON.parse(m.timings || "[]");
      return timings.includes(timingKey);
    } catch {
      return false;
    }
  });

  if (filtered.length === 0) return null;

  return (
    <section className="border-b border-border">
      <button
        type="button"
        onClick={onToggleExpand}
        className="flex w-full items-center justify-between py-4 px-4 text-left"
      >
        <span className="font-mono text-sm tracking-wider" style={{ color: "var(--muted)" }}>
          {label}
        </span>
        <span
          className="text-xs transition-transform"
          style={{
            color: "var(--muted)",
            transform: isExpanded ? "rotate(180deg)" : "none",
          }}
        >
          ▼
        </span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          {filtered.map((med) => {
            const log = med.intakeLogs?.find((l) => l.timing === timingKey);
            const isTaken = !!log;

            return (
              <IntakeButton
                key={med.id}
                medicationId={med.id}
                medicationName={med.name}
                dosage={med.dosage}
                timing={timingKey}
                isTaken={isTaken}
                intakeLogId={log?.id ?? null}
                onToggle={() => {
                  if (isTaken && log) {
                    db.transact(db.tx.intakeLogs[log.id].delete());
                  } else {
                    const logId = id();
                    db.transact(
                      db.tx.intakeLogs[logId]
                        .create({
                          date: todayNum(),
                          timing: timingKey,
                          takenAt: Date.now(),
                          createdAt: Date.now(),
                        })
                        .link({ medication: med.id })
                    );
                  }
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
