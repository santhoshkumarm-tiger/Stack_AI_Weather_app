/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import { WeatherService } from "../services/weatherService";

export class WeatherController {
  /**
   * Handle weather query request
   */
  public static async getWeather(req: Request, res: Response): Promise<void> {
    try {
      const { city } = req.query;

      if (!city || typeof city !== "string" || city.trim() === "") {
        res.status(400).json({
          success: false,
          error: "Bad Request",
          message: "The 'city' query parameter is required and cannot be empty.",
        });
        return;
      }

      const weatherData = await WeatherService.getWeatherForCity(city);
      
      res.status(200).json({
        success: true,
        data: weatherData,
      });
    } catch (error: any) {
      console.error("Error in WeatherController.getWeather:", error);

      const statusCode = error.statusCode || 500;
      const message = error.message || "An unexpected error occurred while fetching weather data.";

      res.status(statusCode).json({
        success: false,
        error: statusCode === 404 ? "Not Found" : "Internal Server Error",
        message,
      });
    }
  }

  /**
   * Handle city search suggestions request
   */
  public static async searchCities(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== "string" || q.trim() === "") {
        res.status(200).json({
          success: true,
          data: [],
        });
        return;
      }

      const results = await WeatherService.searchCities(q);
      
      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error: any) {
      console.error("Error in WeatherController.searchCities:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: "Failed to search cities.",
      });
    }
  }
}
