"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateUnitsSold({
  productId,
  currentUnits,
}: {
  productId: string;
  currentUnits: number;
}) {
  const [newUnits, setNewUnits] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newUnits <= 0) {
      alert("Enter units greater than 0");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/products/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        quantity: newUnits,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Failed to update sales");
      return;
    }

    setNewUnits(0);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 border-t border-yellow-500/30 pt-6">
      <h3 className="text-yellow-400 font-semibold mb-3">
        Add Units Sold
      </h3>

      <div className="flex items-center gap-4">
        <input
          type="number"
          min={1}
          value={newUnits}
          onChange={(e) => setNewUnits(Number(e.target.value))}
          className="w-32 rounded-md px-3 py-2
                     bg-zinc-900 text-neutral-100
                     border border-yellow-500/30
                     focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Units"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-md font-semibold
                     bg-yellow-500 text-black
                     hover:bg-yellow-400
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </div>

      <p className="text-sm text-neutral-400 mt-3">
        Current units sold:{" "}
        <span className="font-semibold text-yellow-400">
          {currentUnits}
        </span>
      </p>
    </form>
  );
}
