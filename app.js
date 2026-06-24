/**
 * AtmosphereX - Weather Dashboard Core Application Logic
 */

// Application State
const state = {
  unit: 'C', // 'C' or 'F'
  currentData: null,
  currentCityName: 'London',
  currentCountryName: 'United Kingdom',
  searchTimeout: null,
  activeCityIndex: -1,
  suggestionsList: []
};

// DOM Elements
const elements = {
  citySearch: document.getElementById('city-search'),
  suggestions: document.getElementById('suggestions'),
  geoBtn: document.getElementById('geo-btn'),
  unitToggle: document.getElementById('unit-toggle-checkbox'),
  unitC: document.getElementById('unit-c'),
  unitF: document.getElementById('unit-f'),
  
  // Content Containers
  mainContent: document.getElementById('main-content'),
  skeletonLoader: document.getElementById('skeleton-loader'),
  errorBanner: document.getElementById('error-banner'),
  errorMessage: document.getElementById('error-message'),
  errorRetry: document.getElementById('error-retry'),
  
  // Weather Display Elements
  currentCity: document.getElementById('current-city'),
  currentCountry: document.getElementById('current-country'),
  currentDate: document.getElementById('current-date'),
  currentTime: document.getElementById('current-time'),
  currentWeatherIcon: document.getElementById('current-weather-icon'),
  currentTemp: document.getElementById('current-temp'),
  weatherDescription: document.getElementById('weather-description'),
  currentTempMax: document.getElementById('current-temp-max'),
  currentTempMin: document.getElementById('current-temp-min'),
  weatherEffects: document.getElementById('weather-effects'),
  
  // Metrics
  valFeelsLike: document.getElementById('val-feels-like'),
  valWind: document.getElementById('val-wind'),
  windDirectionIndicator: document.getElementById('wind-direction-indicator'),
  subWind: document.getElementById('sub-wind'),
  valHumidity: document.getElementById('val-humidity'),
  valUv: document.getElementById('val-uv'),
  valPressure: document.getElementById('val-pressure'),
  valCloud: document.getElementById('val-cloud'),
  
  // Charts & Lists
  hourlyChart: document.getElementById('hourly-chart'),
  chartTimeline: document.getElementById('chart-timeline'),
  dailyForecastList: document.getElementById('daily-forecast-list'),
  quickPills: document.querySelectorAll('.pill-btn')
};

// Weather Code Mapping (WMO weather codes)
const weatherCodeMap = {
  0: { label: 'Clear Sky', class: 'weather-sunny', icon: 'clear-day' },
  1: { label: 'Mainly Clear', class: 'weather-sunny', icon: 'clear-day' },
  2: { label: 'Partly Cloudy', class: 'weather-cloudy', icon: 'cloudy-day' },
  3: { label: 'Overcast', class: 'weather-cloudy', icon: 'cloudy' },
  45: { label: 'Foggy', class: 'weather-cloudy', icon: 'fog' },
  48: { label: 'Depositing Rime Fog', class: 'weather-cloudy', icon: 'fog' },
  51: { label: 'Light Drizzle', class: 'weather-rain', icon: 'drizzle' },
  53: { label: 'Moderate Drizzle', class: 'weather-rain', icon: 'drizzle' },
  55: { label: 'Dense Drizzle', class: 'weather-rain', icon: 'drizzle' },
  56: { label: 'Light Freezing Drizzle', class: 'weather-rain', icon: 'drizzle' },
  57: { label: 'Dense Freezing Drizzle', class: 'weather-rain', icon: 'drizzle' },
  61: { label: 'Slight Rain', class: 'weather-rain', icon: 'rain' },
  63: { label: 'Moderate Rain', class: 'weather-rain', icon: 'rain' },
  65: { label: 'Heavy Rain', class: 'weather-rain', icon: 'rain' },
  66: { label: 'Light Freezing Rain', class: 'weather-rain', icon: 'rain' },
  67: { label: 'Heavy Freezing Rain', class: 'weather-rain', icon: 'rain' },
  71: { label: 'Slight Snowfall', class: 'weather-snow', icon: 'snow' },
  73: { label: 'Moderate Snowfall', class: 'weather-snow', icon: 'snow' },
  75: { label: 'Heavy Snowfall', class: 'weather-snow', icon: 'snow' },
  77: { label: 'Snow Grains', class: 'weather-snow', icon: 'snow' },
  80: { label: 'Slight Rain Showers', class: 'weather-rain', icon: 'rain' },
  81: { label: 'Moderate Rain Showers', class: 'weather-rain', icon: 'rain' },
  82: { label: 'Violent Rain Showers', class: 'weather-rain', icon: 'rain' },
  85: { label: 'Slight Snow Showers', class: 'weather-snow', icon: 'snow' },
  86: { label: 'Heavy Snow Showers', class: 'weather-snow', icon: 'snow' },
  95: { label: 'Thunderstorm', class: 'weather-thunder', icon: 'thunderstorm' },
  96: { label: 'Thunderstorm with Hail', class: 'weather-thunder', icon: 'thunderstorm' },
  99: { label: 'Thunderstorm with Heavy Hail', class: 'weather-thunder', icon: 'thunderstorm' }
};

// SVG Icon Templates
const svgIcons = {
  'clear-day': `
    <svg viewBox="0 0 24 24" fill="none" stroke="url(#sunny-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <defs>
        <linearGradient id="sunny-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fbbf24" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="5" fill="url(#sunny-grad)" opacity="0.3"></circle>
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`,
  'cloudy-day': `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41" stroke="#f59e0b"></path>
      <path d="M15.28 10A5 5 0 0 0 9 6.2a5 5 0 0 0-4 4.8 4 4 0 0 0 2 7h10a4 4 0 0 0 2-7.8z" fill="#38bdf8" opacity="0.2"></path>
      <path d="M18.4 10a5.5 5.5 0 0 0-10.8-1 4 4 0 0 0-3 3.8 4 4 0 0 0 4 4h9.8a4.2 4.2 0 0 0 4-4.8z" stroke="#cbd5e1"></path>
    </svg>`,
  'cloudy': `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 10a5.5 5.5 0 0 0-10.8-1 4 4 0 0 0-3 3.8 4 4 0 0 0 4 4h9.8a4.2 4.2 0 0 0 4-4.8z" fill="#475569" opacity="0.2"></path>
      <path d="M12 10a5.5 5.5 0 0 0-10.8-1 4 4 0 0 0-3 3.8 4 4 0 0 0 4 4h9.8a4.2 4.2 0 0 0 4-4.8z" stroke="#94a3b8"></path>
      <path d="M17.5 15a4.5 4.5 0 0 0-8.8-1 3.5 3.5 0 0 0-2.5 3.3 3.5 3.5 0 0 0 3.5 3.5h7.8a3.7 3.7 0 0 0 3.7-4.3z" stroke="#cbd5e1"></path>
    </svg>`,
  'fog': `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#94a3b8"></path>
      <line x1="5" y1="16" x2="19" y2="16" stroke="#64748b"></line>
      <line x1="8" y1="20" x2="16" y2="20" stroke="#64748b"></line>
    </svg>`,
  'drizzle': `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#94a3b8"></path>
      <line x1="8" y1="14" x2="8" y2="17" stroke="#3b82f6"></line>
      <line x1="12" y1="15" x2="12" y2="18" stroke="#3b82f6"></line>
      <line x1="16" y1="14" x2="16" y2="17" stroke="#3b82f6"></line>
    </svg>`,
  'rain': `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#1e3a8a" opacity="0.3" stroke="#94a3b8"></path>
      <line x1="8" y1="14" x2="6" y2="19" stroke="#06b6d4" stroke-width="2.5"></line>
      <line x1="12" y1="15" x2="10" y2="20" stroke="#06b6d4" stroke-width="2.5"></line>
      <line x1="16" y1="14" x2="14" y2="19" stroke="#06b6d4" stroke-width="2.5"></line>
    </svg>`,
  'snow': `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#cbd5e1"></path>
      <circle cx="8" cy="15" r="1" fill="#e2e8f0"></circle>
      <circle cx="12" cy="17" r="1.5" fill="#ffffff"></circle>
      <circle cx="16" cy="15" r="1" fill="#e2e8f0"></circle>
      <line x1="12" y1="14" x2="12" y2="14.01" stroke="#ffffff" stroke-width="2"></line>
    </svg>`,
  'thunderstorm': `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#475569"></path>
      <path d="M13 14h-3l2 4h-3l4 6v-6h3z" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5"></path>
    </svg>`
};

// Helper: Convert Celsius to Fahrenheit
const cToF = c => Math.round((c * 9/5) + 32);
const formatTemp = temp => state.unit === 'C' ? `${Math.round(temp)}°` : `${cToF(temp)}°`;

// Helper: Formatted Time
const formatTime = (isoString, timezone) => {
  try {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: timezone };
    return new Date(isoString).toLocaleTimeString([], options);
  } catch (e) {
    // Fallback if timezone not supported
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
};

// Helper: Formatted Date
const formatDate = (isoString, timezone) => {
  try {
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', timeZone: timezone };
    return new Date(isoString).toLocaleDateString('en-US', options);
  } catch (e) {
    return new Date(isoString).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  }
};

// Initialize Application
const init = () => {
  setupEventListeners();
  
  // Load saved location or fallback to London
  const savedCity = localStorage.getItem('ax_city');
  const savedCountry = localStorage.getItem('ax_country');
  const savedLat = localStorage.getItem('ax_lat');
  const savedLon = localStorage.getItem('ax_lon');
  
  if (savedCity && savedLat && savedLon) {
    state.currentCityName = savedCity;
    state.currentCountryName = savedCountry || '';
    fetchWeatherData(parseFloat(savedLat), parseFloat(savedLon));
  } else {
    // Default: London
    fetchWeatherData(51.5074, -0.1278);
  }
};

// Setup Event Listeners
const setupEventListeners = () => {
  // Search Autocomplete Inputs
  elements.citySearch.addEventListener('input', handleSearchInput);
  elements.citySearch.addEventListener('keydown', handleSearchNavigation);
  
  // Close suggestions box on clicking outside
  document.addEventListener('click', (e) => {
    if (!elements.citySearch.contains(e.target) && !elements.suggestions.contains(e.target)) {
      closeSuggestions();
    }
  });

  // Geolocate Button
  elements.geoBtn.addEventListener('click', handleGeolocation);
  
  // Unit Switcher Toggle
  elements.unitToggle.addEventListener('change', (e) => {
    state.unit = e.target.checked ? 'F' : 'C';
    updateUnitUI();
    if (state.currentData) {
      renderWeather(state.currentData);
    }
  });
  
  // Retry Button on error
  elements.errorRetry.addEventListener('click', () => {
    elements.errorBanner.classList.add('hidden');
    elements.skeletonLoader.classList.remove('hidden');
    // Fetch last viewed city
    const lat = localStorage.getItem('ax_lat') || 51.5074;
    const lon = localStorage.getItem('ax_lon') || -0.1278;
    fetchWeatherData(parseFloat(lat), parseFloat(lon));
  });

  // Quick pills clicks
  elements.quickPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Clear search
      elements.citySearch.value = '';
      closeSuggestions();
      
      const city = pill.dataset.city;
      
      // Update active pill state
      elements.quickPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      // Fetch city coordinates via geocoding
      geocodeAndFetch(city);
    });
  });
};

// Geocode a city name and fetch its weather
const geocodeAndFetch = async (cityName) => {
  showLoader();
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
    if (!response.ok) throw new Error('Geocoding service unavailable');
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      showError(`City "${cityName}" not found.`);
      return;
    }
    
    const result = data.results[0];
    state.currentCityName = result.name;
    state.currentCountryName = result.country || '';
    
    // Save to localStorage
    localStorage.setItem('ax_city', result.name);
    localStorage.setItem('ax_country', result.country || '');
    localStorage.setItem('ax_lat', result.latitude);
    localStorage.setItem('ax_lon', result.longitude);
    
    fetchWeatherData(result.latitude, result.longitude);
  } catch (error) {
    showError(error.message);
  }
};

// Handle Search Input (Autocomplete Debounced)
const handleSearchInput = (e) => {
  const query = e.target.value.trim();
  clearTimeout(state.searchTimeout);
  
  if (query.length < 2) {
    closeSuggestions();
    return;
  }
  
  state.searchTimeout = setTimeout(() => {
    fetchSuggestions(query);
  }, 350); // 350ms debounce
};

// Fetch Suggestions from Open-Meteo Geocoding API
const fetchSuggestions = async (query) => {
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    if (!response.ok) return;
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      state.suggestionsList = data.results;
      renderSuggestions(data.results);
    } else {
      state.suggestionsList = [];
      elements.suggestions.innerHTML = '<div class="suggestion-item"><span class="suggestion-name">No results found</span></div>';
      elements.suggestions.classList.add('active');
    }
  } catch (err) {
    console.error('Suggestions error:', err);
  }
};

// Render suggestions dropdown
const renderSuggestions = (list) => {
  state.activeCityIndex = -1;
  elements.suggestions.innerHTML = '';
  
  list.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'suggestion-item';
    div.dataset.index = index;
    
    const stateStr = item.admin1 ? `, ${item.admin1}` : '';
    const countryStr = item.country ? ` (${item.country})` : '';
    
    div.innerHTML = `
      <span class="suggestion-name">${item.name}</span>
      <span class="suggestion-sub">${item.elevation ? `Elev: ${Math.round(item.elevation)}m` : ''}${stateStr}${countryStr}</span>
    `;
    
    div.addEventListener('click', () => selectSuggestion(index));
    elements.suggestions.appendChild(div);
  });
  
  elements.suggestions.classList.add('active');
};

// Select autocomplete suggestion
const selectSuggestion = (index) => {
  const selected = state.suggestionsList[index];
  if (!selected) return;
  
  state.currentCityName = selected.name;
  state.currentCountryName = selected.country || '';
  elements.citySearch.value = selected.name;
  closeSuggestions();
  
  // Save search in localStorage
  localStorage.setItem('ax_city', selected.name);
  localStorage.setItem('ax_country', selected.country || '');
  localStorage.setItem('ax_lat', selected.latitude);
  localStorage.setItem('ax_lon', selected.longitude);
  
  // Remove active from quick pills
  elements.quickPills.forEach(p => p.classList.remove('active'));
  
  fetchWeatherData(selected.latitude, selected.longitude);
};

// Handle Suggestions Navigation (Keyboard up/down/enter)
const handleSearchNavigation = (e) => {
  const items = elements.suggestions.querySelectorAll('.suggestion-item');
  if (items.length === 0 || !elements.suggestions.classList.contains('active')) return;
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    state.activeCityIndex = (state.activeCityIndex + 1) % items.length;
    highlightSuggestion(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    state.activeCityIndex = (state.activeCityIndex - 1 + items.length) % items.length;
    highlightSuggestion(items);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (state.activeCityIndex > -1) {
      selectSuggestion(state.activeCityIndex);
    } else {
      // Pick first element
      selectSuggestion(0);
    }
  } else if (e.key === 'Escape') {
    closeSuggestions();
  }
};

const highlightSuggestion = (items) => {
  items.forEach((item, idx) => {
    if (idx === state.activeCityIndex) {
      item.classList.add('selected');
      // Scroll into view if needed
      item.scrollIntoView({ block: 'nearest' });
    } else {
      item.classList.remove('selected');
    }
  });
};

const closeSuggestions = () => {
  elements.suggestions.classList.remove('active');
  state.activeCityIndex = -1;
};

// Geolocation Handling
const handleGeolocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }
  
  showLoader();
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      // Try to find the closest city name using OpenStreetMap Nominatim reverse lookup
      try {
        state.currentCityName = "Current Location";
        state.currentCountryName = "Local coordinates";
        
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.address) {
            state.currentCityName = resJson.address.city || resJson.address.town || resJson.address.village || resJson.address.suburb || "Current Location";
            state.currentCountryName = resJson.address.country || "Local coordinates";
          }
        }
      } catch (err) {
        console.error("Nominatim reverse geocode failed, using generic labels", err);
      }
      
      // Save location
      localStorage.setItem('ax_city', state.currentCityName);
      localStorage.setItem('ax_country', state.currentCountryName);
      localStorage.setItem('ax_lat', lat);
      localStorage.setItem('ax_lon', lon);
      
      // Clear active pill state
      elements.quickPills.forEach(p => p.classList.remove('active'));
      
      fetchWeatherData(lat, lon);
    },
    (error) => {
      console.warn("Geolocation warning:", error);
      let errMsg = "Unable to retrieve your location.";
      if (error.code === error.PERMISSION_DENIED) {
        errMsg = "Geolocation permission denied. Please search for a city instead.";
      }
      showError(errMsg);
      // Fallback: reload London or whatever is stored
      const savedLat = localStorage.getItem('ax_lat') || 51.5074;
      const savedLon = localStorage.getItem('ax_lon') || -0.1278;
      fetchWeatherData(parseFloat(savedLat), parseFloat(savedLon));
    },
    { timeout: 7000 }
  );
};

// Fetch Full Weather Forecast Data
const fetchWeatherData = async (lat, lon) => {
  showLoader();
  
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
  
  try {
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error("Weather forecast service error");
    
    const data = await res.json();
    state.currentData = data;
    renderWeather(data);
    hideLoader();
  } catch (err) {
    console.error("Weather fetch failed:", err);
    showError("Could not retrieve real-time weather. Check your internet connection.");
  }
};

// Render weather data into the UI
const renderWeather = (data) => {
  const current = data.current;
  const daily = data.daily;
  const timezone = data.timezone;
  
  // 1. Location and Time
  elements.currentCity.innerText = state.currentCityName;
  elements.currentCountry.innerText = state.currentCountryName;
  
  const currentLocalTime = new Date(current.time);
  elements.currentDate.innerText = formatDate(currentLocalTime, timezone);
  elements.currentTime.innerText = formatTime(currentLocalTime, timezone);
  
  // 2. Weather Code mapping
  const codeInfo = weatherCodeMap[current.weather_code] || { label: 'Unknown Condition', class: 'weather-sunny', icon: 'clear-day' };
  elements.weatherDescription.innerText = codeInfo.label;
  
  // Set dynamic CSS backgrounds
  elements.weatherEffects.className = 'weather-effect-overlay'; // Reset
  elements.weatherEffects.classList.add(codeInfo.class);
  
  // Inject Main Large SVG Weather Icon
  const iconMarkup = svgIcons[codeInfo.icon] || svgIcons['clear-day'];
  elements.currentWeatherIcon.innerHTML = iconMarkup;
  
  // 3. Current Temp and limits
  elements.currentTemp.innerText = Math.round(state.unit === 'C' ? current.temperature_2m : cToF(current.temperature_2m));
  
  // Min/Max of current day (index 0)
  elements.currentTempMax.innerText = formatTemp(daily.temperature_2m_max[0]);
  elements.currentTempMin.innerText = formatTemp(daily.temperature_2m_min[0]);
  
  // 4. Metrics Grid
  elements.valFeelsLike.innerText = formatTemp(current.apparent_temperature);
  
  // Wind Speed: Convert to mph if imperial
  if (state.unit === 'C') {
    elements.valWind.innerText = `${Math.round(current.wind_speed_10m)} km/h`;
  } else {
    const mph = Math.round(current.wind_speed_10m * 0.621371);
    elements.valWind.innerText = `${mph} mph`;
  }
  
  // Wind Direction Arrow Rotation
  elements.windDirectionIndicator.style.transform = `rotate(${current.wind_direction_10m}deg)`;
  elements.subWind.innerText = `Direction: ${current.wind_direction_10m}°`;
  
  elements.valHumidity.innerText = `${current.relative_humidity_2m}%`;
  
  // UV Index Max (current day)
  const currentUv = daily.uv_index_max[0];
  elements.valUv.innerText = currentUv.toFixed(1);
  
  // UV index category subtext
  let uvSub = 'Low';
  if (currentUv >= 3 && currentUv < 6) uvSub = 'Moderate';
  else if (currentUv >= 6 && currentUv < 8) uvSub = 'High';
  else if (currentUv >= 8 && currentUv < 11) uvSub = 'Very High';
  else if (currentUv >= 11) uvSub = 'Extreme';
  elements.valUv.nextElementSibling.innerText = `Index level: ${uvSub}`;
  
  elements.valPressure.innerText = `${Math.round(current.pressure_msl)} hPa`;
  
  elements.valCloud.innerText = `${current.cloud_cover}%`;
  
  // 5. Custom SVG Hourly Chart Rendering (24 points)
  renderHourlyChart(data);
  
  // 6. 7-Day Forecast Row list
  renderDailyForecast(data);
};

// Render the 24-hour temperature trend SVG Chart
const renderHourlyChart = (data) => {
  const hourly = data.hourly;
  const timezone = data.timezone;
  const now = new Date(data.current.time);
  
  // Find current hour index in the hourly timeline
  let startIndex = 0;
  const hourlyTimeArray = hourly.time;
  for (let i = 0; i < hourlyTimeArray.length; i++) {
    const checkDate = new Date(hourlyTimeArray[i]);
    if (checkDate >= now) {
      startIndex = i;
      break;
    }
  }
  
  // Take the next 12 hours (since 24 hours can crowd a small dashboard SVG, we take 12 points to make it super crisp, or 24 points with wide spacings. Let's do 12 hourly intervals for standard screens, spaced nicely, covering 24 hours in steps of 2 hours! That is 12 points representing 24 hours. Super neat!)
  const chartPointsCount = 12;
  const step = 2; // step by 2 hours
  const hourlyData = [];
  
  for (let k = 0; k < chartPointsCount; k++) {
    const index = startIndex + (k * step);
    if (index >= hourlyTimeArray.length) break;
    
    const tempRaw = hourly.temperature_2m[index];
    const tempVal = state.unit === 'C' ? tempRaw : cToF(tempRaw);
    
    hourlyData.push({
      timeLabel: formatTime(hourlyTimeArray[index], timezone),
      temp: tempVal,
      weatherCode: hourly.weather_code[index]
    });
  }
  
  if (hourlyData.length === 0) return;
  
  // Calculate Min & Max in the selected set to dynamically scale Y axis
  const temps = hourlyData.map(d => d.temp);
  const minTemp = Math.min(...temps) - 1.5;
  const maxTemp = Math.max(...temps) + 1.5;
  const tempDiff = maxTemp - minTemp || 1;
  
  // SVG Dimensions are 600 width, 180 height
  const width = 600;
  const height = 150; // Keep some margin at bottom for timeline labels
  const paddingX = 40;
  const paddingY = 25;
  const chartWidth = width - (paddingX * 2);
  const chartHeight = height - (paddingY * 2);
  
  // Calculate SVG Coordinates for each point
  const points = hourlyData.map((d, index) => {
    const x = paddingX + (index * (chartWidth / (chartPointsCount - 1)));
    // Y points downwards in SVG: high temp has LOW Y coordinate
    const y = paddingY + chartHeight - ((d.temp - minTemp) / tempDiff * chartHeight);
    return { x, y, temp: d.temp, label: d.timeLabel };
  });
  
  // Build Bezier Curve path string
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    
    // Control points for smooth cubic bezier
    const cpX1 = current.x + (next.x - current.x) / 3;
    const cpY1 = current.y;
    const cpX2 = current.x + 2 * (next.x - current.x) / 3;
    const cpY2 = next.y;
    
    linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }
  
  // Build Area Path under the curve
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  
  // Construct SVG Elements Markup
  let svgContent = `
    <defs>
      <!-- Gradients -->
      <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="var(--accent-cyan)" />
        <stop offset="50%" stop-color="var(--accent-blue)" />
        <stop offset="100%" stop-color="var(--accent-purple)" />
      </linearGradient>
      <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--accent-cyan)" stop-opacity="0.25" />
        <stop offset="100%" stop-color="var(--accent-cyan)" stop-opacity="0.0" />
      </linearGradient>
    </defs>
  `;
  
  // Draw Grid Lines (Vertical ticks)
  points.forEach(pt => {
    svgContent += `<line x1="${pt.x}" y1="${paddingY}" x2="${pt.x}" y2="${height - 10}" class="chart-grid-line"></line>`;
  });
  
  // Draw the filled area under chart
  svgContent += `<path d="${areaPath}" class="chart-area"></path>`;
  
  // Draw the main line path
  svgContent += `<path d="${linePath}" class="chart-line"></path>`;
  
  // Draw points, hover rings, and temp text
  points.forEach(pt => {
    svgContent += `
      <g class="chart-node">
        <circle cx="${pt.x}" cy="${pt.y}" r="4.5" class="chart-point"></circle>
        <text x="${pt.x}" y="${pt.y - 12}" class="chart-text">${Math.round(pt.temp)}°</text>
      </g>
    `;
  });
  
  elements.hourlyChart.innerHTML = svgContent;
  
  // Render timeline text tags below chart
  elements.chartTimeline.innerHTML = '';
  points.forEach(pt => {
    const span = document.createElement('span');
    span.className = 'timeline-label';
    span.innerText = pt.label;
    elements.chartTimeline.appendChild(span);
  });
};

// Render 7-day daily forecast list
const renderDailyForecast = (data) => {
  const daily = data.daily;
  const listContainer = elements.dailyForecastList;
  listContainer.innerHTML = '';
  
  // Open-Meteo returns 7 days of forecast.
  const daysCount = daily.time.length;
  
  for (let i = 0; i < daysCount; i++) {
    const dateObj = new Date(daily.time[i]);
    
    // Day Label (Today, Tomorrow, or Weekday)
    let dayName = '';
    if (i === 0) {
      dayName = 'Today';
    } else if (i === 1) {
      dayName = 'Tomorrow';
    } else {
      dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    }
    
    const weatherCode = daily.weather_code[i];
    const codeInfo = weatherCodeMap[weatherCode] || { label: 'Clear Sky', icon: 'clear-day' };
    const iconMarkup = svgIcons[codeInfo.icon] || svgIcons['clear-day'];
    
    const maxTemp = daily.temperature_2m_max[i];
    const minTemp = daily.temperature_2m_min[i];
    
    const row = document.createElement('div');
    row.className = 'daily-row';
    row.innerHTML = `
      <span class="daily-day">${dayName}</span>
      <div class="daily-icon" title="${codeInfo.label}">
        ${iconMarkup}
      </div>
      <span class="daily-summary">${codeInfo.label}</span>
      <div class="daily-temps">
        <span class="daily-temp-min">${formatTemp(minTemp)}</span>
        <span class="daily-temp-max">${formatTemp(maxTemp)}</span>
      </div>
    `;
    
    listContainer.appendChild(row);
  }
};

// Toggle metric/imperial UI display labels
const updateUnitUI = () => {
  if (state.unit === 'C') {
    elements.unitC.classList.add('active');
    elements.unitF.classList.remove('active');
    elements.unitToggle.checked = false;
    document.querySelector('.temp-unit').innerText = '°C';
  } else {
    elements.unitF.classList.add('active');
    elements.unitC.classList.remove('active');
    elements.unitToggle.checked = true;
    document.querySelector('.temp-unit').innerText = '°F';
  }
};

// Loader and Display Control Functions
const showLoader = () => {
  elements.mainContent.classList.add('hidden');
  elements.errorBanner.classList.add('hidden');
  elements.skeletonLoader.classList.remove('hidden');
};

const hideLoader = () => {
  elements.skeletonLoader.classList.add('hidden');
  elements.errorBanner.classList.add('hidden');
  elements.mainContent.classList.remove('hidden');
};

const showError = (message) => {
  elements.skeletonLoader.classList.add('hidden');
  elements.mainContent.classList.add('hidden');
  elements.errorMessage.innerText = message || "An unexpected error occurred. Please check network.";
  elements.errorBanner.classList.remove('hidden');
};

// Bootstrap application on DOM load
document.addEventListener('DOMContentLoaded', init);
