"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<"CUSTOMER" | "WORKER">("CUSTOMER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess("Account created successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-6 py-12 text-[#111827]">
      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="mb-8 text-center">
          <a
            href="/"
            className="text-3xl font-bold tracking-tight text-[#111827]"
          >
            Kari<span className="text-[#10B981]">gro</span>
          </a>

          <h1 className="mt-6 text-2xl font-bold text-[#111827]">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-[#6B7280]">
            Join Karigro and get started.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-8">

          {/* Role Selection */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-semibold text-[#111827]">
              I want to
            </label>

            <div className="grid grid-cols-2 gap-3">

              {/* Customer */}
              <button
                type="button"
                onClick={() => setRole("CUSTOMER")}
                className={`rounded-xl border p-4 text-left transition ${
                  role === "CUSTOMER"
                    ? "border-[#10B981] bg-emerald-50"
                    : "border-[#E5E7EB] bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-2xl">👤</div>

                <div className="mt-2 font-semibold text-[#111827]">
                  Hire a Worker
                </div>

                <div className="mt-1 text-xs text-[#6B7280]">
                  I need a service
                </div>
              </button>

              {/* Worker */}
              <button
                type="button"
                onClick={() => setRole("WORKER")}
                className={`rounded-xl border p-4 text-left transition ${
                  role === "WORKER"
                    ? "border-[#10B981] bg-emerald-50"
                    : "border-[#E5E7EB] bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-2xl">🛠️</div>

                <div className="mt-2 font-semibold text-[#111827]">
                  Offer Services
                </div>

                <div className="mt-1 text-xs text-[#6B7280]">
                  I am a professional
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                Full name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                Phone number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                Password
              </label>

              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#10B981] py-3.5 font-semibold text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-[#6B7280]">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-[#059669] hover:underline"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}