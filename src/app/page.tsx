import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getDashboardStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 border-r border-yellow-500/20 bg-zinc-950 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-yellow-400 mb-8">
          Admin Panel
        </h1>

        <nav className="flex flex-col gap-4 text-sm">
          <Link
            href="/"
            className="text-yellow-300 hover:text-yellow-400 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/products"
            className="text-zinc-400 hover:text-yellow-400 transition"
          >
            Products
          </Link>
          <Link
            href="/analytics"
            className="text-zinc-400 hover:text-yellow-400 transition"
          >
            Analytics
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-yellow-500/20">
          <LogoutButton />
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-10 space-y-10 relative">
        {/* Background Grid */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(234,179,8,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(234,179,8,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "10rem 10rem",
          }}
        />

        {/* Hero */}
        <section className="bg-zinc-900 border border-yellow-500/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-yellow-400">
            Welcome Back 👋
          </h2>
          <p className="mt-2 text-zinc-400 max-w-xl">
            Monitor inventory health, manage products, and track performance
            from one place.
          </p>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HorizontalStat
            title="Total Products"
            value={stats.totalProducts}
          />
          <HorizontalStat
            title="Categories"
            value={stats.totalCategories}
          />
          <HorizontalStat
            title="Low Stock Alerts"
            value={stats.lowStock}
            danger
          />
        </section>

        {/* Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            title="Manage Products"
            desc="Create, edit and update inventory items"
            href="/products"
            primary
          />
          <ActionCard
            title="View Analytics"
            desc="Track revenue, sales trends and stock health"
            href="/analytics"
          />
        </section>
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function HorizontalStat({
  title,
  value,
  danger = false,
}: {
  title: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-zinc-400">{title}</p>
        <p
          className={`text-3xl font-bold mt-1 ${
            danger ? "text-red-400" : "text-yellow-400"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  desc,
  href,
  primary = false,
}: {
  title: string;
  desc: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl p-8 border transition hover:scale-[1.02]
        ${
          primary
            ? "bg-yellow-400 text-black border-yellow-400"
            : "bg-zinc-900 border-zinc-700 text-white hover:border-yellow-400"
        }`}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p
        className={`mt-2 text-sm ${
          primary ? "text-black/80" : "text-zinc-400"
        }`}
      >
        {desc}
      </p>
    </Link>
  );
}

