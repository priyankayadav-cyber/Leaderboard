"use client";

import { useState } from "react";
import { X, ArrowRightLeft, ExternalLink, Bookmark, Sparkles, Cpu, Building2, Trash2 } from "lucide-react";

interface CompareDrawerProps {
  tab: "tools" | "models" | "companies";
  selectedIds: string[];
  onClear: () => void;
  onRemove: (id: string) => void;
  allItems: any[];
}

export default function CompareDrawer({
  tab,
  selectedIds,
  onClear,
  onRemove,
  allItems,
}: CompareDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Look up selected item full objects
  const comparedItems = selectedIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter(Boolean);

  if (selectedIds.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg glass-panel rounded-2xl p-4 border border-white/10 shadow-2xl shadow-black/80 z-40 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-blue/10 text-accent-blue rounded-xl">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Compare {tab}</div>
            <div className="text-[10px] text-muted-text font-mono">
              {selectedIds.length} of 3 selected
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="p-2 text-muted-text hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            title="Clear all selections"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-accent-blue hover:bg-accent-blue/90 active:bg-accent-blue/85 border border-accent-blue/20 rounded-xl transition-all shadow-lg shadow-accent-blue/15 cursor-pointer"
          >
            Compare Now
          </button>
        </div>
      </div>

      {/* Comparison Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-accent-blue" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
                  Compare {tab} Specifications
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted-text hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid Scroll container */}
            <div className="flex-1 overflow-x-auto p-6 scrollbar-none">
              <div className="min-w-[700px] grid divide-y divide-white/5 border border-white/5 rounded-2xl bg-card-bg/20 overflow-hidden text-sm">
                
                {/* 1. Header (Names) Row */}
                <div className="grid grid-cols-4 bg-white/[0.01] font-bold">
                  <div className="p-4 flex items-center text-muted-text text-xs uppercase tracking-wider font-mono">Features</div>
                  {comparedItems.map((item) => (
                    <div key={item.id} className="p-4 border-l border-white/5 relative">
                      <button
                        onClick={() => onRemove(item.id)}
                        className="absolute right-3 top-3 p-1 text-muted-text hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="text-base text-white font-extrabold pr-6">{item.name}</div>
                      {tab === "models" && <div className="text-xs text-muted-text font-normal">by {item.provider}</div>}
                    </div>
                  ))}
                  {/* Fill empty cells if comparing less than 3 */}
                  {[...Array(3 - comparedItems.length)].map((_, i) => (
                    <div key={i} className="p-4 border-l border-white/5 text-muted-text/30 italic flex items-center justify-center text-xs">
                      Empty Slot
                    </div>
                  ))}
                </div>

                {/* 2. Rank Row */}
                <div className="grid grid-cols-4">
                  <div className="p-4 font-mono text-xs uppercase text-muted-text font-bold">Global Rank</div>
                  {comparedItems.map((item) => (
                    <div key={item.id} className="p-4 border-l border-white/5 font-mono text-white font-bold">
                      #{item.rank}
                    </div>
                  ))}
                  {[...Array(3 - comparedItems.length)].map((_, i) => (
                    <div key={i} className="p-4 border-l border-white/5" />
                  ))}
                </div>

                {/* 3. Dynamic Spec Rows based on Tab */}
                {tab === "tools" && (
                  <>
                    <div className="grid grid-cols-4">
                      <div className="p-4 font-mono text-xs uppercase text-muted-text font-bold">Category</div>
                      {comparedItems.map((item) => (
                        <div key={item.id} className="p-4 border-l border-white/5 text-white font-medium">
                          {item.category}
                        </div>
                      ))}
                      {[...Array(3 - comparedItems.length)].map((_, i) => (
                        <div key={i} className="p-4 border-l border-white/5" />
                      ))}
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="p-4 font-mono text-xs uppercase text-muted-text font-bold">Pricing</div>
                      {comparedItems.map((item) => (
                        <div key={item.id} className="p-4 border-l border-white/5 text-white font-semibold">
                          {item.pricing}
                        </div>
                      ))}
                      {[...Array(3 - comparedItems.length)].map((_, i) => (
                        <div key={i} className="p-4 border-l border-white/5" />
                      ))}
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="p-4 font-mono text-xs uppercase text-muted-text font-bold">Rating</div>
                      {comparedItems.map((item) => (
                        <div key={item.id} className="p-4 border-l border-white/5 text-white font-mono font-semibold">
                          ⭐ {item.rating} ({item.votes.toLocaleString()} votes)
                        </div>
                      ))}
                      {[...Array(3 - comparedItems.length)].map((_, i) => (
                        <div key={i} className="p-4 border-l border-white/5" />
                      ))}
                    </div>
                  </>
                )}

                {tab === "models" && (
                  <>
                    <div className="grid grid-cols-4">
                      <div className="p-4 font-mono text-xs uppercase text-muted-text font-bold">Context Window</div>
                      {comparedItems.map((item) => (
                        <div key={item.id} className="p-4 border-l border-white/5 text-white font-mono font-medium">
                          {item.contextWindow}
                        </div>
                      ))}
                      {[...Array(3 - comparedItems.length)].map((_, i) => (
                        <div key={i} className="p-4 border-l border-white/5" />
                      ))}
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="p-4 font-mono text-xs uppercase text-muted-text font-bold">API Price</div>
                      {comparedItems.map((item) => (
                        <div key={item.id} className="p-4 border-l border-white/5 text-white font-mono text-xs leading-relaxed">
                          {item.pricing}
                        </div>
                      ))}
                      {[...Array(3 - comparedItems.length)].map((_, i) => (
                        <div key={i} className="p-4 border-l border-white/5" />
                      ))}
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="p-4 font-mono text-xs uppercase text-muted-text font-bold">MMLU Score / ELO</div>
                      {comparedItems.map((item) => (
                        <div key={item.id} className="p-4 border-l border-white/5 text-white font-mono font-bold">
                          {item.benchmarkScore}% MMLU ({item.eloRating} ELO)
                        </div>
                      ))}
                      {[...Array(3 - comparedItems.length)].map((_, i) => (
                        <div key={i} className="p-4 border-l border-white/5" />
                      ))}
                    </div>
                  </>
                )}

                {tab === "companies" && (
                  <>
                    <div className="grid grid-cols-4">
                      <div className="p-4 font-mono text-xs uppercase text-muted-text font-bold">Headquarters</div>
                      {comparedItems.map((item) => (
                        <div key={item.id} className="p-4 border-l border-white/5 text-white">
                          {item.headquarters}
                        </div>
                      ))}
                      {[...Array(3 - comparedItems.length)].map((_, i) => (
                        <div key={i} className="p-4 border-l border-white/5" />
                      ))}
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="p-4 font-mono text-xs uppercase text-muted-text font-bold">Funding</div>
                      {comparedItems.map((item) => (
                        <div key={item.id} className="p-4 border-l border-white/5 text-emerald-400 font-semibold font-mono">
                          {item.funding}
                        </div>
                      ))}
                      {[...Array(3 - comparedItems.length)].map((_, i) => (
                        <div key={i} className="p-4 border-l border-white/5" />
                      ))}
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="p-4 font-mono text-xs uppercase text-muted-text font-bold">Products / Models</div>
                      {comparedItems.map((item) => (
                        <div key={item.id} className="p-4 border-l border-white/5 text-white font-mono font-medium">
                          {item.productsCount} products / {item.modelsCount} models
                        </div>
                      ))}
                      {[...Array(3 - comparedItems.length)].map((_, i) => (
                        <div key={i} className="p-4 border-l border-white/5" />
                      ))}
                    </div>
                  </>
                )}

                {/* 4. Growth Trend Row */}
                <div className="grid grid-cols-4">
                  <div className="p-4 font-mono text-xs uppercase text-muted-text font-bold">Growth Momentum</div>
                  {comparedItems.map((item) => (
                    <div key={item.id} className="p-4 border-l border-white/5 text-white font-semibold">
                      <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        +{item.growth}%
                      </span>
                    </div>
                  ))}
                  {[...Array(3 - comparedItems.length)].map((_, i) => (
                    <div key={i} className="p-4 border-l border-white/5" />
                  ))}
                </div>

                {/* 5. Description Row */}
                <div className="grid grid-cols-4">
                  <div className="p-4 font-mono text-xs uppercase text-muted-text font-bold">Profile Summary</div>
                  {comparedItems.map((item) => (
                    <div key={item.id} className="p-4 border-l border-white/5 text-xs text-muted-text leading-relaxed">
                      {item.description}
                    </div>
                  ))}
                  {[...Array(3 - comparedItems.length)].map((_, i) => (
                    <div key={i} className="p-4 border-l border-white/5" />
                  ))}
                </div>

                {/* 6. Action Row */}
                <div className="grid grid-cols-4 bg-white/[0.01]">
                  <div className="p-4" />
                  {comparedItems.map((item) => (
                    <div key={item.id} className="p-4 border-l border-white/5 flex gap-2">
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent-blue/15 hover:bg-accent-blue/25 text-white text-xs font-bold rounded-xl border border-accent-blue/20 transition-all cursor-pointer"
                        >
                          <span>Visit Website</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                  {[...Array(3 - comparedItems.length)].map((_, i) => (
                    <div key={i} className="p-4 border-l border-white/5" />
                  ))}
                </div>

              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] text-[10px] text-muted-text/80 text-center font-mono">
              AI Signal — Interactive comparison metrics derived directly from catalog profiles.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
