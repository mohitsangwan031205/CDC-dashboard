import ProductTable from "@/components/ProductTable";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      {/* ===== Container ===== */}
      <div className="mx-auto max-w-7xl">
        {/* ===== Header Card ===== */}
        <div className="mb-8 rounded-xl border border-yellow-500/30 bg-zinc-950 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400">
                Products
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Manage your inventory and product details
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/products/new"
                className="px-5 py-2 rounded-md bg-yellow-400 text-black
                           font-semibold hover:bg-yellow-300 transition
                           active:scale-95"
              >
                + Add Product
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* ===== Table Section ===== */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <ProductTable products={products} />
        </div>

        {/* ===== Footer Navigation ===== */}
        <div className="mt-6 flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm
                       text-zinc-400 hover:text-yellow-400 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
