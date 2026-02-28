"use client";

import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ja } from "date-fns/locale";
import { toDateNum } from "@/lib/utils";

type CalendarViewProps = {
  yearMonth: Date;
  takenDates: Set<number>;
  expectedDates: Set<number>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function CalendarView({
  yearMonth,
  takenDates,
  expectedDates,
  onPrevMonth,
  onNextMonth,
}: CalendarViewProps) {
  const start = startOfMonth(yearMonth);
  const end = endOfMonth(yearMonth);
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="rounded border border-border p-3">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          className="px-2 py-1 text-sm"
          style={{ color: "var(--muted)" }}
        >
          ←
        </button>
        <span className="font-mono text-sm" style={{ color: "var(--foreground)" }}>
          {format(yearMonth, "yyyy年M月", { locale: ja })}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          className="px-2 py-1 text-sm"
          style={{ color: "var(--muted)" }}
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
          <div
            key={d}
            className="py-1 font-mono text-[10px]"
            style={{ color: "var(--muted)" }}
          >
            {d}
          </div>
        ))}
        {Array.from({ length: start.getDay() })
          .fill(null)
          .map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
        {days.map((d) => {
          const num = toDateNum(d);
          const taken = takenDates.has(num);
          const expected = expectedDates.has(num);

          return (
            <div
              key={num}
              className="flex aspect-square items-center justify-center font-mono text-xs"
              style={{
                backgroundColor: taken
                  ? "var(--success)"
                  : expected
                    ? "rgba(139, 58, 58, 0.15)"
                    : "transparent",
                color: taken ? "var(--background)" : "var(--foreground)",
              }}
            >
              {format(d, "d")}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-4 justify-center text-[10px]" style={{ color: "var(--muted)" }}>
        <span>■ 飲めた</span>
        <span>□ 対象日</span>
      </div>
    </div>
  );
}
