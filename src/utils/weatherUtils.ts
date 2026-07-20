/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WeatherRecommendation } from "../types/weather";

export interface WeatherConditionInfo {
  description: string;
  icon: string;
  recommendation: string;
  severity: "info" | "success" | "warning" | "danger";
}

/**
 * Maps WMO weather interpretation codes to clean metadata.
 * Ref: WMO Weather interpretation codes (WW)
 */
export function getWeatherCondition(code: number): WeatherConditionInfo {
  // Clear sky
  if (code === 0) {
    return {
      description: "Clear Sky",
      icon: "Sun",
      recommendation: "Sunny. Wear sunscreen, wear sunglasses, and stay hydrated.",
      severity: "success",
    };
  }

  // Mainly clear, partly cloudy, overcast
  if (code === 1) {
    return {
      description: "Mainly Clear",
      icon: "CloudSun",
      recommendation: "Pleasant weather for outdoor activities or a stroll.",
      severity: "success",
    };
  }
  if (code === 2) {
    return {
      description: "Partly Cloudy",
      icon: "CloudSun",
      recommendation: "Good weather for outdoor activities, moderate sun.",
      severity: "info",
    };
  }
  if (code === 3) {
    return {
      description: "Overcast",
      icon: "Cloud",
      recommendation: "Cloudy sky. Pleasant weather for outdoor activities.",
      severity: "info",
    };
  }

  // Fog and depositing rime fog
  if (code === 45 || code === 48) {
    return {
      description: code === 45 ? "Fog" : "Depositing Rime Fog",
      icon: "CloudFog",
      recommendation: "Foggy conditions. Drive carefully due to low visibility.",
      severity: "warning",
    };
  }

  // Drizzle: Light, moderate, and dense intensity
  if (code === 51 || code === 53 || code === 55) {
    const intensity = code === 51 ? "Light" : code === 53 ? "Moderate" : "Dense";
    return {
      description: `${intensity} Drizzle`,
      icon: "CloudDrizzle",
      recommendation: "Drizzle expected. Carry an umbrella if walking outside.",
      severity: "info",
    };
  }

  // Freezing Drizzle: Light and dense intensity
  if (code === 56 || code === 57) {
    return {
      description: "Freezing Drizzle",
      icon: "CloudSnow",
      recommendation: "Freezing drizzle. Dress warmly and watch for slippery paths.",
      severity: "warning",
    };
  }

  // Rain: Slight, moderate and heavy intensity
  if (code === 61 || code === 63) {
    return {
      description: code === 61 ? "Slight Rain" : "Moderate Rain",
      icon: "CloudRain",
      recommendation: "Rainy weather. Carry an umbrella to stay dry.",
      severity: "info",
    };
  }
  if (code === 65) {
    return {
      description: "Heavy Rain",
      icon: "CloudRain",
      recommendation: "Heavy rain. Avoid non-essential outdoor activities.",
      severity: "warning",
    };
  }

  // Freezing Rain: Light and heavy intensity
  if (code === 66 || code === 67) {
    return {
      description: "Freezing Rain",
      icon: "CloudSnow",
      recommendation: "Freezing rain. Dress warmly and avoid outdoor travel if possible.",
      severity: "warning",
    };
  }

  // Snow fall: Slight, moderate, and heavy intensity
  if (code === 71 || code === 73 || code === 75 || code === 77) {
    const desc = code === 71 ? "Slight Snow" : code === 73 ? "Moderate Snow" : code === 75 ? "Heavy Snow" : "Snow Grains";
    return {
      description: desc,
      icon: "Snowflake",
      recommendation: "Snowy weather. Dress warmly and drive carefully with winter tires.",
      severity: "warning",
    };
  }

  // Rain showers: Slight, moderate, and violent
  if (code === 80 || code === 81) {
    return {
      description: "Rain Showers",
      icon: "CloudRain",
      recommendation: "Passing rain showers. Keep an umbrella handy.",
      severity: "info",
    };
  }
  if (code === 82) {
    return {
      description: "Violent Rain Showers",
      icon: "CloudRain",
      recommendation: "Heavy rain showers. Avoid outdoor activities.",
      severity: "warning",
    };
  }

  // Snow showers slight and heavy
  if (code === 85 || code === 86) {
    return {
      description: "Snow Showers",
      icon: "Snowflake",
      recommendation: "Snow showers. Dress warmly and watch your step.",
      severity: "warning",
    };
  }

  // Thunderstorm: Slight or moderate, or with hail
  if (code === 95) {
    return {
      description: "Thunderstorm",
      icon: "CloudLightning",
      recommendation: "Thunderstorm warning. Stay indoors and avoid open areas.",
      severity: "danger",
    };
  }
  if (code === 96 || code === 99) {
    return {
      description: "Severe Thunderstorm with Hail",
      icon: "CloudLightning",
      recommendation: "Thunderstorm with hail. Stay indoors and protect vehicles/property.",
      severity: "danger",
    };
  }

  // Default fallback
  return {
    description: "Unknown Weather",
    icon: "HelpCircle",
    recommendation: "No specific recommendations. Check local listings.",
    severity: "info",
  };
}

/**
 * Returns a day name from a date string (e.g., '2026-07-20' -> 'Monday')
 */
export function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  // Guard against invalid date
  if (isNaN(date.getTime())) {
    return dateStr;
  }
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

/**
 * Format date for display (e.g., '2026-07-20' -> 'Jul 20')
 */
export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
