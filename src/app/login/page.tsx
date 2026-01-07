"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Invalid credentials");
      return;
    }

    router.replace("/");
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-black text-white">
      
      {/* LEFT PANEL – BRANDING */}
      <div className="relative hidden md:flex flex-col justify-center px-16">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-transparent" />

        <h1 className="relative text-4xl font-extrabold text-yellow-400 mb-4">
          Yhills
        </h1>
        <p className="relative text-lg text-zinc-300 max-w-sm">
          Secure Admin Portal for managing internal systems and operations.
        </p>

        <div className="relative mt-10 h-[2px] w-24 bg-yellow-400" />
      </div>

      {/* RIGHT PANEL – LOGIN */}
      <div className="flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-zinc-900 rounded-2xl p-8 border border-yellow-500/30 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-yellow-400 mb-1">
            Admin Login
          </h2>
          <p className="text-sm text-zinc-400 mb-6">
            Enter your credentials to continue
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-black text-white border border-zinc-700
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-black text-white border border-zinc-700
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button
            disabled={loading}
            className="mt-6 w-full py-2 rounded-lg bg-yellow-400 text-black font-semibold
                       hover:bg-yellow-300 transition active:scale-95 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-xs text-center text-zinc-500">
            © {new Date().getFullYear()} Yhills Pvt. Limited
          </p>
        </form>
      </div>
    </div>
  );
}
