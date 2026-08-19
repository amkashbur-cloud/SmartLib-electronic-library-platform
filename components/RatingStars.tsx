"use client";

import { useState } from "react";
import { StarIcon } from "./Icons";

export function RatingStars({
  value,
  onChange,
  size = "md",
  readOnly = false,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const dims = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" }[size];
  const display = hover ?? value;

  return (
    <div className={`inline-flex items-center gap-0.5 ${readOnly ? "" : "cursor-pointer"}`} role={readOnly ? undefined : "radiogroup"} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(null)}
          onClick={() => !readOnly && onChange?.(star)}
        >
          <StarIcon className={`${dims} ${star <= display ? "text-amber-400" : "text-slate-300"}`} filled={star <= display} />
        </button>
      ))}
    </div>
  );
}
