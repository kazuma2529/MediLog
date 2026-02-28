"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type DataPoint = {
  date: string;
  rate: number;
  label: string;
};

type AdherenceChartProps = {
  data: DataPoint[];
};

export function AdherenceChart({ data }: AdherenceChartProps) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "var(--muted)" }}
            stroke="var(--border)"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "var(--muted)" }}
            stroke="var(--border)"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
            }}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="var(--accent)"
            strokeWidth={1.5}
            dot={{ fill: "var(--accent)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
