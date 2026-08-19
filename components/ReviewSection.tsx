"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { RatingStars } from "./RatingStars";
import { formatDate } from "@/lib/format";
import { Button, Textarea } from "./ui";
import type { Review } from "@/lib/types";

export function ReviewSection({
  resourceId,
  reviews,
  authorNames,
  signedIn,
  myReview,
}: {
  resourceId: string;
  reviews: Review[];
  authorNames: Record<string, string>;
  signedIn: boolean;
  myReview: Review | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(myReview?.rating ?? 0);
  const [comment, setComment] = useState(myReview?.comment ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Choose a star rating.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource_id: resourceId, rating, comment }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.message ?? "Could not submit review.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {signedIn ? (
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium text-foreground">{myReview ? "Update your review" : "Write a review"}</p>
          <div className="mt-2">
            <RatingStars value={rating} onChange={setRating} />
          </div>
          <Textarea
            className="mt-3"
            rows={3}
            maxLength={1000}
            placeholder="Share your thoughts about this resource…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
          <Button type="submit" size="sm" className="mt-3" disabled={busy}>
            {busy ? "Saving…" : myReview ? "Update review" : "Submit review"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted">
          <a href="/login" className="font-medium text-brand hover:underline">Sign in</a> to write a review.
        </p>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-muted">No reviews yet. Be the first to share your thoughts.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{authorNames[r.user_id] ?? "SmartLib user"}</p>
                <RatingStars value={r.rating} readOnly size="sm" />
              </div>
              {r.comment && <p className="mt-2 text-sm text-muted">{r.comment}</p>}
              <p className="mt-2 text-xs text-muted">{formatDate(r.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
