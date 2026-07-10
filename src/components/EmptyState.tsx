"use client";

import { ShieldAlert, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "No results found",
  description = "Try adjusting your keywords, category selection, or filters to find what you are looking for.",
  actionLabel = "Reset filters",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-16 border border-white/5 rounded-2xl bg-card-bg/25 backdrop-blur-sm min-h-[300px]">
      <div className="p-4 rounded-full bg-white/5 border border-white/5 text-muted-text mb-4 animate-pulse">
        <ShieldAlert className="w-6 h-6 text-muted-text" />
      </div>
      
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      
      <p className="text-xs text-muted-text max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-accent-blue hover:bg-accent-blue/90 active:bg-accent-blue/85 border border-accent-blue/20 rounded-xl transition-all shadow-lg shadow-accent-blue/15 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
