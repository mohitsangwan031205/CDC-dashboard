/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  async function handleUpload(file: File) {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      onChange([...value, data.secure_url]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  function removeImage(url: string) {
    onChange(value.filter((img) => img !== url));
  }

  return (
    <div className="space-y-3">
      {/* Upload Button */}
      <label className="cursor-pointer text-blue-600 underline">
        Choose image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleUpload(e.target.files[0]);
            }
          }}
        />
      </label>

      {/* Loading */}
      {loading && <p className="text-sm text-gray-500">Uploading...</p>}

      {/* Previews */}
      <div className="flex gap-2 flex-wrap">
        {value.map((img) => (
          <div
            key={img}
            className="relative w-[80px] h-[90px] border rounded overflow-hidden"
          >
            <img
              src={img}
              className="w-full h-full object-cover"
              alt="preview"
            />
            <button
              type="button"
              onClick={() => removeImage(img)}
              className="absolute top-0 right-0 bg-black text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
