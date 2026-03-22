// ================================
// Config
// ================================
const API_KEY_WEATHER = "a33001df1c319dd29dbb5895c1b60cfe";
const API_KEY_GEO     = "0d47df981dc843aaa30cd5fe7adc7f71";

// ================================
// DOM References
// ================================
const dom = {
  location:    document.querySelector(".location"),
  temperature: document.querySelector(".temperature"),
  weatherIcon: document.querySelector(".weather-icon"),
  dayName:     document.querySelector(".day-name"),
  currentTime: document.querySelector(".current-time"),
  humidity:    document.querySelector(".hum-per"),
  windSpeed:   document.querySelector(".wind-value"),
  sunrise:     document.querySelector(".time-3"),
  sunset:      document.querySelector(".time-2"),
  searchInput: document.querySelector(".search-input"),
  searchBtn:   document.querySelector(".search-btn"),
  tabs:        document.querySelectorAll(".tab"),
};

// ================================
// Date & Time
// ================================
function updateDateTime() {
  const now      = new Date();
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const day      = dayNames[now.getDay()];
  const hours    = now.getHours();
  const minutes  = String(now.getMinutes()).padStart(2, "0");
  const ampm     = hours >= 12 ? "pm" : "am";
  const hour12   = hours % 12 || 12;

  dom.dayName.textContent     = day;
  dom.currentTime.textContent = `${hour12}:${minutes} ${ampm}`;

  // Daytime icon swap (6am - 8pm)
  if (hours >= 6 && hours < 20) {
    dom.weatherIcon.src = "sun-512.png";
    dom.weatherIcon.classList.add("daytime");
  } else {
    dom.weatherIcon.src = "nights_stay.png";
    dom.weatherIcon.classList.remove("daytime");
  }
}

// ================================
// Weather API
// ================================
async function fetchCoordinates(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY_WEATHER}`;
  const res  = await fetch(url);
  const data = await res.json();
  if (!data.length) throw new Error("City not found");
  return { lat: data[0].lat, lon: data[0].lon };
}

async function fetchWeather(lat, lon) {
  const url  = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY_WEATHER}`;
  const res  = await fetch(url);
  const data = await res.json();

  dom.temperature.textContent = `${Math.round(data.main.feels_like)}°`;
  dom.humidity.textContent    = `${data.main.humidity}%`;
  dom.windSpeed.textContent   = `${data.wind.speed} km/h`;
}

async function fetchSunriseSunset(lat, lon) {
  const url  = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&timezone=IST`;
  const res  = await fetch(url);
  const data = await res.json();

  const sunrise = data.results.sunrise;
  const sunset  = data.results.sunset;

  // Format: trim seconds and keep AM/PM
  dom.sunrise.textContent = formatTime(sunrise);
  dom.sunset.textContent  = formatTime(sunset);
}

async function fetchPlaceName(lat, lon) {
  const url  = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API_KEY_GEO}`;
  const res  = await fetch(url);
  const data = await res.json();

  const props = data.features[0].properties;
  const city  = props.city || props.town || props.village || "Unknown";
  const country = props.country || "";

  dom.location.textContent = `${city}, ${country}`;
}

// ================================
// Helpers
// ================================
function formatTime(timeStr) {
  // timeStr example: "6:30:00 AM" → "6:30 AM"
  if (!timeStr) return "--";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  const [hhmm, rest] = [parts[0] + ":" + parts[1], parts[2] || ""];
  const ampm = rest.includes("PM") ? "pm" : rest.includes("AM") ? "am" : "";
  return `${hhmm} ${ampm}`.trim();
}

// ================================
// Main Search Flow
// ================================
async function searchByCity(city) {
  if (!city.trim()) return;
  try {
    const { lat, lon } = await fetchCoordinates(city);
    await Promise.all([
      fetchWeather(lat, lon),
      fetchSunriseSunset(lat, lon),
      fetchPlaceName(lat, lon),
    ]);
  } catch (err) {
    console.error("Search failed:", err.message);
    dom.location.textContent = "City not found";
  }
}

// ================================
// Geolocation on Load
// ================================
async function loadCurrentLocation() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude: lat, longitude: lon } = position.coords;
      try {
        await Promise.all([
          fetchWeather(lat, lon),
          fetchSunriseSunset(lat, lon),
          fetchPlaceName(lat, lon),
        ]);
      } catch (err) {
        console.error("Geolocation fetch failed:", err.message);
      }
    },
    (err) => {
      console.warn("Geolocation denied:", err.message);
    }
  );
}

// ================================
// Tab Switching
// ================================
dom.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    dom.tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    // Future: load different data per tab (today/tomorrow/10days)
  });
});

// ================================
// Event Listeners
// ================================
dom.searchBtn.addEventListener("click", () => {
  searchByCity(dom.searchInput.value);
});

dom.searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchByCity(dom.searchInput.value);
});

// ================================
// Init
// ================================
updateDateTime();
loadCurrentLocation();let wheather ={
    apiKey : "a33001df1c319dd29dbb5895c1b60cfe",
    getdatalonlat : function (city){
        fetch(
            "//api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=5&appid=a33001df1c319dd29dbb5895c1b60cfe"
        )
        .then((response) => response.json())
        .then((data) => this.getLanLon(data))
    },
    getLanLon: function (data){
        const {lat} = data[0];
        const {lon} = data[0];
        this.getWeather(lat,lon);
        this.getsunrisesunset(lat,lon);
        this.getPlaceName(lat,lon);
    },
    getWeather : function (lat,lon){
        fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&exclude=&units=metric&appid=a33001df1c319dd29dbb5895c1b60cfe")
        .then((response) => response.json())
        .then((data) => this.wheather_2(data))
    },
    wheather_2 : function (data){
        const {humidity,feels_like} = data.main;
        const {name} = data;
        const {main} = data.weather[0];
        const {speed} = data.wind;
        document.querySelector(".hum-per").innerHTML = humidity + "%";
        document.querySelector(".celsius").innerHTML = feels_like + '\u00B0';
        document.querySelector(".wind-value").innerHTML = speed+ " km/h";
    },
    search: function () {
        this.getdatalonlat(document.querySelector(".search").value);
    },
    getsunrisesunset : function(lat,lon){
        fetch("https://api.sunrisesunset.io/json?lat="+lat+"&lng="+lon+"&timezone=IST")
        .then((response) => response.json())
        .then((data) => this.setsunsrisesunset(data))
    },
    setsunsrisesunset: function(data){
        const {sunrise} = data.results;
        const {sunset} = data.results;
        document.querySelector(".time-2").innerHTML = sunset.slice(0,4)+ " pm";
        document.querySelector(".time-3").innerHTML = sunrise.slice(0,4) + " am";
        
    },
    getPlaceName: function (lat,lon){
        fetch("https://api.geoapify.com/v1/geocode/reverse?lat="+lat+"&lon="+lon+"&apiKey=0d47df981dc843aaa30cd5fe7adc7f71")
        .then((response) => response.json())
        .then((data) => this.placeName(data))
    },
    placeName: function(data){
        const {country} = data.features[0].properties;
        const {city} = data.features[0].properties;
        document.querySelector(".text-1").innerHTML = city+','+country;
    }

}
document.querySelector(".search-button").addEventListener("click",function(){
    wheather.search();
})
document.querySelector(".search").addEventListener("keyup", function (event){
    if (event.key == "Enter"){
        wheather.search();
    }
})
let d = new Date();
        let dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let day = dayNames[d.getDay()];
         let hour = d.getHours();
        let min = d.getMinutes();
        let ampm = hour >= 12?"pm":"am";
        document.querySelector(".day").innerHTML = day;
        document.querySelector(".time").innerHTML = hour + ":" + min +" "+ ampm;
        if (ampm === "am" && hour >6){
            let img = document.querySelector(".weather-image");
            img.src = "sun-512.png";
            img.classList.add("weather-image-day");
        }
        

        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        nowgetNowplace(lat,lon);
        getChangeDeg(lat,lon);
        });
        } else {
            console.log("Geolocation is not supported by this browser.");
            }
       
        
function getChangeDeg(lat,lon){
    fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&exclude=&units=metric&appid=a33001df1c319dd29dbb5895c1b60cfe")
    .then((response) => response.json())
    .then((data) => this.changeDeg(data))
}
function changeDeg(data){
        const {humidity,feels_like} = data.main;
        const {name} = data;
        const {main} = data.weather[0];
        const {speed} = data.wind;
        document.querySelector(".hum-per").innerHTML = humidity + "%";
        document.querySelector(".celsius").innerHTML = feels_like + '\u00B0';
        document.querySelector(".wind-value").innerHTML = speed+ " km/h";
}
function nowgetNowplace(lat,lon){
    fetch("https://api.geoapify.com/v1/geocode/reverse?lat="+lat+"&lon="+lon+"&apiKey=0d47df981dc843aaa30cd5fe7adc7f71")
    .then((response) => response.json())
    .then((data) => this.nowPlaceName(data))
}
function nowPlaceName(data){
    const {country} = data.features[0].properties;
    const {city} = data.features[0].properties;
    document.querySelector(".text-1").innerHTML = city+','+country;
}
getplacenonce()
