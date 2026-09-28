"use client";

import {
  Home,
  Search,
  CalendarDays,
  MessageCircle,
  UserRound,
  Settings,
  LogOut,
  X,
  BriefcaseBusiness,
  Wallet,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type SidebarProps = {
  role: "CUSTOMER" | "WORKER";
  mobileOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({
  role,
  mobileOpen,
  onClose,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const customerLinks = [
    {
      name: "Overview",
      href: "/dashboard/customer",
      icon: Home,
    },
    {
      name: "Find Workers",
      href: "/workers",
      icon: Search,
    },
    {
      name: "My Bookings",
      href: "/dashboard/customer/requests",
      icon: CalendarDays,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageCircle,
    },
    {
      name: "My Profile",
      href: "/profile",
      icon: UserRound,
    },
  ];

  const workerLinks = [
    {
      name: "Overview",
      href: "/dashboard/worker",
      icon: Home,
    },
    {
      name: "Job Requests",
      href: "/worker/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "My Jobs",
      href: "/worker/bookings",
      icon: CalendarDays,
    },
    {
      name: "Earnings",
      href: "/worker/earnings",
      icon: Wallet,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageCircle,
    },
    {
      name: "My Profile",
      href: "/worker/profile",
      icon: UserRound,
    },
  ];

  const links = role === "CUSTOMER" ? customerLinks : workerLinks;

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

  function navigate(href: string) {
    router.push(href);
    onClose();
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <button
            onClick={() =>
              navigate(
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

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* User type */}
        <div className="mx-4 mt-6 rounded-2xl bg-[#F0FDF4] p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[#059669]">
            {role === "CUSTOMER" ? "Customer" : "Professional"}
          </p>

          <p className="mt-1 text-sm font-semibold text-[#111827]">
            {role === "CUSTOMER"
              ? "Find trusted professionals"
              : "Grow your service business"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-7 flex-1 px-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>

          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;

              const isActive =
                pathname === link.href ||
                (link.href !==
                  (role === "CUSTOMER"
                    ? "/dashboard/customer"
                    : "/dashboard/worker") &&
                  pathname.startsWith(link.href));

              return (
                <button
                  key={link.name}
                  onClick={() => navigate(link.href)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#ECFDF5] text-[#059669]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#111827]"
                  }`}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.3 : 2} />

                  <span>{link.name}</span>

                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#10B981]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="my-6 border-t border-gray-100" />

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Account
          </p>

          <button
            onClick={() => navigate("/settings")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-[#111827]"
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <LogOut size={19} />

            <span>{loggingOut ? "Logging out..." : "Log out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}