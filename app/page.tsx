"use client";

import Link from "next/link";
import { useState } from "react";

const services = [
  { icon: "🔧", name: "Plumber", description: "Pipes, taps & water repairs" },
  { icon: "⚡", name: "Electrician", description: "Wiring, switches & repairs" },
  { icon: "🪓", name: "Carpenter", description: "Furniture & woodwork" },
  { icon: "🔨", name: "Mechanic", description: "Vehicle repair & service" },
  { icon: "❄️", name: "AC Repair", description: "AC service & installation" },
  { icon: "🎨", name: "Painter", description: "Home & office painting" },
];

const features = [
  {
    icon: "✓",
    title: "Verified Professionals",
    description:
      "Find skilled professionals with verified profiles and real customer reviews.",
  },
  {
    icon: "⚡",
    title: "On-Demand Service",
    description:
      "Book a professional whenever you need help. No appointment slot required.",
  },
  {
    icon: "📍",
    title: "Around 30-Minute Target",
    description:
      "Connect with a nearby professional with an estimated arrival target of around 30 minutes.",
  },
];

export default function Home() {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#111827]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-2xl font-bold tracking-tight">
            Kari<span className="text-[#10B981]">gro</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#services"
              className="text-sm text-gray-600 hover:text-[#10B981]"
            >
              Services
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-gray-600 hover:text-[#10B981]"
            >
              How it works
            </a>

            <a
              href="#about"
              className="text-sm text-gray-600 hover:text-[#10B981]"
            >
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden px-4 py-2 text-sm font-medium text-[#111827] hover:text-[#10B981] sm:block"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-[#10B981] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#059669]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-[#059669]">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              Skilled professionals, when you need them
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Skilled professionals,
              <br />
              <span className="text-[#10B981]">when you need them.</span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              Book a trusted professional for your home service and get help at your location in minutes.
            </p>

            {/* Search Box */}
            <div className="mt-10 flex max-w-3xl flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg md:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-xl">🔍</span>

                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="What service do you need?"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-1 items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-xl">📍</span>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>

              <button
                onClick={() => {
                  const params = new URLSearchParams();

                  if (service.trim()) {
                    params.set("search", service.trim());
                  }

                  if (location.trim()) {
                    params.set("city", location.trim());
                  }

                  window.location.href = `/workers?${params.toString()}`;
                }}
                className="rounded-xl bg-[#10B981] px-7 py-3 font-semibold text-white transition hover:bg-[#059669]"
              >
                Find a Worker
              </button>
            </div>

            {/* Trust Points */}
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#059669]">
                  ✓
                </span>
                Verified professionals
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#059669]">
                  ✓
                </span>
                On-demand service
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#059669]">
                  ✓
                </span>
                Around 30-minute target
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Shape */}
        <div className="pointer-events-none absolute -right-32 -top-32 hidden h-96 w-96 rounded-full bg-emerald-100 opacity-60 blur-3xl md:block" />
      </section>

      {/* Services */}
      <section id="services" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="font-semibold text-[#10B981]">SERVICES</p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              What do you need help with?
            </h2>

            <p className="mt-3 text-gray-600">
              Get skilled help for your everyday service needs.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.name}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  {service.icon}
                </div>

                <h3 className="text-lg font-semibold">{service.name}</h3>

                <p className="mt-2 text-sm text-gray-500">
                  {service.description}
                </p>

                <Link
                  href={`/workers?search=${encodeURIComponent(service.name)}`}
                  className="mt-5 inline-block text-sm font-semibold text-[#059669]"
                >
                  Book a service →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-[#111827] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="font-semibold text-[#10B981]">HOW IT WORKS</p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Get help when you need it.
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              Karigro makes it simple to request a skilled professional for
              your immediate service needs.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              [
                "01",
                "Tell us what you need",
                "Choose a service and describe the problem you need help with.",
              ],
              [
                "02",
                "Share your location",
                "Enter the location where you want the professional to come.",
              ],
              [
                "03",
                "Get help at your location",
                "A nearby professional accepts your request and comes to you, with an estimated arrival target of around 30 minutes.",
              ],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="border-t border-gray-700 pt-6"
              >
                <span className="text-3xl font-bold text-[#10B981]">
                  {number}
                </span>

                <h3 className="mt-5 text-xl font-semibold">{title}</h3>

                <p className="mt-3 leading-7 text-gray-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981] font-bold text-white">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#10B981] px-8 py-16 text-center md:px-16">
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            Need a skilled professional?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-emerald-50">
            Tell us what you need, share your location, and get connected with
            a skilled professional for your service.
          </p>

          <Link
            href="/workers"
            className="mt-8 inline-block rounded-xl bg-[#111827] px-7 py-3.5 font-semibold text-white transition hover:bg-[#1F2937]"
          >
            Find a Professional
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 md:flex-row md:items-center">
          <div className="text-xl font-bold">
            Kari<span className="text-[#10B981]">gro</span>
          </div>

          <p className="text-sm text-gray-500">
            © 2026 Karigro. Connecting customers with skilled professionals.
          </p>
        </div>
      </footer>
    </main>
  );
}