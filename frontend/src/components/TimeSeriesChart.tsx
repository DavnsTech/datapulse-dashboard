import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import type { TimeSeriesPoint } from "../api/metrics";

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  chartType: string;
  color?: string;
}

const GRID_STROKE = "#1e2333";
const AXIS_TICK = { fill: "#555b73", fontSize: 11, fontFamily: '"JetBrains Mono", monospace' };

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#12151e",
    border: "1px solid #2a2f42",
    borderRadius: 12,
    padding: "10px 14px",
    boxShadow: "0 16px 48px -8px rgba(0,0,0,0.5)",
  },
  labelStyle: { color: "#8a90a5", fontSize: 11, fontFamily: '"JetBrains Mono", monospace' },
  itemStyle: { color: "#f0f2f7", fontSize: 12, fontFamily: '"JetBrains Mono", monospace' },
};

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

export default function TimeSeriesChart({
  data,
  chartType,
  color = "#00d4ff",
}: TimeSeriesChartProps) {
  const chartData = data.map((point) => ({
    time: formatTime(point.timestamp),
    value: Math.round(point.value * 100) / 100,
  }));

  const commonProps = {
    data: chartData,
    margin: { top: 8, right: 8, left: -12, bottom: 0 },
  };

  const gradientId = `ts-${color.replace("#", "")}`;

  if (chartType === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey="time" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: "rgba(0, 212, 255, 0.04)" }} />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey="time" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <Tooltip {...TOOLTIP_STYLE} cursor={{ stroke: "rgba(0, 212, 255, 0.15)" }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: color, stroke: "#06080d", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey="time" tick={AXIS_TICK} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP_STYLE} cursor={{ stroke: "rgba(0, 212, 255, 0.15)" }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 5, fill: color, stroke: "#06080d", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
