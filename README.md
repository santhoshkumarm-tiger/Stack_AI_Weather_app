# Weather Intelligence Dashboard ⛅

A state-of-the-art full-stack Weather Intelligence application built using React, Vite, TypeScript, Express, and Tailwind CSS. The app features a geocoding city search, real-time atmospheric readings, smart condition mapping, multi-day predictions, and contextual clothing/safety warnings (Weather Intelligence).

---

## 🚀 Architectural Overview

To secure API integration keys, keep the client bundle lightweight, and prevent cross-origin blockages (CORS), the application is designed around a **unified full-stack architecture** bound to a single port (**3000**):

1. **Frontend**: A highly polished SPA built using React 19, Vite, and TypeScript. Icons are dynamically resolved using Lucide.
2. **Backend**: An Express proxy server running on Node.js + TypeScript.
3. **Open-Meteo Integration**: The server handles name-to-coordinate geocoding queries, requests long-range hourly/daily forecast datasets, maps numeric WMO weather interpretation codes to structured advisories, and forwards the payload safely to the browser.

---

## 🗂️ Project Structure

The project conforms to clean, modular engineering patterns:

```text
/
├── backend/                       # Server-side Application Files
│   └── src/
│       ├── controllers/
│       │   └── weatherController.ts   # Route controllers & input validation
│       ├── routes/
│       │   └── weather.ts             # Express weather route mapping
│       └── services/
│           └── weatherService.ts      # Downstream Geocoding & Forecast APIs fetcher
├── src/                           # Client-side Application Files
│   ├── components/
│   │   ├── CurrentWeatherCard.tsx     # Large primary weather view & unit toggle
│   │   ├── ErrorMessage.tsx           # Error warning container & action retry
│   │   ├── ForecastCard.tsx           # Single daily projection cell
│   │   ├── ForecastGrid.tsx           # Responsive container wrapping cards
│   │   ├── LoadingSpinner.tsx         # Modern circular layout feedback spinner
│   │   ├── RecommendationCard.tsx     # Smart advice/clothing safety panel
│   │   ├── SearchBar.tsx              # Input field & search submits
│   │   └── WeatherIcon.tsx            # Dynamic Lucide icon resolver
│   ├── services/
│   │   └── api.ts                     # Weather endpoint fetch client
│   ├── types/
│   │   └── weather.ts                 # Shared TypeScript interfaces
│   ├── utils/
│   │   └── weatherUtils.ts            # WMO Weather code interpretations map
│   ├── App.tsx                        # Master dashboard controller
│   ├── index.css                      # Tailwind imports & Google Fonts pairing
│   └── main.tsx                       # React application mount
├── index.html                     # Main SPA container
├── metadata.json                  # AI Studio capability bindings
├── package.json                   # Build scripts & node dependencies
├── server.ts                      # Full-stack master Express server entrypoint
├── tsconfig.json                  # TypeScript compiler settings
└── vite.config.ts                 # Vite environment settings
```

---

## ⚙️ Setup and Installation

### Prerequisites

Ensure you have **Node.js (v18+)** and **npm** installed on your system.

### Steps

1. **Clone or unzip** the project into your target directory.
2. Open your terminal in the project root and install all unified dependencies:
   ```bash
   npm install
   ```

---

## 🏃 Running the Application

### 1. Development Mode (Single Port 3000)

Start both the Express backend and the Vite frontend simultaneously through a single dev process (Vite runs as middle-tier Express routing middleware, exposing both frontend assets and API endpoints on port 3000):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build & Start

To build and serve the application in a standalone, production-ready compiled state:

```bash
# Compile client assets into /dist and bundle server.ts into dist/server.cjs
npm run build

# Start the compiled self-contained bundle
npm run start
```

---

## 📄 API Documentation

The backend exposes a highly optimized weather intelligence route.

### Get Combined Weather Report

Retrieves resolved location details, current atmospheric conditions, a 7-day forecast, and contextual clothing/safety guidelines.

- **URL**: `/api/weather`
- **Method**: `GET`
- **Query Parameters**:
  - `city` (string, Required): The name of the city to query (e.g., `Paris`, `Tokyo`, `Sydney`).
- **Response Format**: `JSON`

#### Example Request
```bash
GET /api/weather?city=London
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "current": {
      "city": "London",
      "country": "United Kingdom",
      "latitude": 51.5085,
      "longitude": -0.1257,
      "temperature": 19.5,
      "windSpeed": 14.2,
      "weatherCode": 3,
      "condition": "Overcast"
    },
    "forecast": [
      {
        "date": "2026-07-20",
        "dayOfWeek": "Monday",
        "weatherCode": 3,
        "tempMax": 22.1,
        "tempMin": 15.4,
        "condition": "Overcast"
      },
      ...
    ],
    "recommendation": {
      "condition": "Overcast",
      "icon": "Cloud",
      "text": "Cloudy sky. Pleasant weather for outdoor activities.",
      "severity": "info"
    }
  }
}
```

#### Error Response (`400 Bad Request`)
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "The 'city' query parameter is required and cannot be empty."
}
```

#### Error Response (`404 Not Found`)
```json
{
  "success": false,
  "error": "Not Found",
  "message": "City \"Atlantis\" not found"
}
```

#### Error Response (`500 Internal Server Error`)
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Upstream forecast service failed: Connection timeout"
}
```

---

## 🛠️ Key Technologies Used

- **React 19**: Responsive component views
- **Vite**: High-performance frontend bundler
- **TypeScript**: Complete type-safety across client and server
- **Tailwind CSS v4**: Modern, premium styling system
- **Express**: Modular API routing and proxy controller
- **Axios**: Secure, fast backend HTTP requests
- **Lucide Icons**: Crisp dynamic SVG typography symbols
- **Esbuild**: High-speed, self-contained server compilation
