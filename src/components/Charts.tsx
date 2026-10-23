"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const GREEN = "#15803d";
const YELLOW = "#d97706";
const RED = "#b91c1c";

export function PortfolioDonut({ green, yellow, red }: { green: number; yellow: number; red: number }) {
  const data = [
    { name: "Saudável", value: green, fill: GREEN },
    { name: "Atenção", value: yellow, fill: YELLOW },
    { name: "Crítica", value: red, fill: RED },
  ];
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie isAnimationActive={false} data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {data.map((d) => <Cell key={d.name} fill={d.fill} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface TrendDatum { date: string; avgScore: number; green: number; yellow: number; red: number }

const shortDate = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

export function TrendChart({ data }: { data: TrendDatum[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip labelFormatter={(l) => `Semana de ${shortDate(String(l))}`} />
          <Legend />
          <Line isAnimationActive={false} type="monotone" dataKey="green" name="Saudáveis" stroke={GREEN} strokeWidth={2} dot={false} />
          <Line isAnimationActive={false} type="monotone" dataKey="yellow" name="Atenção" stroke={YELLOW} strokeWidth={2} dot={false} />
          <Line isAnimationActive={false} type="monotone" dataKey="red" name="Críticas" stroke={RED} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScoreSparkline({ data }: { data: { date: string; score: number }[] }) {
  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fontSize: 10 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip labelFormatter={(l) => `Semana de ${shortDate(String(l))}`} />
          <Line isAnimationActive={false} type="monotone" dataKey="score" name="Score" stroke="#0f172a" strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface SegmentDatum { segment: string; green: number; yellow: number; red: number }

export function SegmentChart({ data }: { data: SegmentDatum[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="segment" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar isAnimationActive={false} dataKey="green" name="Saudáveis" stackId="a" fill={GREEN} />
          <Bar isAnimationActive={false} dataKey="yellow" name="Atenção" stackId="a" fill={YELLOW} />
          <Bar isAnimationActive={false} dataKey="red" name="Críticas" stackId="a" fill={RED} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
