/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { searchCities } from "../services/api";
import { GeocodingResult } from "../types/weather";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  placeholder = "Search for any city, place or country...",
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const results = await searchCities(trimmed);
        setSuggestions(results);
        setIsDropdownOpen(results.length > 0);
        setActiveSuggestionIndex(-1);
      } catch (err) {
        console.error("Autocomplete fetch failed:", err);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
      setIsDropdownOpen(false);
    }
  };

  const handleSelectSuggestion = (suggestion: GeocodingResult) => {
    setQuery(suggestion.name);
    onSearch(suggestion.name);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsDropdownOpen(true);
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[activeSuggestionIndex]);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative" ref={dropdownRef} id="search-bar-wrapper">
      <form
        onSubmit={handleSubmit}
        className="w-full"
        id="weather-search-form"
      >
        <div className="relative flex items-center bg-zinc-900 rounded-full border border-zinc-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200">
          <div className="absolute left-5 text-zinc-500 flex items-center">
            {isSearchingSuggestions ? (
              <Loader2 size={18} className="animate-spin text-indigo-400" id="search-spinner-svg" />
            ) : (
              <Search size={18} id="search-icon-svg" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setIsDropdownOpen(true);
              }
            }}
            placeholder={placeholder}
            disabled={isLoading}
            id="search-city-input"
            className="w-full pl-13 pr-32 py-3.5 bg-transparent rounded-full text-zinc-200 placeholder-zinc-500 font-sans text-sm outline-none disabled:text-zinc-500"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            id="search-submit-btn"
            className="absolute right-2 px-6 py-2 rounded-full font-sans font-medium text-xs transition-all duration-200 flex items-center justify-center gap-1.5
              enabled:bg-indigo-600 enabled:text-white enabled:hover:bg-indigo-500 enabled:active:scale-95
              disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <svg
                  className="animate-spin h-3 w-3 text-zinc-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    path-id="search-loading-path"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Searching</span>
              </span>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>
      </form>

      {/* Floating autocomplete suggestions list */}
      {isDropdownOpen && suggestions.length > 0 && (
        <div
          id="search-suggestions-dropdown"
          className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto animate-fade-in"
        >
          {suggestions.map((suggestion, index) => {
            const isSelected = index === activeSuggestionIndex;
            const region = [suggestion.admin1, suggestion.country].filter(Boolean).join(", ");
            
            return (
              <button
                key={`${suggestion.latitude}-${suggestion.longitude}-${index}`}
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={() => setActiveSuggestionIndex(index)}
                id={`suggestion-item-${index}`}
                className={`w-full px-5 py-3 text-left flex items-center justify-between transition-colors cursor-pointer border-b border-zinc-800/40 last:border-0 ${
                  isSelected ? "bg-indigo-600/10 text-indigo-400" : "text-zinc-300 hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={14} className={isSelected ? "text-indigo-400" : "text-zinc-500"} />
                  <div>
                    <span className="font-sans text-sm font-semibold">{suggestion.name}</span>
                    {region && (
                      <span className="font-sans text-xs text-zinc-500 ml-2">
                        {region}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-zinc-500 hidden sm:inline">
                  {suggestion.latitude.toFixed(2)}°, {suggestion.longitude.toFixed(2)}°
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
