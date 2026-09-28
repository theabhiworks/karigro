"use client";

import { useState } from "react";
import { Loader2, Send, Star } from "lucide-react";

type ReviewFormProps = {
  requestId: number;
  workerName: string;
  onSuccess: (rating: number) => void;
};

export default function ReviewForm({
  requestId,
  workerName,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (rating < 1) {
      setError("Please select a rating.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to submit your review."
        );
        return;
      }

      // Use the selected rating instead of data.rating
      onSuccess(rating);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5"
    >
      <div>
        <p className="text-sm font-bold text-[#111827]">
          How was your experience?
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Rate your experience with {workerName}.
        </p>
      </div>

      {/* Rating */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold text-gray-500">
          Your rating
        </p>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hoverRating || rating);

            return (
              <button
                key={star}
                type="button"
                aria-label={`Rate ${star} out of 5`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="rounded-lg p-1 transition hover:bg-white"
              >
                <Star
                  size={28}
                  className={
                    active
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }
                />
              </button>
            );
          })}
        </div>

        {rating > 0 && (
          <p className="mt-2 text-xs font-medium text-gray-500">
            {rating === 5 && "Excellent"}
            {rating === 4 && "Great"}
            {rating === 3 && "Good"}
            {rating === 2 && "Could be better"}
            {rating === 1 && "Poor"}
          </p>
        )}
      </div>

      {/* Comment */}
      <div className="mt-5">
        <label
          htmlFor={`review-${requestId}`}
          className="mb-2 block text-xs font-semibold text-gray-500"
        >
          Your review
          <span className="ml-1 font-normal text-gray-400">
            (optional)
          </span>
        </label>

        <textarea
          id={`review-${requestId}`}
          rows={4}
          maxLength={1000}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Tell other customers about your experience..."
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
        />

        <p className="mt-1 text-right text-xs text-gray-400">
          {comment.length}/1000
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2
              size={17}
              className="animate-spin"
            />
            Submitting...
          </>
        ) : (
          <>
            <Send size={17} />
            Submit Review
          </>
        )}
      </button>
    </form>
  );
}