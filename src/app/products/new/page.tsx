/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";

/* -------------------- */
/* Zod Schema */
/* -------------------- */
const CATEGORY_OPTIONS = [
  { value: "electronic", label: "Electronic" },
  { value: "clothing", label: "Clothing" },
  { value: "stationary", label: "Stationary" },
  { value: "bath essential", label: "Bath Essential" },
  { value: "beauty", label: "Beauty" },
];

const productFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  summary: z.string().min(5, "Summary must be at least 5 characters"),
  unitPrice: z.number().min(0, "Price must be positive"),
  department: z.string().min(1, "Department is required"),
  quantityAvailable: z.number().min(0, "Quantity must be positive"),
  status: z.enum(["active", "inactive"]),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      unitPrice: 0,
      quantityAvailable: 0,
      status: "active",
    },
  });

  async function onSubmit(values: ProductFormValues) {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        images,
      }),
    });

    router.push("/products");
  }

  return (
    <div className="min-h-screen px-6 py-12 text-yellow-400">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
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
        <h1 className="text-2xl font-bold mb-8">Add New Product</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* -------- STEP 1 -------- */}
          {step === 1 && (
            <>
              <div>
                <label className="block mb-1 text-white">Product Title</label>
                <input
                  {...register("title")}
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-neutral-500 text-neutral-100"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-white">Summary</label>
                <textarea
                  rows={4}
                  {...register("summary")}
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-neutral-500 text-neutral-100"
                />
                {errors.summary && (
                  <p className="text-red-500 text-sm">{errors.summary.message}</p>
                )}
              </div>

              <div className="flex justify-between">
                <Link href="/products" className="text-yellow-400">
                  ← Back
                </Link>

                <button
                  type="button"
                  onClick={async () => {
                    if (await trigger(["title", "summary"])) setStep(2);
                  }}
                  className="bg-yellow-500 text-black px-5 py-2 rounded-md"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* -------- STEP 2 -------- */}
          {step === 2 && (
            <>
              <div>
                <label className="block mb-1 text-white">Unit Price (₹)</label>
                <input
                  type="number"
                  {...register("unitPrice", { valueAsNumber: true })}
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-neutral-500 text-neutral-100"
                />
                {errors.unitPrice && (
                  <p className="text-red-500 text-sm">{errors.unitPrice.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-white">Department</label>
                <select
                  {...register("department")}
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-neutral-500 text-neutral-100"
                >
                  <option value="">Select department</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-white">Quantity Available</label>
                <input
                  type="number"
                  {...register("quantityAvailable", { valueAsNumber: true })}
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-neutral-500 text-neutral-100"
                />
                {errors.quantityAvailable && (
                  <p className="text-red-500 text-sm">
                    {errors.quantityAvailable.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-yellow-500 px-4 py-2 rounded-md"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (
                      await trigger([
                        "unitPrice",
                        "department",
                        "quantityAvailable",
                      ])
                    )
                      setStep(3);
                  }}
                  className="bg-yellow-500 text-black px-5 py-2 rounded-md"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* -------- STEP 3 -------- */}
          {step === 3 && (
            <>
              <div>
                <label className="block mb-2 text-white">Product Images</label>
                <ImageUpload
                  value={images}
                  onChange={(urls) => {
                    setImages(urls);
                    setIsUploading(false);
                  }}
                />
              </div>

              <div>
                <label className="block mb-2 text-white">Status</label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-yellow-500 text-yellow-200"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="border border-yellow-500 px-4 py-2 rounded-md"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isUploading || images.length === 0}
                  className="bg-yellow-500 text-black px-6 py-2 rounded-md disabled:opacity-50"
                >
                  {isUploading ? "Uploading image..." : "Create Product"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
