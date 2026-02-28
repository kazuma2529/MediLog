import { format, addDays, startOfDay, isToday, isSameDay } from "date-fns";
import { ja } from "date-fns/locale";

export const TIMINGS = [
  { key: "morning", label: "朝", hours: [6, 10] },
  { key: "noon", label: "昼", hours: [11, 14] },
  { key: "evening", label: "夜", hours: [17, 21] },
  { key: "bedtime", label: "就寝前", hours: [21, 24] },
] as const;

export type TimingKey = (typeof TIMINGS)[number]["key"];

export function getTimingKeyForHour(hour: number): TimingKey {
  if (hour >= 6 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "noon";
  if (hour >= 17 && hour < 21) return "evening";
  return "bedtime";
}

export function getCurrentTimingKey(): TimingKey {
  return getTimingKeyForHour(new Date().getHours());
}

/** YYYYMMDD number */
export function toDateNum(d: Date): number {
  return parseInt(format(d, "yyyyMMdd"), 10);
}

/** Parse YYYYMMDD to Date */
export function fromDateNum(n: number): Date {
  const s = String(n);
  const y = parseInt(s.slice(0, 4), 10);
  const m = parseInt(s.slice(4, 6), 10) - 1;
  const d = parseInt(s.slice(6, 8), 10);
  return new Date(y, m, d);
}

export function todayNum(): number {
  return toDateNum(new Date());
}

export function formatDateJa(d: Date): string {
  return format(d, "M月d日(E)", { locale: ja });
}

export function isSameDateNum(a: number, b: number): boolean {
  return a === b;
}

export const PERIODS = [
  { key: "1w", label: "1週間", days: 7 },
  { key: "1m", label: "1ヶ月", days: 30 },
  { key: "3m", label: "3ヶ月", days: 90 },
  { key: "6m", label: "6ヶ月", days: 180 },
  { key: "1y", label: "1年", days: 365 },
  { key: "all", label: "全期間", days: 0 },
] as const;

export function getDateRangeForPeriod(
  periodKey: string,
  refDate: Date,
  minStartNum?: number
): { startNum: number; endNum: number } {
  const endNum = toDateNum(refDate);
  const period = PERIODS.find((p) => p.key === periodKey) ?? PERIODS[0];

  if (period.key === "all") {
    const startNumAll = minStartNum ?? 20200101;
    return { startNum: Math.min(startNumAll, endNum), endNum };
  }

  const days = period.days || 30;
  const startDate = addDays(refDate, -days);
  const startNum = toDateNum(startDate);
  return { startNum, endNum };
}

export function differenceInDays(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

export { format, addDays, startOfDay, isToday, isSameDay };
