/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ================= CONSTANTS ================= */

const PAGE_SIZE = 5;

const CATEGORY_OPTIONS = [
  { value: "clothes", label: "Clothes" },
  { value: "stationary", label: "Stationary" },
  { value: "shoes", label: "Shoes" },
  { value: "sports", label: "Sports" },
];

/* ================= TYPES ================= */

interface Product {
  title: string;
  _id: string;
  department: string;
  unitPrice: number;
  quantityAvailable: number;
  unitsSold?: number;
  images?: string[];
  updatedAt: string;
}

type SortOption =
  | ""
  | "price-asc"
  | "price-desc"
  | "stock-asc"
  | "stock-desc";

/* ================= COMPONENT ================= */

export default function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("");
  const [page, setPage] = useState(1);

  /* ================= DELETE ================= */

  async function handleDelete(e: React.MouseEvent, productId: string) {
    e.stopPropagation();

    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const res = await fetch(`/api/products?id=${productId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete product");
      return;
    }

    router.refresh();
  }

  /* ================= FILTER + SORT ================= */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
  const s = search.toLowerCase();
  result = result.filter(
    (p) =>
      p.title.toLowerCase().includes(s) ||
      p.department.toLowerCase().includes(s)
  );
}


    if (category !== "all") {
      result = result.filter((p) => p.department === category);
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.unitPrice - b.unitPrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.unitPrice - a.unitPrice);
        break;
      case "stock-asc":
        result.sort((a, b) => a.quantityAvailable - b.quantityAvailable);
        break;
      case "stock-desc":
        result.sort((a, b) => b.quantityAvailable - a.quantityAvailable);
        break;
    }

    return result;
  }, [products, search, category, sort]);

  /* ================= RESET PAGE ================= */

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= RENDER ================= */

 return (
  <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl shadow-lg">
    {/* ===== Controls ===== */}
    <div className="flex flex-wrap gap-4 mb-6 items-center justify-self-end">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-black border border-zinc-700 text-white placeholder-zinc-500
                   rounded-md px-4 py-2 focus:border-yellow-400 outline-none"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-black border border-zinc-700 text-white rounded-md px-4 py-2
                   focus:border-yellow-400 outline-none"
      >
        <option value="all">All Categories</option>
        {CATEGORY_OPTIONS.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as SortOption)}
        className="bg-black border border-zinc-700 text-white rounded-md px-4 py-2
                   focus:border-yellow-400 outline-none"
      >
        <option value="">Sort By</option>
        <option value="price-asc">Price ↑</option>
        <option value="price-desc">Price ↓</option>
        <option value="stock-asc">Stock ↑</option>
        <option value="stock-desc">Stock ↓</option>
      </select>
    </div>

    {/* ===== Table ===== */}
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full bg-zinc-950 text-sm">
        <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs">
          <tr>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-center">Price</th>
            <th className="p-4 text-center">Stock</th>
            <th className="p-4 text-center">Units Sold</th>
            <th className="p-4 text-center">Revenue</th>
            <th className="p-4 text-center">Updated</th>
            <th className="p-4"></th>
          </tr>
        </thead>

        <tbody>
          {paginatedProducts.map((product) => {
            const revenue = (product.unitsSold ?? 0) * product.unitPrice;

            return (
              <tr
                key={product._id}
                onClick={() => router.push(`/products/${product._id}`)}
                className="border-b border-zinc-800 hover:bg-zinc-900/60 cursor-pointer"
              >
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={product.images?.[0] || "/profile.jpg"}
                    className="w-12 h-12 rounded-md border border-zinc-700"
                    alt={product.title}
                  />
                  <div>
                    <p className="font-medium text-white">
                      {product.title}
                    </p>
                    <p className="text-xs text-zinc-400 capitalize">
                      {product.department}
                    </p>
                  </div>
                </td>

                <td className="p-4 text-center text-zinc-100">
                  ₹{product.unitPrice}
                </td>
<td
  className={`p-4 text-center ${
    product.quantityAvailable <= 5 ? "text-red-600" : "text-zinc-300"
  }`}
>
                  {product.quantityAvailable}
                </td>
                <td className="p-4 text-center text-zinc-300">
                  {product.unitsSold ?? 0}
                </td>
                <td className="p-4 text-center text-yellow-400 font-medium">
                  ₹{revenue.toLocaleString("en-IN")}
                </td>
                <td className="p-4 text-center text-zinc-500 text-xs">
                  {new Date(product.updatedAt).toLocaleDateString("en-IN")}
                </td>

                <td
                  className="p-4 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() =>
                        router.push(`/products/edit/${product._id}`)
                      }
                      className="px-3 py-1 rounded-md border border-zinc-700
                                 text-zinc-300 hover:border-yellow-400 hover:text-yellow-400 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => handleDelete(e, product._id)}
                      className="px-3 py-1 rounded-md bg-red-600/90 text-white
                                 hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {paginatedProducts.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-zinc-500"
              >
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* ===== Pagination ===== */}
    {totalPages > 1 && (
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-4 py-1.5 rounded-md border transition ${
                p === page
                  ? "bg-yellow-400 text-black border-yellow-300 font-semibold"
                  : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-yellow-400 hover:text-yellow-400"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>
    )}
  </div>
);

}
