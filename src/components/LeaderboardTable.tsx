"use client";

import { Bookmark, ExternalLink, Star, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import LogoAvatar from "./LogoAvatar";

interface LeaderboardTableProps {
  tab: "tools" | "models" | "companies";
  items: any[];
  savedIds: string[];
  toggleSave: (id: string) => void;
  language?: "en" | "hi";
}

// Translations for table headings
const TABLE_TRANS: Record<string, Record<string, string>> = {
  en: {
    rank: "Rank",
    tool: "Tool",
    model: "Model",
    company: "Company",
    tags: "Tags",
    context: "Context",
    products: "Products",
    visits: "Monthly Visits",
    hits: "Monthly Hits",
    traffic: "Monthly Traffic",
    growth: "Growth",
    visit: "Action",
    visitLabel: "Visit",
    open: "Open",
  },
  hi: {
    rank: "रैंक",
    tool: "टूल",
    model: "मॉडल",
    company: "कंपनी",
    tags: "टैग्स",
    context: "संदर्भ",
    products: "उत्पाद",
    visits: "मासिक विज़िट्स",
    hits: "मासिक हिट्स",
    traffic: "मासिक ट्रैफ़िक",
    growth: "विकास",
    visit: "एक्शन",
    visitLabel: "वेबसाइट",
    open: "ओपन",
  }
};

const pricingTranslation = (pricing: string, lang: string) => {
  if (lang !== "hi") return pricing;
  if (pricing.toLowerCase() === "freemium") return "फ्रीमियम";
  if (pricing.toLowerCase() === "free") return "मुफ़्त";
  if (pricing.toLowerCase() === "paid") return "पेड";
  return pricing;
};

// Dynamic helper to format numbers into clean metric units (e.g. Millions, Billions)
const formatNumber = (num: number) => {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toString();
};

// Fallback domains for models and companies to generate visit URLs
const RESOLVE_DOMAINS: Record<string, string> = {
  "OpenAI": "openai.com",
  "Anthropic": "anthropic.com",
  "Google DeepMind": "deepmind.com",
  "Google": "google.com",
  "Mistral AI": "mistral.ai",
  "Mistral AI SAS": "mistral.ai",
  "Meta AI": "meta.ai",
  "Meta": "meta.com",
  "xAI": "x.ai",
  "DeepSeek": "deepseek.com",
  "Hugging Face": "huggingface.co",
  "Hugging Face Inc": "huggingface.co",
  "Cohere": "cohere.com",
  "Scale AI": "scale.com",
  "Scale AI Inc": "scale.com",
  "Together AI": "together.ai",
  "Stability AI": "stability.ai",
  "Black Forest Labs": "blackforestlabs.ai",
  "Perplexity AI": "perplexity.ai",
  "Cursor (Anysphere)": "cursor.com",
  "Vercel": "vercel.com",
  "LangChain": "langchain.com",
  "LlamaIndex": "llamaindex.ai",
  "Pinecone": "pinecone.io",
  "Weaviate": "weaviate.io",
  "Qdrant": "qdrant.tech",
  "Chroma DB": "trychroma.com",
  "Weights & Biases": "wandb.ai",
  "Replit": "replit.com",
  "Cognition AI": "cognition.ai",
  "ElevenLabs": "elevenlabs.io",
  "Suno AI": "suno.com",
  "Udio Music": "udio.com",
  "Runway": "runwayml.com",
  "Luma Labs": "lumalabs.ai",
  "Pika Labs": "pika.art",
  "HeyGen Avatars": "heygen.com",
  "Synthesia Video": "synthesia.io",
  "Midjourney Inc": "midjourney.com",
  "Character AI": "character.ai",
  "Inflection AI": "inflection.ai",
  "CoreWeave": "coreweave.com",
  "Lambda Labs": "lambdalabs.com",
  "RunPod": "runpod.io",
  "Braintrust": "braintrust.dev",
  "Langfuse": "langfuse.com",
  "Julius AI Inc": "julius.ai",
  "Photoroom SAS": "photoroom.com",
  "Consensus App": "consensus.app",
  "Gamma App Inc": "gamma.app",
  "Tome Inc": "tome.app",
  "Descript Inc": "descript.com",
  "DeepL SE": "deepl.com",
  "AssemblyAI": "assemblyai.com",
  "Otter.ai Inc": "otter.ai",
  "Fathom Video": "fathom.video",
  "Fireflies AI": "fireflies.ai",
  "Anyscale": "anyscale.com",
  "Microsoft": "microsoft.com",
  "Alibaba Cloud": "alibaba.com"
};

const getItemUrl = (item: any, tab: string) => {
  if (item.url) return item.url;
  const domain = RESOLVE_DOMAINS[item.name] || RESOLVE_DOMAINS[item.provider];
  return domain ? `https://${domain}` : "";
};

export default function LeaderboardTable({
  tab,
  items,
  savedIds,
  toggleSave,
  language = "en",
}: LeaderboardTableProps) {
  if (items.length === 0) return null;

  const t = TABLE_TRANS[language] || TABLE_TRANS.en;

  return (
    <div className="hidden md:block w-full overflow-hidden rounded-xl border border-[#1c1c1e] bg-[#0c0c0d]/30 backdrop-blur-md">
      <table className="w-full text-left border-collapse table-fixed">
        <thead>
          <tr className="border-b border-[#1c1c1e] bg-[#0d0d0d]/60 text-xs font-semibold text-white uppercase tracking-wider font-mono select-none">
            <th className="py-4 px-6 text-center w-[8%] whitespace-nowrap">{t.rank}</th>
            <th className="py-4 px-6 w-[36%] whitespace-nowrap">
              {tab === "tools" ? t.tool : tab === "models" ? t.model : t.company}
            </th>
            
            {tab === "tools" && (
              <th className="py-4 px-6 text-center w-[16%] whitespace-nowrap">{t.tags}</th>
            )}
            {tab === "models" && (
              <th className="py-4 px-6 text-center w-[16%] whitespace-nowrap">{t.context}</th>
            )}
            {tab === "companies" && (
              <th className="py-4 px-6 text-center w-[16%] whitespace-nowrap">{t.products}</th>
            )}

            <th className="py-4 px-6 text-right w-[16%] whitespace-nowrap">
              {tab === "tools" ? t.visits : tab === "models" ? t.hits : t.traffic}
            </th>
            <th className="py-4 px-6 text-right w-[12%] whitespace-nowrap">{t.growth}</th>
            <th className="py-4 px-6 text-center w-[12%] whitespace-nowrap">{t.visit}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1c1c1e] text-sm font-sans">
          {items.map((item) => {
            const isSaved = savedIds.includes(item.id);
            const visits = item.visits || "0";
            const isPositive = (item.growth || 0) >= 0;
            const rankStr = item.rank <= 3 ? (item.rank === 1 ? "🥇 #1" : item.rank === 2 ? "🥈 #2" : "🥉 #3") : `#${item.rank}`;

            // Format metadata string
            let metadataStr = "";
            if (tab === "tools") {
              const pricingStr = pricingTranslation(item.pricing, language);
              metadataStr = `${item.category} • ${pricingStr}`;
            } else if (tab === "models") {
              metadataStr = `${item.provider} • ${item.contextWindow}`;
            } else if (tab === "companies") {
              metadataStr = `${item.headquarters} • ${item.funding}`;
            }

            const itemUrl = getItemUrl(item, tab);

            return (
              <tr
                key={item.id}
                className="border-b border-[#1c1c1e]/60 hover:bg-white/[0.01] transition-all duration-150 cursor-pointer group"
                onClick={() => {
                  if (itemUrl) window.open(itemUrl, "_blank");
                }}
              >
                {/* 1. Rank Position Column */}
                <td className="py-5 px-6 text-center font-mono font-bold text-white/80 whitespace-nowrap">
                  {rankStr}
                </td>

                {/* 2. Tool / Info Column */}
                <td className="py-5 px-6 min-w-0">
                  <div className="flex items-start gap-4">
                    <LogoAvatar name={item.name} item={item} tab={tab} />
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-[15px] leading-tight truncate group-hover:text-white/95">
                          {item.name}
                        </span>
                        {tab === "models" && item.openSource && (
                          <span className="text-[9px] font-semibold bg-white/10 text-white px-1.5 py-0.2 rounded border border-white/20">
                            {t.open}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/70 mt-0.5 truncate w-full max-w-[340px] leading-relaxed">
                        {item.description}
                      </p>
                      <span className="text-[10px] text-white/40 font-semibold font-mono tracking-wider uppercase mt-1 leading-none">
                        {metadataStr}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 3. Tab Specific Column */}
                {tab === "tools" && (
                  <td className="py-5 px-6 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                      {item.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] bg-white/5 text-white/70 border border-white/10 px-2 py-0.5 rounded leading-none font-medium whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                )}
                {tab === "models" && (
                  <td className="py-5 px-6 text-center whitespace-nowrap text-xs text-white/70 font-mono">
                    {item.contextWindow}
                  </td>
                )}
                {tab === "companies" && (
                  <td className="py-5 px-6 text-center whitespace-nowrap text-xs text-white/70 font-mono">
                    {item.productsCount}
                  </td>
                )}

                {/* 4. Monthly Visits Column */}
                <td className="py-5 px-6 text-right font-mono font-semibold text-white whitespace-nowrap">
                  {visits}
                </td>

                {/* 5. Growth Column */}
                <td className={`py-5 px-6 text-right font-mono font-bold whitespace-nowrap text-xs ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                  {isPositive ? "▲" : "▼"} {isPositive ? "+" : ""}{item.growth}%
                </td>

                {/* 6. Visit Action Column */}
                <td className="py-5 px-6 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-3.5">
                    {/* Bookmark Save Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(item.id);
                      }}
                      className="flex items-center justify-center p-1.5 rounded-md text-[#888888] hover:text-white hover:bg-white/5 transition-all select-none focus:outline-none"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-white text-white scale-110 animate-pulse" : "text-white/20 hover:text-white/60"}`} />
                    </button>

                    {itemUrl && (
                      <span className="inline-flex items-center text-xs font-semibold text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 select-none">
                        <span>{t.visitLabel}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 shrink-0" />
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
