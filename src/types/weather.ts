/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CurrentWeather {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
}

export interface ForecastDay {
  date: string;
  dayOfWeek: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  condition: string;
}

export interface WeatherRecommendation {
  condition: string;
  icon: string; // Name of Lucide icon
  text: string;
  severity: "info" | "success" | "warning" | "danger";
}

export interface WeatherResponse {
  current: CurrentWeather;
  forecast: ForecastDay[];
  recommendation: WeatherRecommendation;
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}
