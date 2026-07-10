"use client";

import { Bookmark, ExternalLink, Star, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import LogoAvatar from "./LogoAvatar";

interface LeaderboardCardProps {
  tab: "tools" | "models" | "companies";
  items: any[];
  savedIds: string[];
  toggleSave: (id: string) => void;
  language?: "en" | "hi";
}

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

export default function LeaderboardCard({
  tab,
  items,
  savedIds,
  toggleSave,
  language = "en",
}: LeaderboardCardProps) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 font-sans select-text">
      {items.map((item) => {
        const visits = item.visits || "0";
        const isPositive = (item.growth || 0) >= 0;
        const rankStr = item.rank <= 3 ? (item.rank === 1 ? "🥇 #1" : item.rank === 2 ? "🥈 #2" : "🥉 #3") : `#${item.rank}`;
        const isSaved = savedIds.includes(item.id);

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
          <div
            key={item.id}
            className="rounded-xl border border-[#1c1c1e] bg-[#0c0c0d]/40 p-5 hover:border-[#1c1c1e]/80 transition-all duration-200 cursor-pointer flex flex-col gap-3.5"
            onClick={() => {
              if (itemUrl) window.open(itemUrl, "_blank");
            }}
          >
            {/* Rank badge */}
            <div className="text-xs font-mono font-bold text-white select-none">
              {rankStr}
            </div>

            {/* Logo + Title Stack */}
            <div className="flex items-center gap-3.5">
              <LogoAvatar name={item.name} item={item} tab={tab} />
              
              <div className="min-w-0">
                <h3 className="font-bold text-white text-[15px] leading-tight truncate">
                  {item.name}
                </h3>
                <span className="text-[10px] text-white/40 font-semibold font-mono tracking-wider uppercase mt-1 block">
                  {metadataStr}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-white/70 leading-relaxed max-w-md">
              {item.description}
            </p>

            {/* Metrics Row (Visits, Growth & Actions combined) */}
            <div className="flex items-center justify-between border-t border-[#1c1c1e] pt-3 mt-1.5 text-xs select-none">
              <div className="flex items-center gap-3.5">
                {/* Traffic */}
                <span className="font-mono font-bold text-white">
                  {visits} {tab === "tools" 
                    ? (language === "hi" ? "विज़िट्स" : "Visits") 
                    : tab === "models" 
                      ? (language === "hi" ? "हिट्स" : "Hits") 
                      : (language === "hi" ? "यूज़र्स" : "Users")}
                </span>
                
                <span className="w-1 h-1 rounded-full bg-white/20" />

                {/* Growth */}
                <span className={`font-mono font-bold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                  {isPositive ? "▲" : "▼"} {isPositive ? "+" : ""}{item.growth}%
                </span>
              </div>

              {/* Action Column */}
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(item.id);
                  }}
                  className="flex items-center justify-center p-1 rounded-md text-[#888888] hover:text-white hover:bg-white/5 transition-all select-none focus:outline-none"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-white text-white scale-110" : "text-white/20"}`} />
                </button>

                {itemUrl && (
                  <span className="inline-flex items-center text-xs font-semibold text-white/60 group-hover:text-white transition-all select-none">
                    <span>{language === "hi" ? "वेबसाइट" : "Visit"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 shrink-0" />
                  </span>
                )}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
