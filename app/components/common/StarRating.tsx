"use client";

import React from "react";
import { Star } from "lucide-react";

interface StarRatingDisplayProps {
  rating: number;
  size?: number;
}

/** Read-only star rating display */
export function StarRatingDisplay({ rating, size = 10 }: StarRatingDisplayProps) {
  return (
    <div className="flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= (rating || 0) ? "text-amber-400 fill-amber-400" : "text-zinc-300 dark:text-zinc-600"}
        />
      ))}
    </div>
  );
}

interface StarRatingInputProps {
  rating: number;
  hover: number;
  onRate: (star: number) => void;
  onHover: (star: number) => void;
  size?: number;
}

/** Interactive star rating input */
export function StarRatingInput({ rating, hover, onRate, onHover, size = 24 }: StarRatingInputProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={() => onHover(0)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={`transition-colors ${
              star <= (hover || rating)
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-300 dark:text-zinc-600"
            }`}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400">{rating}/5</span>
      )}
    </div>
  );
}
