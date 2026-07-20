/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WeatherRecommendation } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";
import { ShieldCheck, Info, AlertTriangle, AlertOctagon } from "lucide-react";

interface RecommendationCardProps {
  recommendation: WeatherRecommendation;
  cityName: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  cityName,
}) => {
  const { condition, icon, text, severity } = recommendation;

  // Determine styling based on recommendation severity
  let outerStyle = "bg-emerald-950/25 border-emerald-900/50 text-emerald-100";
  let iconBg = "bg-emerald-900/40 text-emerald-400 border border-emerald-800/50";
  let badgeStyle = "bg-emerald-900/40 text-emerald-400 border border-emerald-800/40";
  let titleText = "Optimal Conditions";
  let SeverityIndicatorIcon = ShieldCheck;

  if (severity === "info") {
    outerStyle = "bg-indigo-950/25 border-indigo-900/50 text-indigo-100";
    iconBg = "bg-indigo-900/40 text-indigo-400 border border-indigo-800/50";
    badgeStyle = "bg-indigo-900/40 text-indigo-400 border border-indigo-800/40";
    titleText = "Weather Insight";
    SeverityIndicatorIcon = Info;
  } else if (severity === "warning") {
    outerStyle = "bg-amber-950/25 border-amber-900/50 text-amber-100";
    iconBg = "bg-amber-900/40 text-amber-400 border border-amber-800/50";
    badgeStyle = "bg-amber-900/40 text-amber-400 border border-amber-800/40";
    titleText = "Safety Advisory";
    SeverityIndicatorIcon = AlertTriangle;
  } else if (severity === "danger") {
    outerStyle = "bg-rose-950/25 border-rose-900/50 text-rose-100";
    iconBg = "bg-rose-900/40 text-rose-400 border border-rose-800/50";
    badgeStyle = "bg-rose-900/40 text-rose-400 border border-rose-800/40";
    titleText = "Critical Warning";
    SeverityIndicatorIcon = AlertOctagon;
  }

  return (
    <div
      className={`border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6 transition-all duration-300 ${outerStyle} shadow-sm relative overflow-hidden`}
      id="recommendation-card"
    >
      {/* Dynamic Background Blur Glow */}
      <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20 rounded-full blur-2xl pointer-events-none bg-current"></div>

      {/* Decorative Icon Wrapper */}
      <div className={`p-4 rounded-2xl ${iconBg} shrink-0 shadow-sm flex items-center justify-center`} id="recommendation-icon-box">
        <WeatherIcon name={icon} size={36} id="recommendation-weather-icon" />
      </div>

      {/* Body text content */}
      <div className="flex-1 space-y-3" id="recommendation-details">
        <div className="flex flex-wrap items-center gap-2.5" id="recommendation-title-row">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase flex items-center gap-1.5 ${badgeStyle}`}
            id="recommendation-badge"
          >
            <SeverityIndicatorIcon size={12} />
            <span>{titleText}</span>
          </span>
          <span className="text-xs font-sans font-medium text-zinc-500 font-mono" id="recommendation-target-city">
            for {cityName}
          </span>
        </div>

        <div className="space-y-1.5" id="recommendation-text-content">
          <h4 className="text-lg md:text-xl font-sans font-bold text-zinc-100" id="recommendation-headline">
            Condition: {condition}
          </h4>
          <p className="text-sm md:text-base font-sans font-medium text-zinc-300 leading-relaxed" id="recommendation-desc">
            {text}
          </p>
        </div>

        {/* Dynamic helpful weather tip banner */}
        <div className="pt-2" id="weather-tip-footer">
          <p className="text-xs text-zinc-500 font-sans italic">
            *Tip: Atmospheric data fluctuates. We advise monitoring sudden localized shifts periodically.
          </p>
        </div>
      </div>
    </div>
  );
};
