/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { SearchBar } from "./components/SearchBar";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";
import { ForecastGrid } from "./components/ForecastGrid";
import { RecommendationCard } from "./components/RecommendationCard";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorMessage } from "./components/ErrorMessage";
import { fetchWeather } from "./services/api";
import { WeatherResponse } from "./types/weather";
import { CloudSun, Sun, History, Thermometer, MapPin } from "lucide-react";

const RECENT_CITIES_KEY = "weather_intel_recent_cities";
const UNIT_PREF_KEY = "weather_intel_unit_fahrenheit";
const DEFAULT_CITY = "Paris";

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Persistence state
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isFahrenheit, setIsFahrenheit] = useState<boolean>(false);
  const [currentSearch, setCurrentSearch] = useState<string>(DEFAULT_CITY);

  // Initialize preferences on mount
  useEffect(() => {
    // Load unit preference
    const storedUnit = localStorage.getItem(UNIT_PREF_KEY);
    if (storedUnit) {
      setIsFahrenheit(storedUnit === "true");
    }

    // Load recent city list
    const storedHistory = localStorage.getItem(RECENT_CITIES_KEY);
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSearchHistory(parsed);
          // Auto-fetch the most recently searched city
          const lastCity = parsed[0];
          setCurrentSearch(lastCity);
          handleSearch(lastCity);
          return;
        }
      } catch (err) {
        console.error("Failed to load search history:", err);
      }
    }

    // Trigger default search if history is empty
    handleSearch(DEFAULT_CITY);
  }, []);

  /**
   * Action to perform weather search
   */
  const handleSearch = async (city: string) => {
    if (!city.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentSearch(city);

    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      
      // Update local storage history
      setSearchHistory((prev) => {
        const cleanName = data.current.city;
        const filtered = prev.filter((item) => item.toLowerCase() !== cleanName.toLowerCase());
        const updated = [cleanName, ...filtered].slice(0, 5); // Cache top 5 cities
        localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      console.error("Search failed:", err);
      setError(err.message || "Could not retrieve weather intelligence. Please confirm the city name.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggles the unit system and caches choice
   */
  const handleToggleUnit = () => {
    setIsFahrenheit((prev) => {
      const next = !prev;
      localStorage.setItem(UNIT_PREF_KEY, String(next));
      return next;
    });
  };

  /**
   * Clear search history logs
   */
  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(RECENT_CITIES_KEY);
  };

  const quickCities = ["New York", "London", "Tokyo", "Sydney", "Cairo"];

  return (
    <div
      className="min-h-screen bg-[#0a0a0c] text-zinc-100 pb-16 antialiased flex flex-col"
      id="app-root-container"
    >
      {/* Top Banner Branding Header */}
      <header
        className="w-full bg-[#0a0a0c]/80 border-b border-zinc-900 sticky top-0 z-40 backdrop-blur-md"
        id="app-header-bar"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between" id="header-inner">
          <div className="flex items-center gap-2.5" id="header-logo-group">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20" id="logo-icon-bg">
              <CloudSun size={22} id="logo-weather-icon" />
            </div>
            <div>
              <h1 className="font-sans font-extrabold text-zinc-100 tracking-tight text-base flex items-center gap-1" id="app-main-title">
                Weather<span className="text-indigo-400">Intel</span>
              </h1>
              <p className="font-sans text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
                Meteorological Insights v2.4
              </p>
            </div>
          </div>

          {/* Unit Toggle Quick-Control */}
          {weatherData && (
            <button
              onClick={handleToggleUnit}
              id="header-unit-toggle"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-full text-xs font-sans font-semibold transition-all duration-150 border border-zinc-800"
            >
              <Thermometer size={14} className="text-indigo-400" />
              <span>Convert to °{isFahrenheit ? "C" : "F"}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main dashboard content workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8" id="dashboard-main-view">
        
        {/* Search Header Section */}
        <section className="text-center space-y-5" id="search-section">
          <div className="space-y-2" id="search-prompt-header">
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-zinc-100 tracking-tight" id="search-prompt-title">
              Where do you want to analyze today?
              <span className="text-indigo-400 font-mono text-xs ml-2 bg-indigo-950/50 border border-indigo-900/40 px-2 py-0.5 rounded-md align-middle">Beta</span>
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed" id="search-prompt-desc">
              Input any global destination to pull high-precision geocoded forecasts, condition advisories, and instant clothing/safety warnings.
            </p>
          </div>

          {/* SearchBar Input */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {/* Quick-pill major hub shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1" id="quick-pills-row">
            <span className="text-xs text-zinc-500 font-sans font-medium flex items-center gap-1">
              <Sun size={12} className="text-indigo-400" />
              <span>Popular Hubs:</span>
            </span>
            {quickCities.map((city) => (
              <button
                key={city}
                onClick={() => !isLoading && handleSearch(city)}
                disabled={isLoading}
                id={`quick-pill-${city.toLowerCase().replace(" ", "-")}`}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-indigo-600/20 hover:text-indigo-400 hover:border-indigo-500/50 disabled:opacity-50 border border-zinc-800 text-zinc-400 rounded-full text-xs font-sans font-semibold transition-all duration-150 cursor-pointer"
              >
                {city}
              </button>
            ))}
          </div>
        </section>

        {/* Dashboard workspace display states */}
        <section className="space-y-8 min-h-[300px] flex flex-col justify-start" id="dashboard-viewports">
          {isLoading && (
            <div className="flex-1 flex items-center justify-center my-12" id="loading-state-view">
              <LoadingSpinner message={`Querying geocoding arrays and retrieving atmospheric forecasts for "${currentSearch}"...`} />
            </div>
          )}

          {error && !isLoading && (
            <div id="error-state-view" className="animate-fade-in">
              <ErrorMessage message={error} onRetry={() => handleSearch(currentSearch)} />
            </div>
          )}

          {!isLoading && !error && weatherData && (
            <div className="space-y-8 animate-fade-in" id="dashboard-results-container">
              
              {/* Primary Rows: Weather Card and Recommendation */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="primary-metrics-dashboard">
                {/* 1. Large Current Weather Detail */}
                <div className="lg:col-span-7 flex" id="current-card-cell">
                  <CurrentWeatherCard
                    weather={weatherData.current}
                    isFahrenheit={isFahrenheit}
                    onToggleUnit={handleToggleUnit}
                  />
                </div>

                {/* 2. Advisory Intelligence Card */}
                <div className="lg:col-span-5 flex" id="recommendation-card-cell">
                  <RecommendationCard
                    recommendation={weatherData.recommendation}
                    cityName={weatherData.current.city}
                  />
                </div>
              </div>

              {/* 3. 7-Day Long range forecast Grid */}
              <div className="bg-zinc-900/10 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm" id="long-range-forecast-section">
                <ForecastGrid forecast={weatherData.forecast} isFahrenheit={isFahrenheit} />
              </div>

              {/* 4. Search History Drawer (Footer utility helper) */}
              {searchHistory.length > 1 && (
                <div
                  className="bg-zinc-900/30 rounded-2xl p-4 border border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  id="search-history-drawer"
                >
                  <div className="flex items-center gap-2 text-zinc-400" id="history-header">
                    <History size={16} className="text-indigo-400" />
                    <span className="font-sans font-medium text-xs text-zinc-400">Recent Searches:</span>
                    <div className="flex flex-wrap gap-2 ml-1" id="history-pills">
                      {searchHistory.map((city, idx) => (
                        <button
                          key={city + idx}
                          onClick={() => handleSearch(city)}
                          id={`history-pill-${idx}`}
                          className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-sans font-medium hover:text-indigo-400 hover:border-indigo-500/50 transition-all cursor-pointer"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleClearHistory}
                    id="clear-history-btn"
                    className="text-xs font-sans font-semibold text-zinc-500 hover:text-rose-400 transition-all self-end sm:self-auto cursor-pointer"
                  >
                    Clear History
                  </button>
                </div>
              )}

            </div>
          )}
        </section>
      </main>

      {/* Global minimal footer copyright */}
      <footer className="w-full text-center py-6 border-t border-zinc-900 text-xs text-zinc-600 mt-auto" id="global-dashboard-footer">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2 font-sans">
          <div>Open-Meteo API • Powered by WeatherIntel Server v2.4</div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-semibold uppercase tracking-wider text-[10px]">Server Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Active Session</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
