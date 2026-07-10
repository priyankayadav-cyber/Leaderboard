"use client";

import { useMemo } from "react";

interface SparklineProps {
  history: number[];
  width?: number;
  height?: number;
}

export default function Sparkline({
  history,
  width = 80,
  height = 24,
}: SparklineProps) {
  const { pathData, isUpward, gradientId } = useMemo(() => {
    if (!history || history.length < 2) {
      return { pathData: "", isUpward: true, gradientId: "" };
    }

    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;

    const points = history.map((val, index) => {
      const x = (index / (history.length - 1)) * width;
      // Invert Y so higher values are closer to the top (Y=0)
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return { x, y };
    });

    // Generate SVG path using cubic bezier smoothing
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    const isUp = history[history.length - 1] >= history[0];
    const gradId = `spark-grad-${Math.random().toString(36).substr(2, 9)}`;

    return { pathData: path, isUpward: isUp, gradientId: gradId };
  }, [history, width, height]);

  if (!pathData) return null;

  const strokeColor = isUpward ? "#10b981" : "#f43f5e"; // Emerald green vs Rose red
  const stopColor = isUpward ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)";

  return (
    <div className="flex items-center justify-center">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stopColor} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Fill Area */}
        <path
          d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
          fill={`url(#${gradientId})`}
          stroke="none"
        />

        {/* Stroke Line */}
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
}
