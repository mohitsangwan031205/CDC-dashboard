"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

/* Muted amber + neutral palette */
const COLORS = ["#f59e0b", "#71717a", "#a1a1aa"];

export default function AnalyticsCharts({ products }: { products: any[] }) {
  /* ---------------- KPI METRICS (UNCHANGED) ---------------- */
  const totalRevenue = products.reduce(
    (sum, p) => sum + p.unitPrice * (p.unitsSold || 0),
    0
  );

  const totalUnitsSold = products.reduce(
    (sum, p) => sum + (p.unitsSold || 0),
    0
  );

  const inventoryValue = products.reduce(
    (sum, p) => sum + p.unitPrice * p.quantityAvailable,
    0
  );

  /* ---------------- CATEGORY STOCK ---------------- */
  const categoryStock = Object.values(
    products.reduce((acc: any, p) => {
      acc[p.department] ??= { category: p.department, stock: 0 };
      acc[p.department].stock += p.quantityAvailable;
      return acc;
    }, {})
  );

  /* ---------------- STOCK STATUS ---------------- */
  const stockStatus = [
    {
      name: "Healthy",
      value: products.filter((p) => p.quantityAvailable > 10).length,
    },
    {
      name: "Low",
      value: products.filter(
        (p) => p.quantityAvailable > 0 && p.quantityAvailable <= 10
      ).length,
    },
    {
      name: "Out",
      value: products.filter((p) => p.quantityAvailable === 0).length,
    },
  ];

  /* ---------------- SALES TREND ---------------- */
  const salesTrend = Object.values(
    products.reduce((acc: any, p) => {
      if (!p.createdAt) return acc;
      const date = new Date(p.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      acc[key] ??= {
        month: date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        revenue: 0,
        sortKey: date.getTime(),
      };
      acc[key].revenue += p.unitPrice * (p.unitsSold || 0);
      return acc;
    }, {})
  ).sort((a: any, b: any) => a.sortKey - b.sortKey);

  /* ---------------- TOP PRODUCTS ---------------- */
  const topProducts = [...products]
    .sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* ===== KPI CARDS (UNCHANGED STRUCTURE) ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Kpi
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
        />
        <Kpi title="Units Sold" value={totalUnitsSold} />
        <Kpi
          title="Inventory Value"
          value={`₹${inventoryValue.toLocaleString()}`}
        />
      </div>

      {/* ===== CHARTS ===== */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Revenue Trend – FULL WIDTH ON TOP */}
  <ChartCard title="Revenue Trend" full>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={salesTrend}>
        <XAxis dataKey="month" stroke="#a1a1aa" />
        <YAxis stroke="#a1a1aa" />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="revenue" stroke="#f59e0b" />
      </LineChart>
    </ResponsiveContainer>
  </ChartCard>

  {/* Inventory by Department */}
  <ChartCard title="Inventory by Department">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={categoryStock}>
        <XAxis dataKey="category" stroke="#a1a1aa" />
        <YAxis stroke="#a1a1aa" />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="stock" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>

  {/* Stock Health */}
  <ChartCard title="Stock Health">
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={stockStatus} dataKey="value" outerRadius={100}>
          {stockStatus.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip content={<PieTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  </ChartCard>
</div>

      {/* ===== TOP PRODUCTS ===== */}
      <ChartCard title="Top Selling Products">
        <ul className="space-y-3">
          {topProducts.map((p) => (
            <li
              key={p._id}
              className="flex justify-between text-sm text-zinc-300"
            >
              <span>{p.title}</span>
              <span className="font-medium">{p.unitsSold || 0} sold</span>
            </li>
          ))}
        </ul>
      </ChartCard>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function Kpi({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-5">
      <p className="text-xs text-zinc-400">{title}</p>
      <p className="text-2xl font-semibold text-zinc-100 mt-2">{value}</p>
    </div>
  );
}

function ChartCard({ title, children, full }: any) {
  return (
    <div
      className={`bg-[#161616] border border-[#2a2a2a] rounded-xl p-6 ${
        full ? "lg:col-span-2" : ""
      }`}
    >
      <h3 className="text-sm font-medium text-zinc-200 mb-4">{title}</h3>
      {children}
    </div>
  );
}
function PieTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-[#161616] border border-[#2a2a2a] text-white text-sm p-2 rounded shadow-lg">
      <p>{data.name}</p>
      <p className="font-medium">{data.value}</p>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "#161616",
  border: "1px solid #2a2a2a",
  color: "#e5e7eb",
};
