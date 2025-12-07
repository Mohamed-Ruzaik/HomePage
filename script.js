// =============== SEARCH LOGIC ===================
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = e.target.value.trim();
      if (q) window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(q);
    }
  });
}

// =============== THEME TOGGLE ===================
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const iconSlot = themeToggle ? themeToggle.querySelector(".icon-slot") : null;
const textSlot = themeToggle ? themeToggle.querySelector(".text-slot") : null;

const sunIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>`;
const moonIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

function applyTheme(theme) {
  body.setAttribute("data-theme", theme);
  if(iconSlot) iconSlot.innerHTML = theme === "dark" ? moonIcon : sunIcon;
  if(textSlot) textSlot.textContent = theme === "dark" ? "Dark" : "Light";
}

if(themeToggle){
    themeToggle.addEventListener("click", () => {
      const current = body.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("ruzaik_theme", next);
    });
}

// Load saved theme
const savedTheme = localStorage.getItem("ruzaik_theme") || "dark";
applyTheme(savedTheme);


// =============== CLOCK ===================
function updateClock() {
    const clock = document.getElementById("clockDisplay");
    const dateEl = document.getElementById("dateDisplay");
    if(!clock) return;
    
    const now = new Date();
    // 12-hour format with AM/PM
    clock.textContent = now.toLocaleTimeString('en-US', { hour12: true });
    // Date format
    dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
}
setInterval(updateClock, 1000);
updateClock();


// =============== WEATHER ===================
const API_KEY = "d9b1c345ca55f061569669e29880ef0c"; 

let currentCity = localStorage.getItem("ruzaik_city") || "Colombo";

async function fetchWeather(city) {
  const status = document.getElementById("weatherStatus");
  const temp = document.getElementById("weatherTemp");
  const cityEl = document.getElementById("weatherCity");
  const desc = document.getElementById("weatherDesc");

  if (!API_KEY) return;

  try {
    if(status) status.textContent = "Updating...";
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);

    // If key is not active yet (401 Error)
    if (res.status === 401) {
       if(status) status.textContent = "Key Activating...";
       if(desc) desc.textContent = "Wait ~20 mins";
       return;
    }
    
    // If city name is wrong (404 Error)
    if (res.status === 404) {
       if(status) status.textContent = "Error";
       if(desc) desc.textContent = "City not found";
       return;
    }

    if (!res.ok) throw new Error("Network Error");

    const data = await res.json();
    
    // Update UI with MORE DETAILS
    if(temp) temp.textContent = Math.round(data.main.temp) + "°C";
    if(cityEl) cityEl.textContent = data.name;
    
    // Added Humidity and Wind Speed to the description line
    if(desc) {
        const condition = data.weather[0].description;
        const humidity = data.main.humidity;
        const wind = data.wind.speed;
        // Format: "broken clouds • Hum: 83% • Wind: 8.2m/s"
        desc.textContent = `${condition} • Hum: ${humidity}% • Wind: ${wind}m/s`;
    }

    if(status) status.textContent = "Live";
    
  } catch (e) {
    console.error(e);
    if(status) status.textContent = "Offline";
  }
}

// Handle Form Submit
const cityForm = document.getElementById("cityForm");
const cityInput = document.getElementById("cityInput");

if(cityForm && cityInput) {
    cityInput.value = currentCity;
    
    cityForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const c = cityInput.value.trim();
        if(c) {
            localStorage.setItem("ruzaik_city", c);
            fetchWeather(c);
        }
    });
}

// Initial Fetch
fetchWeather(currentCity);
