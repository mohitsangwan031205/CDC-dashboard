/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";

const CATEGORY_OPTIONS = [
  { value: "clothes", label: "Clothes" },
  { value: "stationary", label: "Stationary" },
  { value: "shoes", label: "Shoes" },
  { value: "sports", label: "Sports" },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  /* 🔹 SCHEMA-ALIGNED FORM */
  const [form, setForm] = useState({
    title: "",
    summary: "",
    unitPrice: 0,
    department: "",
    quantityAvailable: 0,
    status: "active" as "active" | "inactive",
  });

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products?id=${id}`);
        if (!res.ok) return;

        const data = await res.json();

        setForm({
          title: data.title ?? "",
          summary: data.summary ?? "",
          unitPrice: data.unitPrice ?? 0,
          department: data.department ?? "",
          quantityAvailable: data.quantityAvailable ?? 0,
          status: data.status ?? "active",
        });

        setImages(Array.isArray(data.images) ? data.images : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProduct();
  }, [id]);

  /* ---------------- SUBMIT ---------------- */
  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        ...form,
        images: images, // ✅ must match schema
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Update failed:", data);
      alert(data.error || "Update failed");
      return;
    }

    router.push("/products");
  } catch (err) {
    console.error(err);
  }
}


  if (loading) {
    return <p className="p-6 text-zinc-400">Loading...</p>;
  }

  return (
    <div className="min-h-screen px-6 py-12 text-yellow-400">
      {/* Background */}
      <div
  className="fixed inset-0 -z-10"
  style={{
    backgroundColor: "#000",
    backgroundImage: `
      linear-gradient(to right, rgba(234,179,8,0.15) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(234,179,8,0.15) 1px, transparent 1px)
    `,
    backgroundSize: "10rem 8rem",
  }}
/>


      {/* Card */}
      <div className="mx-auto max-w-2xl bg-black border border-yellow-500 rounded-xl p-8 shadow-lg shadow-yellow-500/10">
        <h1 className="text-2xl font-bold mb-8 text-white">
          Edit Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-1 text-white">
              Product Title
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-neutral-500 text-neutral-100 focus:ring-2 focus:ring-neutral-400 outline-none"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block mb-1 text-white">
              Summary
            </label>
            <textarea
              rows={4}
              value={form.summary}
              onChange={(e) =>
                setForm({ ...form, summary: e.target.value })
              }
              className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-neutral-500 text-neutral-100 focus:ring-2 focus:ring-neutral-400 outline-none"
            />
          </div>

          {/* Unit Price */}
          <div>
            <label className="block mb-1 text-white">
              Unit Price (₹)
            </label>
            <input
              type="number"
              value={form.unitPrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  unitPrice: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-neutral-500 text-neutral-100 focus:ring-2 focus:ring-neutral-400 outline-none"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block mb-1 text-white">
              Department
            </label>
            <select
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
              className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-neutral-500 text-neutral-100 focus:ring-2 focus:ring-neutral-400 outline-none"
            >
              <option value="" disabled>
                Select department
              </option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block mb-1 text-white">
              Quantity Available
            </label>
            <input
              type="number"
              value={form.quantityAvailable}
              onChange={(e) =>
                setForm({
                  ...form,
                  quantityAvailable: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-neutral-500 text-neutral-100 focus:ring-2 focus:ring-neutral-400 outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 text-white">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as
                    | "active"
                    | "inactive",
                })
              }
              className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-yellow-500 text-yellow-200"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Images */}
          <div>
            <label className="block mb-2 text-white">
              Product Images
            </label>
            <ImageUpload value={images} onChange={setImages} />
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Link
              href="/products"
              className="text-yellow-400 hover:text-yellow-200"
            >
              ← Back to Products
            </Link>
            <button
              type="submit"
              className="bg-yellow-500 text-black px-6 py-2 rounded-md font-medium hover:bg-yellow-400"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
