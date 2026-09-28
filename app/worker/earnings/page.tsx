"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  IndianRupee,
  Loader2,
  TrendingUp,
} from "lucide-react";

type Job = {
  id: number;
  serviceName: string;
  budget: number | null;
  scheduledDate: string;
  status: string;
  customer: {
    name: string;
  };
};

export default function WorkerEarningsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEarnings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/requests");
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load earnings.");
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
    loadEarnings();
  }, []);

  // Only completed jobs count as earnings.
  const completedJobs = jobs.filter(
    (job) => job.status === "COMPLETED"
  );

  const totalEarnings = completedJobs.reduce(
    (total, job) => total + (job.budget ?? 0),
    0
  );

  const averageEarning =
    completedJobs.length > 0
      ? Math.round(totalEarnings / completedJobs.length)
      : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#059669]">
              <TrendingUp size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#059669]">
                Professional
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                Earnings
              </h1>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Track your earnings from completed service jobs.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10 flex items-center justify-center rounded-3xl border border-gray-200 bg-white py-16">
            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
              <Loader2
                size={20}
                className="animate-spin text-[#10B981]"
              />
              Loading earnings...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Earnings content */}
        {!loading && !error && (
          <>
            {/* Summary cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">

              {/* Total earnings */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total Earnings
                    </p>

                    <p className="mt-2 text-3xl font-bold text-[#111827]">
                      ₹{totalEarnings}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#059669]">
                    <IndianRupee size={22} />
                  </div>
                </div>
              </div>

              {/* Completed jobs */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Completed Jobs
                    </p>

                    <p className="mt-2 text-3xl font-bold text-[#111827]">
                      {completedJobs.length}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <BriefcaseBusiness size={22} />
                  </div>
                </div>
              </div>

              {/* Average */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Average per Job
                    </p>

                    <p className="mt-2 text-3xl font-bold text-[#111827]">
                      ₹{averageEarning}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <TrendingUp size={22} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent earnings */}
            <div className="mt-8 rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="font-bold text-[#111827]">
                  Recent Earnings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your completed jobs and their earnings.
                </p>
              </div>

              {completedJobs.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                    <IndianRupee size={24} />
                  </div>

                  <h3 className="mt-4 font-semibold text-[#111827]">
                    No earnings yet
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Earnings will appear here after you complete a job.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {completedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#059669]">
                            <BriefcaseBusiness size={18} />
                          </div>

                          <div>
                            <p className="font-semibold text-[#111827]">
                              {job.serviceName}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Customer: {job.customer.name}
                            </p>
                          </div>
                        </div>

                        <p className="mt-3 text-xs text-gray-400">
                          Completed on{" "}
                          {new Date(
                            job.scheduledDate
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-lg font-bold text-[#059669]">
                        <IndianRupee size={18} />
                        {job.budget ?? 0}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}