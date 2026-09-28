import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck,
  MapPin,
  Search,
  ShieldCheck,
  ClipboardList,
  Wrench,
  Zap,
} from "lucide-react";

import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import DashboardShell from "@/app/components/dashboard/DashboardShell";

const popularServices = [
  {
    name: "Plumber",
    icon: Wrench,
    description: "Pipes, taps & water repairs",
  },
  {
    name: "Electrician",
    icon: Zap,
    description: "Wiring & electrical repairs",
  },
  {
    name: "AC Repair",
    icon: Wrench,
    description: "Service & installation",
  },
  {
    name: "Carpenter",
    icon: Wrench,
    description: "Furniture & woodwork",
  },
];

export default async function CustomerDashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "CUSTOMER") {
    redirect("/dashboard/worker");
  }



  // Get customer request statistics
  const [totalRequests, activeBookings, completedJobs] =
    await Promise.all([
      db.serviceRequest.count({
        where: {
          customerId: session.userId,
        },
      }),

      db.serviceRequest.count({
        where: {
          customerId: session.userId,
          status: {
            in: ["PENDING", "ACCEPTED"],
          },
        },
      }),

      db.serviceRequest.count({
        where: {
          customerId: session.userId,
          status: "COMPLETED",
        },
      }),
    ]);

  return (
    <DashboardShell userName={session.name} role="CUSTOMER">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

        {/* Welcome */}
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#059669]">
              CUSTOMER DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
              What can we help you with?
            </h1>

            <p className="mt-2 text-gray-500">
              Find trusted professionals for your everyday needs.
            </p>
          </div>

          <Link
            href="/dashboard/customer/requests"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#111827] shadow-sm transition hover:border-emerald-200 hover:text-[#059669]"
          >
            <CalendarCheck size={17} />
            My Requests
          </Link>
        </section>

        {/* Main Search */}
        <section className="mt-8 overflow-hidden rounded-3xl bg-[#111827] p-6 sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981] text-white">
              <Search size={20} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
              Find a skilled professional
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Tell us what you need and we'll help you find the right person
              for the job.
            </p>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
              <Search size={19} className="text-gray-400" />

              <input
                type="text"
                placeholder="What service do you need?"
                className="w-full text-sm text-[#111827] outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
              <MapPin size={19} className="text-gray-400" />

              <input
                type="text"
                placeholder="Your location"
                className="w-full text-sm text-[#111827] outline-none placeholder:text-gray-400"
              />
            </div>

            <Link
              href="/workers"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#10B981] px-6 py-3 font-semibold text-white transition hover:bg-[#059669]"
            >
              Search
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">

          {/* Active bookings */}
          <Link
            href="/dashboard/customer/requests"
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Active bookings
              </p>

              <CalendarCheck
                size={19}
                className="text-[#10B981]"
              />
            </div>

            <p className="mt-3 text-2xl font-bold text-[#111827]">
              {activeBookings}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Bookings currently accepted
            </p>
          </Link>

          {/* Completed jobs */}
          <Link
            href="/dashboard/customer/requests"
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Completed jobs
              </p>

              <ShieldCheck
                size={19}
                className="text-[#10B981]"
              />
            </div>

            <p className="mt-3 text-2xl font-bold text-[#111827]">
              {completedJobs}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Your completed services
            </p>
          </Link>

          {/* Total requests */}
          <Link
            href="/dashboard/customer/requests"
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Total requests
              </p>

              <ClipboardList
                size={19}
                className="text-[#10B981]"
              />
            </div>

            <p className="mt-3 text-2xl font-bold text-[#111827]">
              {totalRequests}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              All service requests
            </p>
          </Link>

        </section>

        {/* Services */}
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#111827]">
                Popular services
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Get help from professionals near you.
              </p>
            </div>

            <Link
              href="/workers"
              className="hidden items-center gap-1 text-sm font-semibold text-[#059669] sm:flex"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularServices.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.name}
                  href={`/workers?profession=${encodeURIComponent(
                    service.name
                  )}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#059669] transition group-hover:bg-[#10B981] group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-4 font-semibold text-[#111827]">
                    {service.name}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {service.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#059669]">
                    Find professionals
                    <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Booking state */}
        <section className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <CalendarCheck
              size={25}
              className="text-gray-500"
            />
          </div>

          <h2 className="mt-5 text-lg font-bold text-[#111827]">
            {totalRequests > 0
              ? "Manage your service requests"
              : "Your bookings will appear here"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            {totalRequests > 0
              ? "Track your requests, check their status and manage your booked services."
              : "Once you book a professional, you can track the job and manage everything from this dashboard."}
          </p>

          <Link
            href={totalRequests > 0 ? "/dashboard/customer/requests" : "/workers"}
            className="mt-6 inline-flex rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#059669]"
          >
            {totalRequests > 0
              ? "View My Requests"
              : "Find a Worker"}
          </Link>
        </section>

      </div>
    </DashboardShell>
  );
}