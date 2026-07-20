/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WeatherResponse, GeocodingResult } from "../types/weather";

/**
 * Fetches combined weather intelligence data for a specified city.
 */
export async function fetchWeather(city: string): Promise<WeatherResponse> {
  const trimmed = city.trim();
  if (!trimmed) {
    throw new Error("City name cannot be empty.");
  }

  // Use relative URL to target the same Express+Vite development/production server
  const url = `/api/weather?city=${encodeURIComponent(trimmed)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || `Failed to fetch weather for "${trimmed}" (Status ${response.status})`);
    }

    return result.data as WeatherResponse;
  } catch (error: any) {
    console.error("API service error:", error);
    throw new Error(error.message || "An error occurred while connecting to the weather service.");
  }
}

/**
 * Searches for cities/places matching a query.
 */
export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `/api/weather/search?q=${encodeURIComponent(trimmed)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch city suggestions.");
    }

    return result.data as GeocodingResult[];
  } catch (error: any) {
    console.error("Search API service error:", error);
    return [];
  }
}
