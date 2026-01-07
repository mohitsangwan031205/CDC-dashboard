import Image from "next/image";
import Link from "next/link";
import UpdateUnitsSold from "@/components/UpdateUnitsSold";
import { getProductById } from "@/lib/products";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
export const dynamic = "force-dynamic";

/* =======================
   Types (Schema-aligned)
======================= */
function StatCard({
  label,
  value,
  danger = false,
  status = false,
}: {
  label: string;
  value: any;
  danger?: boolean;
  status?: boolean;
}) {
  return (
    <div className="bg-zinc-900 border border-yellow-500/30 rounded-lg p-4">
      <p className="text-xs text-yellow-400 mb-1">{label}</p>
      <p
        className={`text-lg font-semibold ${
          danger
            ? "text-red-500"
            : status && value === "inactive"
            ? "text-red-400"
            : status && value === "active"
            ? "text-green-400"
            : "text-neutral-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}


type Sale = {
  _id: string;
  date: string;
  quantity: number;
  priceAtSale: number;
};

type Product = {
  _id: string;
  title: string;
  summary?: string;
  department: string;
  unitPrice: number;
  quantityAvailable: number;
  status: "active" | "inactive";
  unitsSold?: number;
  images?: string[];
  sales?: Sale[];
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = (await getProductById(id)) as Product;

  const revenue =
    (product.unitsSold ?? 0) * (product.unitPrice ?? 0);

  return (
    <div className="relative min-h-screen px-4 py-10 text-yellow-400">
  {/* Background */}
  <div
    className="fixed inset-0 -z-10"
    style={{
      backgroundColor: "#262323",
      
    }}
  />

  <div className="mx-auto max-w-6xl space-y-8">
    {/* Header */}
    <div className="flex justify-between items-center">
<h1 className="text-3xl font-bold">
  {product.title}
  <span className="ml-3 text-sm font-medium text-yellow-300">
    ({product.department})
  </span>
</h1>
      <Link href="/products" className="hover:text-yellow-200">
        ← Back
      </Link>
    </div>

    {/* Top Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Image */}
      <div className="md:col-span-1 border border-yellow-500/30 rounded-xl overflow-hidden">
        <div className="relative h-72">
          <Image
            src={product.images?.[0] || "/profile.jpg"}
            alt={product.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="md:col-span-2 grid grid-cols-2 gap-4">
        <StatCard label="Summary" value={product.summary} />
        <StatCard label="Unit Price" value={`₹${product.unitPrice}`} />
        <StatCard
          label="Quantity Available"
          value={product.quantityAvailable}
          danger={product.quantityAvailable <= 5}
        />
        <StatCard label="Units Sold" value={product.unitsSold ?? 0} />
        <StatCard
          label="Status"
          value={product.status}
          status
        />
        <StatCard
          label="Total Revenue"
          value={`₹${revenue.toLocaleString("en-IN")}`}
        />
      </div>
    </div>

    {/* Summary + Actions */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Summary */}
<div className="md:col-span-2 bg-black border border-yellow-500/30 rounded-xl p-6">
      <h2 className="font-semibold mb-4">Sales History</h2>

      <table className="w-full text-sm border border-yellow-500/30">
        <thead>
          <tr className="bg-yellow-400 text-black">
            <th className="p-2">Date</th>
            <th className="p-2">Units</th>
            <th className="p-2">Price</th>
            <th className="p-2">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {product.sales?.length ? (
            product.sales.map((sale) => (
              <tr
                key={sale._id}
                className="border-t border-yellow-500/20 text-center"
              >
                <td className="p-2">
                  {new Date(sale.date).toLocaleDateString()}
                </td>
                <td className="p-2">{sale.quantity}</td>
                <td className="p-2">₹{sale.priceAtSale}</td>
                <td className="p-2">
                  ₹{sale.quantity * sale.priceAtSale}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-3 text-center text-neutral-500">
                No sales recorded
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <UpdateUnitsSold
          productId={product._id}
          currentUnits={product.unitsSold ?? 0}
        />

        <Link
          href={`/products/edit/${product._id}`}
          className="text-center px-4 py-2 bg-yellow-500 text-black rounded-md font-semibold hover:bg-yellow-400"
        >
          Edit Product
        </Link>

        <Link
          href="/"
          className="text-center px-4 py-2 border border-yellow-500 text-yellow-400 rounded-md hover:bg-yellow-500 hover:text-black transition"
        >
          Dashboard
        </Link>
      </div>
    </div>

    {/* Sales History */}
    
  </div>
</div>

  );
}
