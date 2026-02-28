"use client";

import { useMemo, useState } from "react";
import { db } from "@/lib/db";
import {
  addDays,
  format,
  fromDateNum,
  toDateNum,
  todayNum,
  PERIODS,
  getDateRangeForPeriod,
} from "@/lib/utils";
import { AdherenceChart } from "@/components/charts/AdherenceChart";
import { CalendarView } from "@/components/charts/CalendarView";

export default function HistoryPage() {
  const [periodKey, setPeriodKey] = useState("1m");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  const today = todayNum();
  const { startNum, endNum } = useMemo(
    () => getDateRangeForPeriod(periodKey, new Date()),
    [periodKey]
  );

  const calendarStart = Math.min(
    startNum,
    toDateNum(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1))
  );
  const calendarEnd = Math.max(
    endNum,
    toDateNum(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0))
  );

  const { data, isLoading, error } = db.useQuery({
    medications: {
      intakeLogs: {
        $: {
          where: {
            date: { $gte: calendarStart, $lte: calendarEnd },
          },
        },
      },
    },
  });

  const { chartData, overallRate, perMedication, takenDates, expectedDates } =
    useMemo(() => {
      const meds = data?.medications ?? [];
      const allLogs: Array<{ medicationId: string; date: number; timing: string }> = [];
      let totalExpected = 0;
      let totalActual = 0;
      const byDay = new Map<number, { expected: number; actual: number }>();

      const startDate = fromDateNum(startNum);
      const endDate = fromDateNum(endNum);
      const calStartDate = fromDateNum(calendarStart);
      const calEndDate = fromDateNum(calendarEnd);

      for (let d = new Date(startDate); d <= endDate; d = addDays(d, 1)) {
        const dayNum = toDateNum(d);
        let dayExpected = 0;
        let dayActual = 0;

        for (const med of meds) {
          if (med.startDate > dayNum) continue;
          let timings: string[] = [];
          try {
            timings = JSON.parse(med.timings || "[]");
          } catch {
            continue;
          }
          const count = timings.length;
          dayExpected += count;
          totalExpected += count;

          const logsForMed = med.intakeLogs?.filter((l) => l.date === dayNum) ?? [];
          dayActual += logsForMed.length;
          totalActual += logsForMed.length;

          for (const log of logsForMed) {
            allLogs.push({ medicationId: med.id, date: dayNum, timing: log.timing });
          }
        }
        byDay.set(dayNum, { expected: dayExpected, actual: dayActual });
      }

      const chartData = Array.from(byDay.entries())
        .sort(([a], [b]) => a - b)
        .map(([dateNum, { expected, actual }]) => ({
          date: String(dateNum),
          rate: expected > 0 ? Math.round((actual / expected) * 100) : 0,
          label: format(fromDateNum(dateNum), "M/d"),
        }));

      const overallRate =
        totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;

      const perMedication = meds.map((med) => {
        let expected = 0;
        let actual = 0;
        for (let d = new Date(startDate); d <= endDate; d = addDays(d, 1)) {
          const dayNum = toDateNum(d);
          if (med.startDate > dayNum) continue;
          let timings: string[] = [];
          try {
            timings = JSON.parse(med.timings || "[]");
          } catch {
            continue;
          }
          expected += timings.length;
          const logs = med.intakeLogs?.filter((l) => l.date === dayNum) ?? [];
          actual += logs.length;
        }
        return {
          name: med.name,
          rate: expected > 0 ? Math.round((actual / expected) * 100) : 0,
        };
      });

      const takenDates = new Set(
        allLogs
          .reduce<number[]>((acc, l) => {
            if (!acc.includes(l.date)) acc.push(l.date);
            return acc;
          }, [])
          .sort()
      );

      const expectedDates = new Set<number>();
      for (let d = new Date(calStartDate); d <= calEndDate; d = addDays(d, 1)) {
        const dayNum = toDateNum(d);
        let dayExpected = 0;
        for (const med of meds) {
          if (med.startDate > dayNum) continue;
          try {
            const timings = JSON.parse(med.timings || "[]");
            dayExpected += timings.length;
          } catch {
            // skip
          }
        }
        if (dayExpected > 0) expectedDates.add(dayNum);
      }

      return {
        chartData,
        overallRate,
        perMedication,
        takenDates,
        expectedDates,
      };
    }, [data, startNum, endNum, calendarStart, calendarEnd]);

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
    <div className="mx-auto max-w-lg px-4 pb-8">
      <header className="border-b border-border py-6">
        <h1 className="text-2xl font-light tracking-tight" style={{ color: "var(--foreground)" }}>
          服用履歴
        </h1>
      </header>

      <div className="mt-6">
        <p className="mb-2 font-mono text-xs" style={{ color: "var(--muted)" }}>
          期間
        </p>
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriodKey(p.key)}
              className="rounded px-3 py-1.5 text-sm font-mono"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: periodKey === p.key ? "var(--accent)" : "transparent",
                color: periodKey === p.key ? "var(--background)" : "var(--foreground)",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-6">
        <h2 className="mb-2 font-mono text-sm" style={{ color: "var(--muted)" }}>
          達成率
        </h2>
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-3xl font-light" style={{ color: "var(--foreground)" }}>
            {overallRate}%
          </span>
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            全体
          </span>
        </div>
        <AdherenceChart data={chartData} />
      </section>

      {perMedication.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 font-mono text-sm" style={{ color: "var(--muted)" }}>
            薬ごと
          </h2>
          <ul className="space-y-2">
            {perMedication.map((m) => (
              <li
                key={m.name}
                className="flex justify-between border-b border-border py-2"
              >
                <span style={{ color: "var(--foreground)" }}>{m.name}</span>
                <span className="font-mono" style={{ color: "var(--accent)" }}>
                  {m.rate}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className="mb-2 font-mono text-sm" style={{ color: "var(--muted)" }}>
          カレンダー
        </h2>
        <CalendarView
          yearMonth={calendarMonth}
          takenDates={takenDates}
          expectedDates={expectedDates}
          onPrevMonth={() =>
            setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))
          }
          onNextMonth={() =>
            setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))
          }
        />
      </section>
    </div>
  );
}
