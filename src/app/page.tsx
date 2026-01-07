import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getDashboardStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="relative min-h-screen p-8 bg-black text-white font-sans">
      {/* Background Grid */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundColor: "#000",
          backgroundImage: `
            linear-gradient(to right, rgba(234,179,8,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(234,179,8,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "8rem 8rem",
        }}
      />

      {/* Header Card */}
      <div className="mb-10 bg-zinc-900 border border-yellow-500/30 rounded-xl p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-yellow-400">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Centralized overview for product and inventory operations
          </p>
        </div>
        <LogoutButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="Categories" value={stats.totalCategories} />
        <StatCard title="Low Stock Alerts" value={stats.lowStock} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/products"
          className="px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold tracking-wide
                     hover:bg-yellow-300 transition active:scale-95"
        >
          Manage Products
        </Link>

        <Link
          href="/analytics"
          className="px-6 py-3 rounded-lg border border-zinc-600 text-white font-medium tracking-wide
                     hover:border-yellow-400 hover:text-yellow-400 transition"
        >
          View Analytics
        </Link>
      </div>
    </div>
  );
}

/* =======================
   Stat Card
======================= */
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center shadow-md">
      <div className="text-xs uppercase tracking-widest text-zinc-400">
        {title}
      </div>
      <div className="mt-4 text-5xl font-extrabold tracking-tight text-yellow-400">
        {value}
      </div>
    </div>
  );
}
