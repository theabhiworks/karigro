"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Loader2, MapPin, Clock } from "lucide-react";

type Request = {
  id: number;
  serviceName: string;
  description: string | null;
  arrivalTarget: string | null;
  address: string;
  city: string;
  budget: number | null;
  status: string;
  customer: {
    id: number;
    name: string;
  };
};

export default function WorkerJobsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    try {
      setLoading(true);

      const response = await fetch("/api/requests");
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load job requests.");
        return;
      }

      setRequests(data.requests ?? []);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateRequest(
    id: number,
    action: "ACCEPT" | "DECLINE"
  ) {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update request.");
        return;
      }

      await loadRequests();
    } catch {
      alert("Unable to connect to the server.");
    }
  }

  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING"
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
                PROFESSIONAL DASHBOARD
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                Live Job Requests
              </h1>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Customers expect you to reach their location within approximately
            30 minutes.
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
              Loading job requests...
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
        {!loading && !error && pendingRequests.length === 0 && (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <BriefcaseBusiness size={25} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#111827]">
              No pending requests
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              New bookings from customers will appear here instantly.
            </p>
          </div>
        )}

        {/* Requests */}
        {!loading && !error && pendingRequests.length > 0 && (
          <div className="mt-8 space-y-5">
            {pendingRequests.map((request) => (
              <article
                key={request.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                {/* Top */}
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-[#111827]">
                        {request.serviceName}
                      </h2>

                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        Pending
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      Customer:{" "}
                      <span className="font-semibold text-[#111827]">
                        {request.customer.name}
                      </span>
                    </p>
                  </div>

                  {request.budget !== null && (
                    <div className="text-left lg:text-right">
                      <p className="text-xs text-gray-400">
                        Budget
                      </p>

                      <p className="text-2xl font-bold text-[#111827]">
                        ₹{request.budget}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {request.description && (
                  <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Problem
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {request.description}
                    </p>
                  </div>
                )}

                {/* Address */}
                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981] text-white">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#111827]">
                        Service Location
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {request.address}
                      </p>

                      <p className="text-sm text-gray-500">
                        {request.city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                      Arrival target
                    </p>

                    <div className="mt-1 flex items-center gap-2 font-semibold text-[#111827]">
                      <Clock size={16} className="text-[#10B981]" />

                      {request.arrivalTarget
                        ? new Date(
                            request.arrivalTarget
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Within 30 minutes"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                      Request ID
                    </p>

                    <p className="mt-1 font-semibold text-[#111827]">
                      #{request.id}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    onClick={() =>
                      updateRequest(request.id, "DECLINE")
                    }
                    className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Decline
                  </button>

                  <button
                    onClick={() =>
                      updateRequest(request.id, "ACCEPT")
                    }
                    className="rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#059669]"
                  >
                    Accept Job
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}