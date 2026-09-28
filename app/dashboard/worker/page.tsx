import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarCheck,
  IndianRupee,
  MapPin,
  Star,
  UserRound,
} from "lucide-react";

import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import DashboardShell from "@/app/components/dashboard/DashboardShell";
import WorkerRequests from "./WorkerRequests";

export default async function WorkerDashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "WORKER") {
    redirect("/dashboard/customer");
  }

  // Find the worker profile
  const workerProfile = await db.workerProfile.findUnique({
    where: {
      userId: session.userId,
    },
  });

  // Default values
  let pendingJobs = 0;
  let activeJobs = 0;
  let completedJobs = 0;
  let totalEarnings = 0;

  if (workerProfile) {
    // Get job statistics
    const [pendingCount, activeCount, completedCount, earnings] =
      await Promise.all([
        db.serviceRequest.count({
          where: {
            workerId: workerProfile.id,
            status: "PENDING",
          },
        }),

        db.serviceRequest.count({
          where: {
            workerId: workerProfile.id,
            status: "ACCEPTED",
          },
        }),

        db.serviceRequest.count({
          where: {
            workerId: workerProfile.id,
            status: "COMPLETED",
          },
        }),

        db.serviceRequest.aggregate({
          where: {
            workerId: workerProfile.id,
            status: "COMPLETED",
          },
          _sum: {
            budget: true,
          },
        }),
      ]);

    pendingJobs = pendingCount;
    activeJobs = activeCount;
    completedJobs = completedCount;
    totalEarnings = Number(earnings._sum.budget ?? 0);
  }

  return (
    <DashboardShell userName={session.name} role="WORKER">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

        {/* Welcome */}
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#059669]">
              PROFESSIONAL DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
              Welcome back, {session.name.split(" ")[0]}
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your service requests and grow your work with Karigro.
            </p>
          </div>

          <Link
            href="/worker/profile"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#111827] shadow-sm transition hover:border-emerald-200 hover:text-[#059669]"
          >
            <UserRound size={17} />
            My Profile
          </Link>
        </section>

        {/* Quick Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Job Requests */}
          <Link
            href="/worker/jobs"
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Job requests
              </p>

              <CalendarCheck
                size={19}
                className="text-[#10B981]"
              />
            </div>

            <p className="mt-3 text-2xl font-bold text-[#111827]">
              {pendingJobs}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              New requests waiting
            </p>
          </Link>

          {/* Active Jobs */}
          <Link
            href="/worker/bookings"
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Active jobs
              </p>

              <BriefcaseBusiness
                size={19}
                className="text-[#10B981]"
              />
            </div>

            <p className="mt-3 text-2xl font-bold text-[#111827]">
              {activeJobs}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Jobs currently in progress
            </p>
          </Link>

          {/* Completed Jobs */}
          <Link
            href="/worker/bookings"
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Completed jobs
              </p>

              <Star
                size={19}
                className="text-[#10B981]"
              />
            </div>

            <p className="mt-3 text-2xl font-bold text-[#111827]">
              {completedJobs}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Jobs successfully completed
            </p>
          </Link>

          {/* Earnings */}
          <Link
            href="/worker/earnings"
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Earnings
              </p>

              <IndianRupee
                size={19}
                className="text-[#10B981]"
              />
            </div>

            <p className="mt-3 text-2xl font-bold text-[#111827]">
              ₹{totalEarnings}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Total earnings
            </p>
          </Link>

        </section>

        {/* Profile reminder */}
        <section className="mt-8 rounded-3xl bg-[#111827] p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#10B981]">
                GROW YOUR BUSINESS
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Keep your professional profile updated
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                Add your services, experience, pricing and service area so
                customers can find and trust you.
              </p>
            </div>

            <Link
              href="/worker/profile"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#059669]"
            >
              Update Profile
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* Job Requests */}
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#111827]">
                Recent job requests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review and manage requests from customers.
              </p>
            </div>

            <Link
              href="/worker/jobs"
              className="hidden items-center gap-1 text-sm font-semibold text-[#059669] sm:flex"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-5">
            <WorkerRequests />
          </div>
        </section>

        {/* Location */}
        <section className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <MapPin size={25} className="text-gray-500" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-[#111827]">
            Ready to receive customers
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Make sure your professional profile and service area are up to
            date so customers nearby can find you.
          </p>

          <Link
            href="/worker/profile"
            className="mt-6 inline-flex rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#059669]"
          >
            Check My Profile
          </Link>
        </section>
      </div>
    </DashboardShell>
  );
}