# AtmosphereX - Weather Intelligence Dashboard

AtmosphereX is a next-generation, real-time weather dashboard built with premium glassmorphism aesthetics and custom data visualizations. It consumes public APIs to deliver current weather stats, 24-hour trends, and a 7-day forecast.

---

## ✨ Features

- **Futuristic Glassmorphic UI**: Translucent cards, neon accents, ambient background glows, and dynamic weather animations.
- **Smart Search & Autocomplete**: Start typing any city to see instant location suggestions with country and state filters.
- **Interactive SVG Temperature Chart**: A custom-drawn cubic bezier area chart displaying the 24-hour temperature trend.
- **Real-Time Coordinates Geolocation**: Instantly fetches local weather based on the browser's GPS location.
- **Instant Unit Conversion**: Switch between Metric (°C, km/h) and Imperial (°F, mph) without sending extra API requests.
- **Offline Resiliency & Caching**: Remembers the last viewed location via `localStorage` and handles connection losses gracefully.

---

## 🛠️ Tech Stack & APIs

- **Frontend Core**: Vanilla HTML5, CSS3 Grid/Flexbox, and modern Asynchronous JavaScript.
- **Weather API**: [Open-Meteo Weather Forecast API](https://open-meteo.com) (No API Key Required).
- **Geocoding API**: [Open-Meteo Geocoding Search API](https://open-meteo.com) (No API Key Required).
- **Reverse Geocoding**: [OpenStreetMap Nominatim API](https://nominatim.org/) (for local city lookup).

---

## 🚀 How to Run Locally

Since this is a static frontend web application, it does not require complex compiling or package setups. You can launch it using any simple local web server:

### Option A: Using Python (Recommended)
If you have Python installed, run this command in the project directory:
```bash
python -m http.server 8080
```
Then visit **[http://localhost:8080](http://localhost:8080)** in your browser.

### Option B: Using Node.js (live-server)
If you prefer Node.js and have it installed:
```bash
npx live-server --port=8080
```
Then visit **[http://localhost:8080](http://localhost:8080)**.
