/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from "axios";
import { WeatherResponse, ForecastDay, CurrentWeather, GeocodingResult } from "../../../src/types/weather";
import { getWeatherCondition, getDayName } from "../../../src/utils/weatherUtils";

export class WeatherService {
  /**
   * Fetch weather data for a city by name
   */
  public static async getWeatherForCity(cityName: string): Promise<WeatherResponse> {
    if (!cityName || cityName.trim() === "") {
      throw new Error("City name cannot be empty");
    }

    const cleanCity = cityName.trim();

    // 1. Geocoding request
    let geocodingResults: GeocodingResult[] = [];
    try {
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1&language=en&format=json`;
      const geoResponse = await axios.get(geocodingUrl, { timeout: 8000 });
      
      if (geoResponse.data && geoResponse.data.results && geoResponse.data.results.length > 0) {
        geocodingResults = geoResponse.data.results;
      }
    } catch (error: any) {
      console.error("Geocoding API failed:", error.message || error);
      throw new Error(`Geocoding service failed: ${error.message || "Unknown error"}`);
    }

    // ⚠️ Clean frontend error throwing (Replaced the Node.js statusCode = 404 logic)
    if (geocodingResults.length === 0) {
      throw new Error(`City "${cleanCity}" not found`);
    }

    const location = geocodingResults[0];
    const { latitude, longitude, name: resolvedName, country } = location;

    // 2. Forecast request
    let forecastData: any;
    try {
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const forecastResponse = await axios.get(forecastUrl, { timeout: 8000 });
      forecastData = forecastResponse.data;
    } catch (error: any) {
      console.error("Forecast API failed:", error.message || error);
      throw new Error(`Forecast service failed: ${error.message || "Unknown error"}`);
    }

    if (!forecastData || !forecastData.current || !forecastData.daily) {
      throw new Error("Failed to retrieve valid weather forecast data from API");
    }

    // 3. Process current weather
    const currentCode = forecastData.current.weather_code;
    const currentConditionInfo = getWeatherCondition(currentCode);

    const current: CurrentWeather = {
      city: resolvedName,
      country: country,
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
  }

  /**
   * Search for cities matching a search query
   */
  public static async searchCities(query: string): Promise<GeocodingResult[]> {
    if (!query || query.trim() === "") {
      return [];
    }

    const cleanQuery = query.trim();
    try {
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=10&language=en&format=json`;
      const geoResponse = await axios.get(geocodingUrl, { timeout: 8000 });
      
      if (geoResponse.data && geoResponse.data.results && Array.isArray(geoResponse.data.results)) {
        return geoResponse.data.results;
      }
      return [];
    } catch (error: any) {
      console.error("Geocoding search API failed:", error.message || error);
      // ⚠️ Throw the error so the UI can catch and display it instead of swallowing it
      throw new Error(`Search failed: ${error.message || "Unknown error"}`);
    }
  }
}
