"use client";

import { useState } from "react";

interface LogoAvatarProps {
  name: string;
  item: any;
  tab: "tools" | "models" | "companies";
}

const PROVIDER_DOMAINS: Record<string, string> = {
  "Anthropic": "anthropic.com",
  "OpenAI": "openai.com",
  "Google": "google.com",
  "Meta": "meta.com",
  "Mistral AI": "mistral.ai",
  "Alibaba Cloud": "alibaba.com",
  "DeepSeek": "deepseek.com",
  "xAI": "x.ai",
  "Microsoft": "microsoft.com",
  "Cohere": "cohere.com"
};

const COMPANY_DOMAINS: Record<string, string> = {
  "OpenAI": "openai.com",
  "Anthropic": "anthropic.com",
  "Google DeepMind": "deepmind.com",
  "Mistral AI": "mistral.ai",
  "Meta AI": "meta.com",
  "xAI": "x.ai",
  "DeepSeek": "deepseek.com",
  "Hugging Face": "huggingface.co",
  "Cohere": "cohere.com",
  "Scale AI": "scale.com",
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
  "Hugging Face Inc": "huggingface.co",
  "Mistral AI SAS": "mistral.ai",
  "Scale AI Inc": "scale.com"
};

const getLogoColor = (name: string) => {
  const char = name.charAt(0).toUpperCase();
  if (char >= "A" && char <= "G") return "text-white bg-white/5 border-white/10";
  if (char >= "H" && char <= "O") return "text-white bg-white/5 border-white/10";
  if (char >= "P" && char <= "T") return "text-white bg-white/5 border-white/10";
  return "text-white bg-white/5 border-white/10";
};

export default function LogoAvatar({ name, item, tab }: LogoAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const firstLetter = name.charAt(0).toUpperCase();

  // Resolve target brand domain
  let domain = "";
  if (tab === "tools" && item.url) {
    try {
      const urlObj = new URL(item.url);
      domain = urlObj.hostname.replace("www.", "");
    } catch {
      domain = "";
    }
  } else if (tab === "models" && item.provider) {
    domain = PROVIDER_DOMAINS[item.provider] || "";
  } else if (tab === "companies") {
    domain = COMPANY_DOMAINS[name] || COMPANY_DOMAINS[item.name] || "";
  }

  // Use Google s2 favicon service if we resolved a domain, otherwise trigger fallback immediately
  const logoUrl = domain
    ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}`
    : "";

  return (
    <div
      className={`w-12 h-12 rounded-none border flex items-center justify-center text-sm font-bold font-mono shrink-0 overflow-hidden select-none transition-all duration-300 ${
        hasError || !logoUrl
          ? getLogoColor(name)
          : "bg-white/5 border-white/10 hover:border-white/20 p-2"
      }`}
    >
      {logoUrl && !hasError ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="w-full h-full object-contain filter brightness-95 hover:brightness-100 transition-all"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        <span>{firstLetter}</span>
      )}
    </div>
  );
}
