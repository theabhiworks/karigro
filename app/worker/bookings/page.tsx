"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  Loader2,
  UserRound,
  IndianRupee,
} from "lucide-react";

type Job = {
  id: number;
  serviceName: string;
  description: string | null;
  scheduledDate: string;
  budget: number | null;
  priority: string;
  status: string;
  customer: {
    id: number;
    name: string;
  };
};

export default function WorkerBookingsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/requests");
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load your jobs.");
        return;
      }

      setJobs(data.requests ?? []);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function statusStyle(status: string) {
    switch (status) {
      case "ACCEPTED":
        return "bg-emerald-50 text-emerald-600";

      case "COMPLETED":
        return "bg-blue-50 text-blue-600";

      case "DECLINED":
        return "bg-red-50 text-red-600";

      case "PENDING":
        return "bg-amber-50 text-amber-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  function statusLabel(status: string) {
    switch (status) {
      case "ACCEPTED":
        return "Accepted";

      case "COMPLETED":
        return "Completed";

      case "DECLINED":
        return "Declined";

      case "PENDING":
        return "Pending";

      default:
        return status;
    }
  }

  const activeJobs = jobs.filter(
    (job) => job.status === "ACCEPTED"
  );

  const completedJobs = jobs.filter(
    (job) => job.status === "COMPLETED"
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#059669]">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#059669]">
                Professional
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                My Jobs
              </h1>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            View the service jobs you have received and their current status.
          </p>
        </div>

        {/* Summary */}
        {!loading && !error && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Jobs
              </p>

              <p className="mt-2 text-2xl font-bold text-[#111827]">
                {jobs.length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Active Jobs
              </p>

              <p className="mt-2 text-2xl font-bold text-[#059669]">
                {activeJobs.length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {completedJobs.length}
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-10 flex items-center justify-center rounded-3xl border border-gray-200 bg-white py-16">
            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
              <Loader2
                size={20}
                className="animate-spin text-[#10B981]"
              />
              Loading your jobs...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && jobs.length === 0 && (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <BriefcaseBusiness size={25} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#111827]">
              No jobs yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Jobs will appear here when customers request your services.
            </p>
          </div>
        )}

        {/* Jobs */}
        {!loading && !error && jobs.length > 0 && (
          <div className="mt-8 space-y-4">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                {/* Top */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-[#111827]">
                        {job.serviceName}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                          job.status
                        )}`}
                      >
                        {statusLabel(job.status)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <UserRound size={16} />

                      <span>
                        Customer:
                      </span>

                      <span className="font-semibold text-gray-700">
                        {job.customer.name}
                      </span>
                    </div>
                  </div>

                  {job.budget !== null && (
                    <div className="flex items-center gap-1 text-lg font-bold text-[#111827]">
                      <IndianRupee size={18} />
                      {job.budget}
                    </div>
                  )}
                </div>

                {/* Description */}
                {job.description && (
                  <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Description
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {job.description}
                    </p>
                  </div>
                )}

                {/* Details */}
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <CalendarDays size={15} />

                      <p className="text-xs">
                        Scheduled date
                      </p>
                    </div>

                    <p className="mt-1 text-sm font-semibold text-[#111827]">
                      {new Date(
                        job.scheduledDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                      Priority
                    </p>

                    <p className="mt-1 text-sm font-semibold capitalize text-[#111827]">
                      {job.priority.toLowerCase()}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                      Job ID
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#111827]">
                      #{job.id}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}