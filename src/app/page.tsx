"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Cpu, Building2, Bookmark, AlertTriangle, TrendingUp, TrendingDown, Search, ChevronDown, Languages, Menu, Globe, Layers3, RotateCcw, ArrowLeft } from "lucide-react";
import Filters from "@/components/Filters";
import LeaderboardTable from "@/components/LeaderboardTable";
import LeaderboardCard from "@/components/LeaderboardCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import EmptyState from "@/components/EmptyState";

// Dynamic emojis for categories mapping
const CATEGORY_EMOJIS: Record<string, string> = {
  "all": "🗂️",
  "audio & voice": "🔊",
  "chatbot": "🤖",
  "code assistant": "💻",
  "copywriting": "✍️",
  "data analysis": "📊",
  "image generation": "🎨",
  "productivity": "🚀",
  "search & answer": "🔍",
  "translation": "🌐",
  "ui/ux design": "📐",
  "video generation": "🎬"
};

const TRANSLATIONS = {
  en: {
    aiTools: "AI Tools",
    aiModels: "AI Models",
    aiCompanies: "AI Companies",
    bookmarks: "Bookmarks",
    login: "Login",
    emptyTitleSaved: "No bookmarked items found",
    emptyDescSaved: "You haven't bookmarked any items in this category yet. Click the bookmark icon next to items to save them here.",
    emptyTitleFilter: "No results matched filters",
    emptyDescFilter: "We couldn't find any listings matching your search or active filters. Try resetting to defaults.",
    emptyActionSaved: "View all listings",
    emptyActionFilter: "Reset all filters",
    toolsMatched: "AI Tools matched",
    modelsMatched: "AI Models matched",
    companiesMatched: "AI Companies matched",
    noToolsMatched: "No matching AI tools found.",
    noModelsMatched: "No matching models found.",
    noCompaniesMatched: "No matching companies found.",
  },
  hi: {
    aiTools: "एआई टूल्स",
    aiModels: "एआई मॉडल्स",
    aiCompanies: "एआई कंपनियाँ",
    bookmarks: "बुकमार्क्स",
    login: "लॉगिन",
    emptyTitleSaved: "कोई बुकमार्क नहीं मिला",
    emptyDescSaved: "आपने अभी तक इस श्रेणी में कोई आइटम बुकमार्क नहीं किया है। उन्हें सहेजने के लिए आइटम के बगल में बुकमार्क आइकन पर क्लिक करें।",
    emptyTitleFilter: "कोई परिणाम नहीं मिला",
    emptyDescFilter: "हमें आपके खोज या सक्रिय फ़िल्टर से मेल खाता कोई परिणाम नहीं मिला। डिफ़ॉल्ट पर रीसेट करने का प्रयास करें।",
    emptyActionSaved: "सभी आइटम देखें",
    emptyActionFilter: "सभी फ़िल्टर रीसेट करें",
    toolsMatched: "एआई टूल्स मिले",
    modelsMatched: "एआई मॉडल्स मिले",
    companiesMatched: "एआई कंपनियाँ मिलीं",
    noToolsMatched: "कोई मेल खाने वाला एआई टूल नहीं मिला।",
    noModelsMatched: "कोई मेल खाने वाला मॉडल नहीं मिला।",
    noCompaniesMatched: "कोई मेल खाने वाली कंपनी नहीं मिली।",
  }
};



export default function LeaderboardPage() {
  // State Management
  const [tab, setTab] = useState<"tools" | "models" | "companies">("tools");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("rank");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Data States
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Global Search Results State
  const [globalSearchResults, setGlobalSearchResults] = useState<{
    tools: any[];
    models: any[];
    companies: any[];
  } | null>(null);

  // UX States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // 1. Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search change
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // 2. Load Saved bookmarks from LocalStorage (pre-populate with default popular items if empty)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ai_signal_saved");
      const defaultBookmarks = [
        "tool-1", "tool-2", "tool-3", "tool-4",
        "model-2", "model-3", "model-5",
        "company-1", "company-2", "company-3"
      ];

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Upgrade cache if it was initialized with the old 3-item default list
          if (parsed.length === 3 && parsed.includes("tool-1") && parsed.includes("company-1") && parsed.includes("model-3")) {
            localStorage.setItem("ai_signal_saved", JSON.stringify(defaultBookmarks));
            setSavedIds(defaultBookmarks);
          } else {
            setSavedIds(parsed);
          }
        } catch (e) {
          console.error("Failed to parse saved items", e);
        }
      } else {
        localStorage.setItem("ai_signal_saved", JSON.stringify(defaultBookmarks));
        setSavedIds(defaultBookmarks);
      }
    }
  }, []);

  // 3. Toggle Bookmark function
  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("ai_signal_saved", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearch("");
    setSort("rank");
    setCategory("all");
    setShowSavedOnly(false);
    setPage(1);
    setError(null);
  }, []);

  // Complete reset to Home State
  const resetToHome = useCallback(() => {
    setTab("tools");
    resetFilters();
  }, [resetFilters]);

  // Check if current state deviates from default homepage state
  const isCustomState = tab !== "tools" || category !== "all" || search !== "" || showSavedOnly;

  // 4. Fetch Leaderboard Data (high limit of 150 to render all rows at once and disable pagination)
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (debouncedSearch.trim() !== "") {
        // Fetch all three datasets in parallel for the Unified Global Search Results page
        const [toolsRes, modelsRes, companiesRes] = await Promise.all([
          fetch(`/api/leaderboard?tab=tools&search=${encodeURIComponent(debouncedSearch)}&sort=${sort}&category=${category}&limit=150`).then((r) => r.json()),
          fetch(`/api/leaderboard?tab=models&search=${encodeURIComponent(debouncedSearch)}&sort=${sort}&category=${category}&limit=150`).then((r) => r.json()),
          fetch(`/api/leaderboard?tab=companies&search=${encodeURIComponent(debouncedSearch)}&sort=${sort}&category=${category}&limit=150`).then((r) => r.json())
        ]);

        setGlobalSearchResults({
          tools: toolsRes.items || [],
          models: modelsRes.items || [],
          companies: companiesRes.items || []
        });

        setCategories(toolsRes.categories || []);
        setStats(toolsRes.stats);
      } else {
        setGlobalSearchResults(null);

        // Fetch standard active tab directory normally
        const params = new URLSearchParams({
          tab,
          search: "",
          sort,
          category,
          page: "1",
          limit: "150",
        });

        const response = await fetch(`/api/leaderboard?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to load leaderboard data.");
        }

        const data = await response.json();
        
        if (showSavedOnly) {
          const filtered = data.items.filter((item: any) => savedIds.includes(item.id));
          setItems(filtered);
        } else {
          setItems(data.items);
        }

        setCategories(data.categories || []);
        setStats(data.stats);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [tab, debouncedSearch, sort, category, showSavedOnly, savedIds]);

  // Refetch when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Tab Switch
  const handleTabChange = (newTab: "tools" | "models" | "companies") => {
    setTab(newTab);
    resetFilters();
  };

  const t = TRANSLATIONS[language];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* 1. Fixed Floating Navigation Console Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 md:h-16 bg-[#000000]/80 border-b border-[#1c1c1e] backdrop-blur-md px-4 md:px-8 select-none font-sans">
        <div className="max-w-full w-full mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Platform Brand Logo with monochrome style */}
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={resetToHome}>
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-extrabold text-sm shadow-md group-hover:scale-105 transition-transform duration-300">
                AS
              </div>
              <span className="font-extrabold text-white text-sm md:text-base tracking-wider font-sans group-hover:text-white/80 transition-colors">
                AI SIGNAL
              </span>
            </div>
          </div>

          {/* Right Area Controls */}
          <div className="flex items-center gap-4">
            {/* Dynamic language dropdown selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-bold text-muted-text hover:text-white cursor-pointer transition-colors focus:outline-none select-none"
              >
                <Languages className="w-4 h-4 text-muted-text" />
                <span>{language === "hi" ? "हिन्दी" : "English"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-text" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute top-8 right-0 w-36 rounded-xl border border-card-border bg-[#0c0c0d] shadow-2xl p-1.5 flex flex-col gap-0.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setIsLangDropdownOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left w-full ${
                      language === "en" ? "text-white bg-white/5 font-bold" : "text-muted-text hover:text-white hover:bg-white/5"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("hi");
                      setIsLangDropdownOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left w-full ${
                      language === "hi" ? "text-white bg-white/5 font-bold" : "text-muted-text hover:text-white hover:bg-white/5"
                    }`}
                  >
                    हिन्दी (Hindi)
                  </button>
                </div>
              )}
            </div>

            <button className="hidden sm:block px-4 py-2 border border-card-border hover:border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white rounded-lg transition-all duration-200 cursor-pointer active:scale-98">
              {t.login}
            </button>
          </div>
        </div>
      </nav>

      {/* Main portal viewport */}
      <div className="flex-1 max-w-full w-full mx-auto px-4 md:px-8 pt-20 md:pt-24 pb-12 flex flex-col select-text">
        {/* Main area directory board */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* Directory controllers cluster: Tabs + Bookmarks filter */}
          {!globalSearchResults ? (
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5 select-none border-b border-[#1c1c1e] pb-4">
              {/* Unified Tab Selector & Bookmark filter */}
              <div className="flex flex-wrap items-center border border-[#1c1c1e] bg-[#0c0c0d]/60 rounded-md p-1 font-sans gap-1">
                <button
                  onClick={() => {
                    setShowSavedOnly(false);
                    handleTabChange("tools");
                  }}
                  className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all duration-200 cursor-pointer ${
                    tab === "tools" && !showSavedOnly
                      ? "bg-[#1c1c1e] text-white shadow-sm"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {t.aiTools}
                </button>
                <button
                  onClick={() => {
                    setShowSavedOnly(false);
                    handleTabChange("models");
                  }}
                  className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all duration-200 cursor-pointer ${
                    tab === "models" && !showSavedOnly
                      ? "bg-[#1c1c1e] text-white shadow-sm"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {t.aiModels}
                </button>
                <button
                  onClick={() => {
                    setShowSavedOnly(false);
                    handleTabChange("companies");
                  }}
                  className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all duration-200 cursor-pointer ${
                    tab === "companies" && !showSavedOnly
                      ? "bg-[#1c1c1e] text-white shadow-sm"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {t.aiCompanies}
                </button>

                <div className="w-px h-4 bg-[#1c1c1e] mx-1 shrink-0" />

                {/* Bookmark Selector Button */}
                <button
                  onClick={() => {
                    setShowSavedOnly((prev) => !prev);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    showSavedOnly 
                      ? "bg-white text-black font-bold" 
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? "fill-black text-black" : ""}`} />
                  <span>{t.bookmarks}</span>
                  {savedIds.length > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono leading-none ${
                      showSavedOnly ? "bg-black/10 text-black" : "bg-white/10 text-white"
                    }`}>
                      {savedIds.filter(id => {
                        if (tab === "tools") return id.startsWith("tool-");
                        if (tab === "models") return id.startsWith("model-");
                        return id.startsWith("company-");
                      }).length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Global Search Info Header with clear button */
            <div className="flex items-center justify-between border border-accent-blue/10 bg-accent-blue/[0.02] p-4 rounded-xl mb-6 select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-blue animate-pulse" />
                <span className="text-xs md:text-sm text-white font-semibold">
                  {language === "hi" 
                    ? `खोज परिणाम: ` 
                    : `Global search results for: `}
                  <span className="font-mono text-accent-blue">"{debouncedSearch}"</span>
                </span>
              </div>
              <button
                onClick={resetToHome}
                className="flex items-center gap-1.5 text-xs text-muted-text hover:text-white border border-[#1f1f1f] bg-[#0c0c0d] px-3 py-1.5 rounded-lg transition-colors cursor-pointer animate-in fade-in duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "रीसेट करें" : "Reset Search"}</span>
              </button>
            </div>
          )}

          {/* Directory filters (Visible when NOT searching globally) */}
          {!globalSearchResults && (
            <Filters
              tab={tab}
              selectedCategory={category}
              setSelectedCategory={setCategory}
              categories={categories}
              sort={sort}
              setSort={setSort}
              allItems={items}
              language={language}
            />
          )}

          {/* Directory Listings View */}
          <main className="min-w-0 flex-1">
            {isLoading ? (
              <SkeletonLoader limit={5} />
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-8 border border-rose-500/10 rounded-xl bg-rose-500/[0.02] text-center select-none">
                <AlertTriangle className="w-8 h-8 text-rose-500 mb-2 animate-bounce" />
                <h3 className="text-sm font-bold text-white mb-1">Network request failed</h3>
                <p className="text-xs text-rose-400 max-w-sm mb-4">{error}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            ) : globalSearchResults ? (
              /* ================== UNIFIED GLOBAL SEARCH RESULTS VIEW ================== */
              <div className="space-y-10">
                {/* 1. Tools matches block */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-card-border pb-2 select-none">
                    <Sparkles className="w-4 h-4 text-accent-blue" />
                    <h3 className="text-sm font-bold text-white">{t.toolsMatched} ({globalSearchResults.tools.length})</h3>
                  </div>
                  {globalSearchResults.tools.length > 0 ? (
                    <>
                      <div className="hidden md:block">
                        <LeaderboardTable tab="tools" items={globalSearchResults.tools} savedIds={savedIds} toggleSave={toggleSave} language={language} />
                      </div>
                      <div className="block md:hidden">
                        <LeaderboardCard tab="tools" items={globalSearchResults.tools} savedIds={savedIds} toggleSave={toggleSave} language={language} />
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-text/80 pl-2">{t.noToolsMatched}</p>
                  )}
                </div>

                {/* 2. Models matches block */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-card-border pb-2 select-none">
                    <Cpu className="w-4 h-4 text-accent-blue" />
                    <h3 className="text-sm font-bold text-white">{t.modelsMatched} ({globalSearchResults.models.length})</h3>
                  </div>
                  {globalSearchResults.models.length > 0 ? (
                    <>
                      <div className="hidden md:block">
                        <LeaderboardTable tab="models" items={globalSearchResults.models} savedIds={savedIds} toggleSave={toggleSave} language={language} />
                      </div>
                      <div className="block md:hidden">
                        <LeaderboardCard tab="models" items={globalSearchResults.models} savedIds={savedIds} toggleSave={toggleSave} language={language} />
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-text/80 pl-2">{t.noModelsMatched}</p>
                  )}
                </div>

                {/* 3. Companies matches block */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-card-border pb-2 select-none">
                    <Building2 className="w-4 h-4 text-accent-blue" />
                    <h3 className="text-sm font-bold text-white">{t.companiesMatched} ({globalSearchResults.companies.length})</h3>
                  </div>
                  {globalSearchResults.companies.length > 0 ? (
                    <>
                      <div className="hidden md:block">
                        <LeaderboardTable tab="companies" items={globalSearchResults.companies} savedIds={savedIds} toggleSave={toggleSave} language={language} />
                      </div>
                      <div className="block md:hidden">
                        <LeaderboardCard tab="companies" items={globalSearchResults.companies} savedIds={savedIds} toggleSave={toggleSave} language={language} />
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-text/80 pl-2">{t.noCompaniesMatched}</p>
                  )}
                </div>
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                title={showSavedOnly ? t.emptyTitleSaved : t.emptyTitleFilter}
                description={
                  showSavedOnly
                    ? t.emptyDescSaved
                    : t.emptyDescFilter
                }
                actionLabel={showSavedOnly ? t.emptyActionSaved : t.emptyActionFilter}
                onAction={showSavedOnly ? () => setShowSavedOnly(false) : resetFilters}
              />
            ) : (
              /* ================== STANDARD TAB DIRECTORY LIST VIEW (PAGINATION REMOVED) ================== */
              <div className="space-y-6">
                {/* Desktop layout: Always Table List */}
                <div className="hidden md:block">
                  <LeaderboardTable
                    tab={tab}
                    items={items}
                    savedIds={savedIds}
                    toggleSave={toggleSave}
                    language={language}
                  />
                </div>

                {/* Mobile view default cards */}
                <div className="block md:hidden">
                  <LeaderboardCard
                    tab={tab}
                    items={items}
                    savedIds={savedIds}
                    toggleSave={toggleSave}
                    language={language}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="mt-auto pt-8 pb-6 border-t border-[#1f1f1f] text-center text-xs text-[#888888] space-y-3 font-sans select-none">
        <div className="max-w-full w-full mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-black font-extrabold text-xs">
              AS
            </div>
            <span className="font-extrabold text-white tracking-wider">AI SIGNAL</span>
          </div>
          <p className="text-[10px] text-muted-text/60 font-mono">
            © {new Date().getFullYear()} AI Signal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
