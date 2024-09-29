document.addEventListener("DOMContentLoaded", function () {
    function refreshWeather(response, units) {
        let temperatureElement = document.querySelector("#temperature");
        let cityElement = document.querySelector("#city");
        let descriptionElement = document.querySelector("#description");
        let humidityElement = document.querySelector("#humidity");
        let windSpeedElement = document.querySelector("#wind-speed");
        let timeElement = document.querySelector("#time");
        let iconElement = document.querySelector("#icon-image");

        if (!temperatureElement || !cityElement || !descriptionElement || !humidityElement || !windSpeedElement || !timeElement || !iconElement) {
            console.error("Missing elements for displaying weather data.");
            return;
        }

        let date = new Date(response.daily[0].time * 1000);

        cityElement.innerHTML = response.city;
        descriptionElement.innerHTML = response.daily[0].condition.description;
        humidityElement.innerHTML = `${response.daily[0].temperature.humidity}%`;
        temperatureElement.innerHTML = `${Math.round(response.daily[0].temperature.day)} °${units === "metric" ? "C" : "F"}`;
        windSpeedElement.innerHTML = `${Math.round(response.daily[0].wind.speed)} ${units === "metric" ? "km/h" : "mph"}`;
        timeElement.innerHTML = formatDate(date);
        iconElement.src = response.daily[0].condition.icon_url;
    }

    function formatDate(date) {
        let minutes = date.getMinutes();
        let hours = date.getHours();
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let day = days[date.getDay()];

        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        return `${day} ${hours}:${minutes}`;
    }

    function searchCity(city, units = "imperial") {
        let apiKey = "b2a5adcct04b33178913oc335f405433";
        let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=${units}`;

        axios.get(apiUrl).then((response) => {
            refreshWeather(response.data, units);
            displayForecast(response.data, units);
        }).catch(error => {
            console.error("Error fetching weather data:", error);
        });
    }

    function displayForecast(response, units) {
        let forecastHtml = "";
        let forecastContainer = document.querySelector("#forecast");

        response.daily.slice(1, 6).forEach(function (forecastDay) {
            let date = new Date(forecastDay.time * 1000);
            let dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
            let maxTemp = Math.round(forecastDay.temperature.maximum);
            let minTemp = Math.round(forecastDay.temperature.minimum);

            forecastHtml += `
                <div class="weather-forecast-day">
                    <div class="weather-forecast-date">${dayName}</div>
                    <div class="weather-forecast-icon"><img src="${forecastDay.condition.icon_url}" alt="Weather Icon" /></div>
                    <div class="weather-forecast-temperatures">
                        <strong>${maxTemp}°${units === 'metric' ? 'C' : 'F'}</strong> / ${minTemp}°${units === 'metric' ? 'C' : 'F'}
                    </div>
                    <div class="weather-forecast-description">${forecastDay.condition.description}</div>
                </div>
            `;
        });

        forecastContainer.innerHTML = forecastHtml;
    }

    function handleSearchSubmit(event) {
        event.preventDefault();
        let searchInput = document.querySelector("#search-form-input");
        let unitSelect = document.querySelector("#units");
        let selectedUnits = unitSelect.value;
        searchCity(searchInput.value, selectedUnits);
    }

    let searchFormElement = document.querySelector("#search-form");
    searchFormElement.addEventListener("submit", handleSearchSubmit);

    searchCity("Tampa");
});
