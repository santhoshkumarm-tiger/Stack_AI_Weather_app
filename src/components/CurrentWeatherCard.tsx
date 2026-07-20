/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CurrentWeather } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";
import { Wind, Compass, MapPin } from "lucide-react";
import { getWeatherCondition } from "../utils/weatherUtils";

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  isFahrenheit: boolean;
  onToggleUnit: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  isFahrenheit,
  onToggleUnit,
}) => {
  const { city, country, temperature, windSpeed, weatherCode, latitude, longitude, condition } = weather;
  const conditionInfo = getWeatherCondition(weatherCode);

  // Temperature unit conversion helper
  const displayTemp = isFahrenheit
    ? Math.round((temperature * 9) / 5 + 32)
    : Math.round(temperature);

  // Choose subtle weather-dependent accent backgrounds and glow parameters
  let bgGlow = "bg-indigo-500/10";
  let iconBg = "bg-indigo-950/40 text-indigo-400 border border-indigo-900/50";
  let textAccent = "text-indigo-400";

  if (conditionInfo.severity === "danger") {
    bgGlow = "bg-rose-500/10";
    iconBg = "bg-rose-950/40 text-rose-400 border border-rose-900/50";
    textAccent = "text-rose-400";
  } else if (conditionInfo.severity === "warning") {
    bgGlow = "bg-amber-500/10";
    iconBg = "bg-amber-950/40 text-amber-400 border border-amber-900/50";
    textAccent = "text-amber-400";
  } else if (conditionInfo.severity === "success") {
    bgGlow = "bg-emerald-500/10";
    iconBg = "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50";
    textAccent = "text-emerald-400";
  }

  return (
    <div
      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-300 hover:shadow-md relative overflow-hidden"
      id="current-weather-card"
    >
      {/* Decorative Blur Glow matching mock theme */}
      <div className={`absolute top-0 right-0 w-64 h-64 ${bgGlow} blur-[80px] -mr-20 -mt-20 pointer-events-none`}></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10" id="card-content-wrapper">
        
        {/* Left Section: City & Primary details */}
        <div className="space-y-4 flex-1">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono" id="coordinates-badge">
              <MapPin size={12} className="text-indigo-400" />
              <span>{latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-zinc-100 tracking-tight flex items-baseline gap-2" id="city-title">
              {city}
              {country && (
                <span className="text-lg md:text-xl font-medium text-zinc-400" id="country-span">
                  , {country}
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${iconBg} shadow-sm shrink-0`} id="large-weather-icon-wrapper">
              <WeatherIcon name={conditionInfo.icon} size={44} id="large-condition-icon" />
            </div>
            <div>
              <p className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest" id="condition-subtitle">
                Current Condition
              </p>
              <p className={`text-xl md:text-2xl font-sans font-bold ${textAccent}`} id="condition-text">
                {condition}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Large Temperature & Toggle */}
        <div className="flex flex-col items-start md:items-end justify-center min-w-[150px] space-y-3 shrink-0">
          <div className="flex items-start" id="temperature-display">
            <span className="text-6xl md:text-7xl font-sans font-extrabold text-zinc-100 tracking-tighter" id="temp-number">
              {displayTemp}
            </span>
            <span className="text-2xl md:text-3xl font-sans font-bold text-indigo-400 mt-1" id="temp-unit">
              °{isFahrenheit ? "F" : "C"}
            </span>
          </div>

          {/* Unit Toggle Switch */}
          <button
            onClick={onToggleUnit}
            id="temp-toggle-btn"
            className="px-3.5 py-1.5 bg-zinc-800/80 hover:bg-zinc-800 hover:text-zinc-100 active:scale-95 text-xs font-sans font-medium text-zinc-400 rounded-xl border border-zinc-700 shadow-xs flex items-center gap-1.5 transition-all duration-200"
          >
            <span>Switch to °{isFahrenheit ? "C" : "F"}</span>
          </button>
        </div>
      </div>

      {/* Footer Metrics Row */}
      <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-800/80 relative z-10" id="card-footer-metrics">
        
        {/* Metric 1: Wind Speed */}
        <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/50" id="wind-speed-metric">
          <div className="p-2 bg-zinc-800 text-indigo-400 rounded-xl" id="wind-icon-wrapper">
            <Wind size={18} />
          </div>
          <div>
            <p className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">
              Wind Speed
            </p>
            <p className="text-sm md:text-base font-sans font-bold text-zinc-200">
              {windSpeed} km/h
            </p>
          </div>
        </div>

        {/* Metric 2: Compass Weather Severity */}
        <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/50" id="severity-metric">
          <div className={`p-2 rounded-xl bg-zinc-800 ${textAccent}`} id="severity-icon-wrapper">
            <Compass size={18} />
          </div>
          <div>
            <p className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">
              Advisory Level
            </p>
            <p className="text-sm md:text-base font-sans font-bold text-zinc-200 capitalize">
              {conditionInfo.severity === "success" ? "Optimal" : conditionInfo.severity === "info" ? "Moderate" : conditionInfo.severity}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
