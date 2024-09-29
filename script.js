// Function to refresh the current weather information
function refreshWeather(response, units) {
    const cityElement = document.querySelector("#city");
    const timeElement = document.querySelector("#time");
    const descriptionElement = document.querySelector("#description");
    const humidityElement = document.querySelector("#humidity");
    const windSpeedElement = document.querySelector("#wind-speed");
    const temperatureElement = document.querySelector("#temperature");
    const iconElement = document.querySelector("#icon-image");

    // Log the current weather response to check its structure
    console.log("Current Weather API Response:", response);

    cityElement.textContent = response.city;

    // Convert Unix timestamp to local time
    const unixTimestamp = response.time; // Timestamp from the current weather API
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    timeElement.textContent = formatDate(date);

    descriptionElement.textContent = response.condition.description;
    humidityElement.textContent = `${response.temperature.humidity}%`;
    windSpeedElement.textContent = `${Math.round(response.wind.speed)} ${units === "metric" ? "km/h" : "mph"}`;
    temperatureElement.textContent = `${Math.round(response.temperature.current)} °${units === "metric" ? "C" : "F"}`;
    iconElement.src = response.condition.icon_url;
}

// Function to fetch and display the 5-day forecast
function displayForecast(response, units) {
    const forecastContainer = document.querySelector("#forecast");
    forecastContainer.innerHTML = ""; // Clear previous forecast

    // Log the forecast response to check its structure
    console.log("Forecast API Response:", response);

    response.daily.slice(1, 6).forEach(forecastDay => {
        const dayName = new Date(forecastDay.time * 1000).toLocaleDateString("en-US", { weekday: "short" });
        const maxTemp = `${Math.round(forecastDay.temperature.maximum)}°${units === "metric" ? "C" : "F"}`;
        const minTemp = `${Math.round(forecastDay.temperature.minimum)}°${units === "metric" ? "C" : "F"}`;

        const forecastHTML = `
            <div class="weather-forecast-day">
                <div class="weather-forecast-date">${dayName}</div>
                <img src="${forecastDay.condition.icon_url}" alt="Weather Icon">
                <div class="weather-forecast-temperatures">
                    <strong>${maxTemp}</strong> / ${minTemp}
                </div>
            </div>
        `;

        forecastContainer.insertAdjacentHTML("beforeend", forecastHTML);
    });
}

// Format the date into a readable string
function formatDate(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = days[date.getDay()];

    return `${day} ${hours}:${minutes}`; // Return formatted day and time
}

// Function to search for weather based on city and units
function searchCity(city, units = "imperial") {
    const apiKey = "b2a5adcct04b33178913oc335f405433";

    // Fetch current weather data
    const currentWeatherApiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;
    axios.get(currentWeatherApiUrl)
        .then(response => {
            refreshWeather(response.data, units);
        })
        .catch(error => {
            console.error("Error fetching current weather data:", error);
        });

    // Fetch 5-day forecast data
    const forecastApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=${units}`;
    axios.get(forecastApiUrl)
        .then(response => {
            displayForecast(response.data, units);
        })
        .catch(error => {
            console.error("Error fetching forecast data:", error);
        });
}

// Handle form submission to search for weather
function handleSearchSubmit(event) {
    event.preventDefault();
    const searchInput = document.querySelector("#search-form-input");
    const unitSelect = document.querySelector("#units");
    const selectedUnits = unitSelect.value;

    searchCity(searchInput.value, selectedUnits);
}

// Add event listener to the form
document.querySelector("#search-form").addEventListener("submit", handleSearchSubmit);

// Initial search for a default city (e.g., Tampa)
searchCity("Tampa");