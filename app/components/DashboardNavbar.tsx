"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DashboardNavbarProps = {
  userName: string;
  role: "CUSTOMER" | "WORKER";
};

export default function DashboardNavbar({
  userName,
  role,
}: DashboardNavbarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  }

  const customerLinks = [
    { name: "Dashboard", href: "/dashboard/customer" },
    { name: "Find Workers", href: "/workers" },
    { name: "My Bookings", href: "/bookings" },
    { name: "Messages", href: "/messages" },
    { name: "Profile", href: "/profile" },
  ];

  const workerLinks = [
    { name: "Dashboard", href: "/dashboard/worker" },
    { name: "Job Requests", href: "/worker/jobs" },
    { name: "My Jobs", href: "/worker/bookings" },
    { name: "Earnings", href: "/worker/earnings" },
    { name: "Messages", href: "/messages" },
    { name: "Profile", href: "/worker/profile" },
  ];

  const links = role === "CUSTOMER" ? customerLinks : workerLinks;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <button
          onClick={() =>
            router.push(
              role === "CUSTOMER"
                ? "/dashboard/customer"
                : "/dashboard/worker"
            )
          }
          className="text-2xl font-bold tracking-tight"
        >
          <span className="text-[#111827]">Kari</span>
          <span className="text-[#10B981]">gro</span>
        </button>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => router.push(link.href)}
              className="text-sm font-medium text-gray-600 transition hover:text-[#10B981]"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[#111827]">
              {userName}
            </p>

            <p className="text-xs text-gray-500">
              {role === "CUSTOMER" ? "Customer" : "Professional"}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 font-semibold text-[#059669]">
            {userName.charAt(0).toUpperCase()}
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="hidden rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:text-red-600 sm:block"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}