"use client";

import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useRef, useEffect } from "react";

interface FiltersProps {
  tab: "tools" | "models" | "companies";
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  categories: string[];
  sort: string;
  setSort: (val: string) => void;
  allItems: any[];
  language?: "en" | "hi";
}

const CAT_TRANS: Record<string, Record<string, string>> = {
  en: {
    "Code Assistant": "Code Assistant",
    "Image Generation": "Image Generation",
    "Video Editing": "Video Editing",
    "Audio & Voice": "Audio & Voice",
    "Search & Answer": "Search & Answer",
    "Data Analysis": "Data Analysis",
    "Productivity": "Productivity",
    "Copywriting": "Copywriting",
    "Chatbot": "Chatbot",
    "Translation": "Translation",
    "UI/UX Design": "UI/UX Design"
  },
  hi: {
    "Code Assistant": "कोड असिस्टेंट",
    "Image Generation": "इमेज जनरेशन",
    "Video Editing": "वीडियो एडिटिंग",
    "Audio & Voice": "ऑडियो और वॉइस",
    "Search & Answer": "सर्च और आंसर",
    "Data Analysis": "डेटा एनालिसिस",
    "Productivity": "उत्पादकता",
    "Copywriting": "कॉपीराइटिंग",
    "Chatbot": "चैटबॉट",
    "Translation": "अनुवाद",
    "UI/UX Design": "यूआई/यूएक्स डिज़ाइन"
  }
};

export default function Filters({
  tab,
  selectedCategory,
  setSelectedCategory,
  categories,
  sort,
  setSort,
  allItems,
  language = "en",
}: FiltersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected chip into view
  useEffect(() => {
    const activeChip = scrollRef.current?.querySelector(".active-chip");
    if (activeChip) {
      activeChip.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedCategory]);

  // Dynamically count how many items belong to each category in the active dataset
  const getCategoryCount = (catName: string) => {
    if (!allItems) return 0;
    return allItems.filter(
      (item) => item.category?.toLowerCase() === catName.toLowerCase()
    ).length;
  };

  const getTranslatedCategory = (catName: string) => {
    const map = CAT_TRANS[language] || CAT_TRANS.en;
    return map[catName] || catName;
  };

  return (
    <div className="sticky top-14 md:top-16 z-30 bg-[#000000] border-b border-[#1c1c1e] py-3 mb-6 select-none font-sans">
      <div className="max-w-full w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Categories Horizontal Carousel */}
        {tab !== "companies" && categories.length > 0 ? (
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase shrink-0 select-none">
              {language === "hi" ? "फ़िल्टर:" : "Filter:"}
            </span>

            <div
              ref={scrollRef}
              className="flex-1 flex items-center gap-1.5 overflow-x-auto pb-1 scroll-smooth select-none scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {/* All Categories Chip */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer select-none ${
                  selectedCategory === "all"
                    ? "bg-white text-black border-white font-bold active-chip shadow-sm"
                    : "bg-[#0c0c0d] text-[#888888] hover:text-white border-[#1c1c1e] hover:border-white/10 hover:bg-[#18181a]"
                }`}
              >
                {language === "hi" ? "सभी श्रेणियाँ" : "All Categories"}
              </button>
              
              {/* Category Chips mapping */}
              {categories.map((cat) => {
                const count = getCategoryCount(cat);
                const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer flex items-center gap-2 select-none ${
                      isActive
                        ? "bg-white text-black border-white font-bold active-chip shadow-sm"
                        : "bg-[#0c0c0d] text-[#888888] hover:text-white border-[#1c1c1e] hover:border-white/10 hover:bg-[#18181a]"
                    }`}
                  >
                    <span>{getTranslatedCategory(cat)}</span>
                    {count > 0 && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                          isActive
                            ? "bg-black/10 text-black font-bold"
                            : "bg-[#18181a] text-white/40"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Sort Select Dropdown */}
        <div className="relative shrink-0 w-full lg:w-[180px]">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-9 py-2 bg-[#0c0c0d] border border-[#1c1c1e] focus:border-white/30 rounded-md text-xs text-white focus:outline-none cursor-pointer hover:bg-[#18181a] hover:border-[#333335] transition-all font-semibold select-none"
          >
            <option value="rank">
              {language === "hi" ? "क्रमबद्ध करें: रैंक" : "Sort by: Rank"}
            </option>
            <option value="votes">
              {language === "hi" ? "क्रमबद्ध करें: " : "Sort by: "}
              {tab === "tools" 
                ? (language === "hi" ? "मासिक विज़िट्स" : "Monthly Visits") 
                : tab === "models" 
                  ? (language === "hi" ? "मासिक हिट्स" : "Monthly Hits") 
                  : (language === "hi" ? "मासिक ट्रैफ़िक" : "Monthly Traffic")
              }
            </option>
            <option value="growth">
              {language === "hi" ? "क्रमबद्ध करें: विकास" : "Sort by: Growth"}
            </option>
            <option value="newest">
              {language === "hi" ? "क्रमबद्ध करें: नवीनतम" : "Sort by: Newest"}
            </option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
