"use client";

import React from "react";
import { X } from "lucide-react";
import { StarRatingInput } from "./StarRating";

interface FeedbackModalProps {
  posterName: string;
  rating: number;
  hover: number;
  text: string;
  submitting: boolean;
  onRate: (star: number) => void;
  onHover: (star: number) => void;
  onText: (val: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function FeedbackModal({
  posterName,
  rating,
  hover,
  text,
  submitting,
  onRate,
  onHover,
  onText,
  onCancel,
  onSubmit,
}: FeedbackModalProps) {
  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Submit Feedback</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Rate your experience with {posterName}</p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-2">Rating</label>
            <StarRatingInput
              rating={rating}
              hover={hover}
              onRate={onRate}
              onHover={onHover}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Feedback</label>
            <textarea
              value={text}
              onChange={(e) => onText(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 resize-none"
            />
          </div>
        </div>
        <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || rating === 0 || !text.trim()}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                {/* Star icon is included in StarRatingInput */}
                Submit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
