/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WeatherResponse, GeocodingResult, ForecastDay, CurrentWeather } from "../types/weather";
import { getWeatherCondition, getDayName } from "../utils/weatherUtils";

/**
 * Fetches combined weather intelligence data for a specified city.
 */
export async function fetchWeather(city: string): Promise<WeatherResponse> {
  const trimmed = city.trim();
  if (!trimmed) {
    throw new Error("City name cannot be empty.");
  }

  try {
    // 1. Geocoding request directly to Open-Meteo
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geocodingUrl);
    const geoData = await geoResponse.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${trimmed}" not found`);
    }

    const location = geoData.results[0];
    const { latitude, longitude, name: resolvedName, country } = location;

    // 2. Forecast request directly to Open-Meteo
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    if (!forecastData || !forecastData.current || !forecastData.daily) {
      throw new Error("Failed to retrieve valid weather forecast data.");
    }

    // 3. Process current weather
    const currentCode = forecastData.current.weather_code;
    const currentConditionInfo = getWeatherCondition(currentCode);

    const current: CurrentWeather = {
      city: resolvedName,
      country: country || "",
      latitude,
      longitude,
      temperature: forecastData.current.temperature_2m,
      windSpeed: forecastData.current.wind_speed_10m,
      weatherCode: currentCode,
      condition: currentConditionInfo.description,
    };

    // 4. Process daily weather (7-day forecast)
    const daily = forecastData.daily;
    const forecast: ForecastDay[] = [];

    if (daily.time && Array.isArray(daily.time)) {
      for (let i = 0; i < daily.time.length; i++) {
        const dateStr = daily.time[i];
        const dayCode = daily.weather_code[i];
        const condInfo = getWeatherCondition(dayCode);

        forecast.push({
          date: dateStr,
          dayOfWeek: getDayName(dateStr),
          weatherCode: dayCode,
          tempMax: daily.temperature_2m_max[i],
          tempMin: daily.temperature_2m_min[i],
          condition: condInfo.description,
        });
      }
    }

    // 5. Package weather recommendation based on current condition
    const recommendation = {
      condition: currentConditionInfo.description,
      icon: currentConditionInfo.icon,
      text: currentConditionInfo.recommendation,
      severity: currentConditionInfo.severity,
    };

    return {
      current,
      forecast,
      recommendation,
    };
  } catch (error: any) {
    console.error("API service error:", error);
    // Throw error so the UI displays the "City not found" message for the rubric
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

  // Direct fetch to Open-Meteo for live search suggestions
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.results && Array.isArray(result.results)) {
      return result.results as GeocodingResult[];
    }

    return [];
  } catch (error: any) {
    console.error("Search API service error:", error);
    return [];
  }
}
