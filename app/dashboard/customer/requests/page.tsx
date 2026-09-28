"use client";
import ReviewForm from "./ReviewForm";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  MessageSquare,
  XCircle,
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
  worker: {
    id: number;
    user: {
      name: string;
    };
  };
  review: {
    id: number;
    rating: number;
    comment: string | null;
    createdAt: string;
  } | null;
};

export default function CustomerRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<number | null>(null);
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  async function loadRequests() {
    try {
      setLoading(true);

      const response = await fetch("/api/requests");
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load requests.");
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

  async function cancelRequest(id: number) {
    if (!confirm("Cancel this service request?")) return;

    try {
      setActionId(id);

      const response = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "CANCEL",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to cancel request.");
        return;
      }

      await loadRequests();
    } catch {
      alert("Unable to connect to the server.");
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

  function formatArrival(dateString: string | null) {
    if (!dateString) return "Within 30 minutes";

    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#059669]">
              <CalendarCheck size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#059669]">
                CUSTOMER DASHBOARD
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                My Requests
              </h1>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Track your live bookings and know when your professional is on the
            way.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10 flex items-center justify-center rounded-3xl border border-gray-200 bg-white py-16">
            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
              <Loader2 size={20} className="animate-spin text-[#10B981]" />
              Loading requests...
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
        {!loading && !error && requests.length === 0 && (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <CalendarCheck size={25} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#111827]">
              No service requests yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Book a professional and your requests will appear here.
            </p>
          </div>
        )}

        {/* Requests */}
        {!loading && !error && requests.length > 0 && (
          <div className="mt-8 space-y-5">
            {requests.map((request) => (
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

                      {request.status === "PENDING" && (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          Pending
                        </span>
                      )}

                      {request.status === "ACCEPTED" && (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Accepted
                        </span>
                      )}

                      {request.status === "COMPLETED" && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          Completed
                        </span>
                      )}

                      {request.status === "DECLINED" && (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                          Declined
                        </span>
                      )}

                      {request.status === "CANCELLED" && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                          Cancelled
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      Professional:{" "}
                      <span className="font-semibold text-[#111827]">
                        {request.worker.user.name}
                      </span>
                    </p>
                  </div>

                  {request.budget !== null && (
                    <div className="text-left lg:text-right">
                      <p className="text-xs text-gray-400">Budget</p>

                      <p className="text-2xl font-bold text-[#111827]">
                        ₹{request.budget}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Banner */}
                <div
                  className={`mt-5 rounded-2xl p-4 ${request.status === "ACCEPTED"
                    ? "bg-emerald-50 border border-emerald-100"
                    : request.status === "COMPLETED"
                      ? "bg-blue-50 border border-blue-100"
                      : request.status === "DECLINED"
                        ? "bg-red-50 border border-red-100"
                        : request.status === "CANCELLED"
                          ? "bg-gray-100 border border-gray-200"
                          : "bg-amber-50 border border-amber-100"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {request.status === "ACCEPTED" && (
                      <CheckCircle2 className="text-emerald-600" size={22} />
                    )}

                    {request.status === "COMPLETED" && (
                      <CheckCircle2 className="text-blue-600" size={22} />
                    )}

                    {(request.status === "DECLINED" ||
                      request.status === "CANCELLED") && (
                        <XCircle className="text-red-500" size={22} />
                      )}

                    {request.status === "PENDING" && (
                      <Clock3 className="text-amber-600" size={22} />
                    )}

                    <div>
                      <p className="font-semibold text-[#111827]">
                        {request.status === "PENDING" &&
                          "Waiting for professional"}

                        {request.status === "ACCEPTED" &&
                          "Professional is on the way"}

                        {request.status === "COMPLETED" &&
                          "Service completed"}

                        {request.status === "DECLINED" &&
                          "Request declined"}

                        {request.status === "CANCELLED" &&
                          "Request cancelled"}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {request.status === "PENDING" &&
                          "Your professional has up to 30 minutes to respond."}

                        {request.status === "ACCEPTED" &&
                          "Your professional accepted the request and is heading to your location."}

                        {request.status === "COMPLETED" &&
                          "The job has been completed successfully."}

                        {request.status === "DECLINED" &&
                          "The professional declined your request."}

                        {request.status === "CANCELLED" &&
                          "You cancelled this request."}
                      </p>
                    </div>
                  </div>
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

                {/* Details */}
                <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-[#059669]"
                    />

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Location
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#111827]">
                        {request.address}, {request.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock3
                      size={18}
                      className="mt-0.5 shrink-0 text-[#059669]"
                    />

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Arrival target
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#111827]">
                        {formatArrival(request.arrivalTarget)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-[#059669]"
                    />

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Booked on
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#111827]">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare
                      size={18}
                      className="mt-0.5 shrink-0 text-[#059669]"
                    />

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Request ID
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#111827]">
                        #{request.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                  {request.status === "PENDING" && (
                    <button
                      onClick={() => cancelRequest(request.id)}
                      disabled={actionId === request.id}
                      className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {actionId === request.id
                        ? "Cancelling..."
                        : "Cancel Request"}
                    </button>
                  )}

                  {request.status === "COMPLETED" &&
                    !request.review && (
                      <button
                        onClick={() =>
                          setReviewingId(
                            reviewingId === request.id ? null : request.id
                          )
                        }
                        className="rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#059669]"
                      >
                        {reviewingId === request.id
                          ? "Close Review"
                          : "Write Review"}
                      </button>
                    )}

                  {request.review && (
                    <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      ⭐ {request.review.rating}/5 • Review submitted
                    </div>
                  )}
                </div>
                {reviewingId === request.id && (
                  <ReviewForm
                    requestId={request.id}
                    workerName={request.worker.user.name}
                    onSuccess={async () => {
                      setReviewingId(null);
                      await loadRequests();
                    }}
                  />
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}