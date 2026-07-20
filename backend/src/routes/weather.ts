/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { WeatherController } from "../controllers/weatherController";

const router = Router();

// GET /api/weather/search?q=London
router.get("/search", WeatherController.searchCities);

// GET /api/weather?city=London
router.get("/", WeatherController.getWeather);

export default router;
