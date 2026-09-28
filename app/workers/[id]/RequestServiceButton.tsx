"use client";

import { useState } from "react";
import { Loader2, MapPin, Send, X } from "lucide-react";

type Service = {
  id: number;
  name: string;
  price: number | null;
};

type RequestServiceButtonProps = {
  workerId: number;
  services: Service[];
  disabled: boolean;
};

export default function RequestServiceButton({
  workerId,
  services,
  disabled,
}: RequestServiceButtonProps) {
  const [open, setOpen] = useState(false);

  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerId,
          serviceName: services[0]?.name,
          description,
          address,
          city,
          budget,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to send your request."
        );
        return;
      }

      setSuccess(
        "Booking request sent! Your professional is expected to arrive in around 30 minutes."
      );

      setDescription("");
      setAddress("");
      setCity("");
      setBudget("");

      setTimeout(() => {
        setOpen(false);
        setSuccess("");
      }, 1500);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  if (disabled) {
    return (
      <button
        disabled
        className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-400"
      >
        Currently unavailable
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#059669]"
      >
        Request Service
        <Send size={17} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-5">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-xl sm:rounded-3xl sm:p-8">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#059669]">
                  Book a service
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#111827]">
                  Get help at your location
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Tell us what happened and where the professional should come.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">
                  Describe the problem
                </label>

                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Example: Kitchen tap is leaking and water keeps dripping."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {description.length}/1000
                </p>
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">
                  Service Address
                </label>

                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="House number, street, landmark"
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">
                  City
                </label>

                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Delhi"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Arrival Info */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10B981] text-white">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#111827]">
                      On-demand service
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      Your professional will come to your location as soon as
                      possible, with a target arrival time of around 30 minutes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">
                  Your budget{" "}
                  <span className="font-normal text-gray-400">
                    (optional)
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Messages */}
              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] py-3.5 text-sm font-semibold text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Finding a professional...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Book Now
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}