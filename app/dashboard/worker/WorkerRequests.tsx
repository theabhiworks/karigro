"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Clock3,
  Loader2,
  MapPin,
  MessageSquareText,
  X,
} from "lucide-react";

type ServiceRequest = {
  id: number;
  serviceName: string;
  description: string;
  address: string;
  city: string;
  arrivalTarget: string | null;
  budget: number | null;
  status:
    | "PENDING"
    | "ACCEPTED"
    | "DECLINED"
    | "CANCELLED"
    | "COMPLETED";
  createdAt: string;
  customer: {
    id: number;
    name: string;
  };
};

export default function WorkerRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/requests");
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load service requests.");
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

  async function handleAction(
    requestId: number,
    action: "ACCEPT" | "DECLINE" | "COMPLETE"
  ) {
    setActionId(requestId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to update request.");
        return;
      }

      setRequests((current) =>
        current.map((request) =>
          request.id === requestId
            ? { ...request, status: data.request.status }
            : request
        )
      );

      setSuccess(data.message);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setActionId(null);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(dateString: string | null) {
    if (!dateString) return "Within 30 minutes";

    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2
            size={19}
            className="animate-spin text-[#10B981]"
          />
          Loading service requests...
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#059669]">
          LIVE REQUESTS
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#111827]">
          Service requests
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Customers expect you to arrive within approximately 30 minutes.
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm">
            <MessageSquareText size={21} />
          </div>

          <h3 className="mt-4 font-semibold text-[#111827]">
            No service requests yet
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
            New customer bookings will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="mt-7 space-y-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-2xl border border-gray-200 p-5 transition hover:border-emerald-200"
            >
              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-[#111827]">
                      {request.serviceName}
                    </h3>

                    {request.status === "PENDING" && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                        Pending
                      </span>
                    )}

                    {request.status === "ACCEPTED" && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                        Accepted
                      </span>
                    )}

                    {request.status === "DECLINED" && (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                        Declined
                      </span>
                    )}

                    {request.status === "COMPLETED" && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                        Completed
                      </span>
                    )}

                    {request.status === "CANCELLED" && (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                        Cancelled
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm font-medium text-[#059669]">
                    Requested by {request.customer.name}
                  </p>
                </div>

                {request.budget !== null && (
                  <div className="shrink-0">
                    <p className="text-xs text-gray-400">
                      Customer budget
                    </p>

                    <p className="mt-0.5 text-lg font-bold text-[#111827]">
                      ₹{request.budget}
                    </p>
                  </div>
                )}
              </div>

              {/* Problem */}
              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Problem
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {request.description}
                </p>
              </div>

              {/* Location */}
              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981] text-white">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#111827]">
                      Service location
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
                  <div className="flex items-center gap-2">
                    <Clock3
                      size={16}
                      className="text-[#059669]"
                    />

                    <p className="font-medium text-[#111827]">
                      Arrival target
                    </p>
                  </div>

                  <p className="mt-1 text-gray-600">
                    {formatTime(request.arrivalTarget)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="font-medium text-[#111827]">
                    Request received
                  </p>

                  <p className="mt-1 text-gray-600">
                    {formatDate(request.createdAt)}
                  </p>
                </div>
              </div>

              {/* Pending Actions */}
              {request.status === "PENDING" && (
                <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={actionId === request.id}
                    onClick={() =>
                      handleAction(request.id, "DECLINE")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    {actionId === request.id ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <X size={17} />
                    )}
                    Decline
                  </button>

                  <button
                    type="button"
                    disabled={actionId === request.id}
                    onClick={() =>
                      handleAction(request.id, "ACCEPT")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#059669] disabled:opacity-50"
                  >
                    {actionId === request.id ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Check size={17} />
                    )}
                    Accept Job
                  </button>
                </div>
              )}

              {/* Complete Button */}
              {request.status === "ACCEPTED" && (
                <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    disabled={actionId === request.id}
                    onClick={() =>
                      handleAction(request.id, "COMPLETE")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                  >
                    {actionId === request.id ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Check size={17} />
                    )}
                    Mark as Completed
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}