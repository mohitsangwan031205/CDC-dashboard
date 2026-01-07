export const dynamic = "force-dynamic";

import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import { getAllProductsForAnalytics } from "@/lib/products";

export default async function AnalyticsPage() {
  const rawProducts = await getAllProductsForAnalytics();

  const products = rawProducts.map((p) => ({
    ...p,
    inventoryValue: p.unitPrice * p.quantityAvailable,
  }));

  const lastUpdated = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-100">
              Analytics
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Inventory distribution, valuation & stock insights
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              Last updated: {lastUpdated}
            </p>
          </div>

          <LogoutButton />
        </div>

        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex text-sm text-zinc-400 hover:text-amber-400 transition"
        >
          ← Back to Dashboard
        </Link>

        {/* Analytics Layout */}
        {products.length > 0 ? (
          <div
            className="
              grid grid-cols-1 md:grid-cols-2 gap-6
              [&>*:first-child]:md:col-span-2
            "
          >
            <AnalyticsCharts products={products} />
          </div>
        ) : (
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-10 text-center text-zinc-400">
            No inventory data available.
          </div>
        )}
      </div>
    </div>
  );
}
