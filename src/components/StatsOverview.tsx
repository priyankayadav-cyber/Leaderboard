"use client";

import { Cpu, Globe, Flame, BarChart3 } from "lucide-react";

interface StatsOverviewProps {
  stats?: {
    totalTools: number;
    totalModels: number;
    totalCompanies: number;
    totalVotes: number;
    hotCategory: string;
  };
  isLoading: boolean;
}

export default function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 select-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="glass-panel rounded-xl p-4 md:p-5 border border-card-border animate-shimmer min-h-[96px] md:min-h-[110px]"
          />
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: "Global Traffic Vol",
      value: "4.8B",
      icon: Globe,
      color: "text-accent-blue bg-accent-blue/10",
      description: "Monthly visits across tracked platforms",
    },
    {
      label: "Avg Growth Velocity",
      value: "+42.5%",
      icon: BarChart3,
      color: "text-accent-blue bg-accent-blue/10",
      description: "Average weekly growth rate",
    },
    {
      label: "Mapped Categories",
      value: "12",
      icon: Cpu,
      color: "text-accent-blue bg-accent-blue/10",
      description: "Sectors mapped in search engine",
    },
    {
      label: "Trending Category",
      value: stats.hotCategory,
      icon: Flame,
      color: "text-accent-blue bg-accent-blue/10",
      description: "Highest weekly user activity",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 select-none">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="glass-panel relative rounded-xl p-4 md:p-5 border border-card-border hover:border-card-border/80 transition-all duration-300 group overflow-hidden flex flex-col justify-between"
        >
          {/* Subtle gradient light background glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-muted-text/80 tracking-wide uppercase">
                {item.label}
              </span>
              <div className={`p-1.5 rounded-lg ${item.color}`}>
                <item.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            
            <div className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white leading-none mt-1">
              {item.value}
            </div>
          </div>
          
          <p className="text-[10px] text-muted-text mt-3 font-sans leading-normal">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
