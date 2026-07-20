/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ForecastDay } from "../types/weather";
import { ForecastCard } from "./ForecastCard";

interface ForecastGridProps {
  forecast: ForecastDay[];
  isFahrenheit: boolean;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast, isFahrenheit }) => {
  return (
    <div className="space-y-4" id="forecast-grid-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2" id="forecast-header">
        <div>
          <h3 className="font-sans font-bold text-zinc-100 text-lg" id="forecast-title">
            7-Day Atmospheric Outlook
          </h3>
          <p className="font-sans text-xs text-zinc-500" id="forecast-subtitle">
            Long-range projections of regional weather conditions
          </p>
        </div>
        <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-sans font-bold text-indigo-400 uppercase tracking-widest self-start" id="forecast-badge">
          7 Days Projections
        </div>
      </div>

      {/* Grid wrapper */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4"
        id="forecast-cards-grid"
      >
        {forecast.map((day, index) => (
          <ForecastCard
            key={day.date}
            day={day}
            isFahrenheit={isFahrenheit}
            isToday={index === 0} // First index corresponds to today in typical forecast sequence
          />
        ))}
      </div>
    </div>
  );
};
