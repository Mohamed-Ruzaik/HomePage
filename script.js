// =============== SEARCH ===================
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = e.target.value.trim();
      if (!q) return;
      window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(q);
    }
  });
}

// =============== THEME TOGGLE =============
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const iconSlot = themeToggle.querySelector(".icon-slot");
const textSlot = themeToggle.querySelector(".text-slot");

const sunIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>`;
const moonIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

function applyTheme(theme) {
  body.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  iconSlot.innerHTML = isDark ? moonIcon : sunIcon;
  textSlot.textContent = isDark ? "Dark" : "Light";
}

function loadTheme() {
  const saved = localStorage.getItem("ruzaik_theme");
  applyTheme(saved === "light" ? "light" : "dark");
}

themeToggle.addEventListener("click", () => {
  const current = body.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("ruzaik_theme", next);
});

loadTheme();

// =============== WEATHER ==================
// ⚠️ IMPORTANT: Get your key from https://openweathermap.org/api
const API_KEY = "YOUR_API_KEY_HERE"; 
let currentCity = localStorage.getItem("ruzaik_city") || "Colombo";

const weatherStatus = document.getElementById("weatherStatus");
const weatherTemp = document.getElementById("weatherTemp");
const weatherCity = document.getElementById("weatherCity");
const weatherDesc = document.getElementById("weatherDesc");
const weatherIconContainer = document.getElementById("weatherIcon");

function getWeatherIcon(mainType) {
    const commonSize = 'width="64" height="64" viewBox="0 0 24 24"';
    if (mainType === "Clear") return `<svg ${commonSize} fill="none" stroke="#FDB813" stroke-width="2"><circle cx="12" cy="12" r="5" fill="#FDB813" fill-opacity="0.3"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>`;
    if (mainType === "Clouds") return `<svg ${commonSize} fill="none" stroke="#A0A0A0" stroke-width="2"><path fill="#E0E0E0" fill-opacity="0.5" d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`;
    if (mainType === "Rain" || mainType === "Drizzle") return `<svg ${commonSize} fill="none" stroke="#4285F4" stroke-width="2"><path fill="#D6E6F2" d="M20 16.2A4.5 4.5 0 0 0 3.2 14.2 8 8 0 1 1 18 10h0a4.5 4.5 0 0 1 2 6.2"></path><path d="M8 16v5"></path><path d="M12 16v5"></path><path d="M16 16v5"></path></svg>`;
    if (mainType === "Thunderstorm") return `<svg ${commonSize} fill="none" stroke="#5f6368" stroke-width="2"><path fill="#777" fill-opacity="0.2" d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><path stroke="#F4B400" fill="#F4B400" d="M13 11l-4 6h6l-4 6"></path></svg>`;
    if (mainType === "Snow") return `<svg ${commonSize} fill="none" stroke="#00BCD4" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 8.92"></path><path d="M8 16l2.1 1.5"></path><path d="M12.9 17.5L15 16"></path><path d="M8 12l2.1 1.5"></path></svg>`;
    return `<svg ${commonSize} fill="none" stroke="#9AA0A6" stroke-width="2"><path d="M5.5 5h13"></path><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`;
}

async function fetchWeather(city) {
  if (!API_KEY || API_KEY === "14cda6697496c1f0ea9a60c8ff0a7415") {
    if (weatherStatus) weatherStatus.textContent = "Demo Mode";
    if (weatherTemp) weatherTemp.textContent = "28°C";
    if (weatherCity) weatherCity.textContent = city || "Colombo";
    if (weatherDesc) weatherDesc.textContent = "Partly Cloudy";
    weatherIconContainer.innerHTML = getWeatherIcon("Clouds"); 
    return;
  }
  try {
    if (weatherStatus) weatherStatus.textContent = "Updating...";
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
    if (!res.ok) throw new Error("Error");
    const data = await res.json();
    if (weatherTemp) weatherTemp.textContent = Math.round(data.main.temp) + "°C";
    if (weatherCity) weatherCity.textContent = data.name;
    if (weatherDesc) weatherDesc.textContent = data.weather[0].description;
    weatherIconContainer.innerHTML = getWeatherIcon(data.weather[0].main);
    if (weatherStatus) weatherStatus.textContent = "Live";
  } catch (err) {
    if (weatherStatus) weatherStatus.textContent = "Offline";
  }
}

const cityForm = document.getElementById("cityForm");
const cityInput = document.getElementById("cityInput");
if (cityForm) {
  cityInput.value = currentCity;
  cityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;
    currentCity = city;
    localStorage.setItem("ruzaik_city", city);
    fetchWeather(city);
  });
}
fetchWeather(currentCity);

// =============== CLOCK & DATE =============
const clockDisplay = document.getElementById("clockDisplay");
const dateDisplay = document.getElementById("dateDisplay");

function updateClock() {
    if (!clockDisplay || !dateDisplay) return;

    const now = new Date();
    
    // Time: HH:MM:SS AM/PM
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0) as 12
    const mins = now.getMinutes().toString().padStart(2, '0');
    const secs = now.getSeconds().toString().padStart(2, '0');
    
    clockDisplay.textContent = `${hours}:${mins}:${secs} ${ampm}`;

    // Date: Monday, 2 December
    const options = { weekday: "long", day: "numeric", month: "long" };
    dateDisplay.textContent = now.toLocaleDateString(undefined, options);
}

// Update immediately, then every second
updateClock();
setInterval(updateClock, 1000);