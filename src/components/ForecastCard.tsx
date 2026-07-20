/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ForecastDay } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";
import { getWeatherCondition, formatDateLabel } from "../utils/weatherUtils";

interface ForecastCardProps {
  day: ForecastDay;
  isFahrenheit: boolean;
  isToday: boolean;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  day,
  isFahrenheit,
  isToday,
}) => {
  const { date, dayOfWeek, weatherCode, tempMax, tempMin, condition } = day;
  const conditionInfo = getWeatherCondition(weatherCode);

  // Convert temperatures if requested
  const displayMax = isFahrenheit
    ? Math.round((tempMax * 9) / 5 + 32)
    : Math.round(tempMax);

  const displayMin = isFahrenheit
    ? Math.round((tempMin * 9) / 5 + 32)
    : Math.round(tempMin);

  // Dynamic subtle highlight styles for Today
  const cardBorder = isToday
    ? "border-indigo-500/40 bg-indigo-950/20 shadow-lg ring-1 ring-indigo-500/10"
    : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70";

  return (
    <div
      className={`border rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-200 ${cardBorder}`}
      id={`forecast-card-${date}`}
    >
      {/* Day and Date Title */}
      <div className="space-y-0.5 mb-3" id="forecast-date-group">
        <p className="font-sans font-semibold text-zinc-200 text-sm" id="forecast-day-label">
          {isToday ? "Today" : dayOfWeek}
        </p>
        <p className="font-sans text-xs text-zinc-500 font-mono" id="forecast-subdate">
          {formatDateLabel(date)}
        </p>
      </div>

      {/* Forecast Icon */}
      <div
        className={`p-3 rounded-xl mb-3 ${
          isToday ? "bg-indigo-950/50 text-indigo-400 border border-indigo-900/30" : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/30"
        }`}
        id="forecast-icon-bg"
      >
        <WeatherIcon name={conditionInfo.icon} size={28} id={`forecast-icon-${date}`} />
      </div>

      {/* Temp High / Low block */}
      <div className="flex items-baseline justify-center gap-2 mb-2" id="forecast-temp-group">
        <span className="font-sans font-bold text-zinc-100 text-base" id="forecast-high-temp">
          {displayMax}°
        </span>
        <span className="font-sans text-zinc-400 text-xs" id="forecast-low-temp">
          {displayMin}°
        </span>
      </div>

      {/* Small Condition text */}
      <p className="font-sans text-[11px] font-medium text-zinc-400 max-w-[120px] line-clamp-1" id="forecast-condition-desc">
        {condition}
      </p>
    </div>
  );
};
