document.addEventListener("DOMContentLoaded", function () {
    // Function to refresh the weather information on the page
    function refreshWeather(response, units) {
        let temperatureElement = document.querySelector("#temperature");
        let cityElement = document.querySelector("#city");
        let descriptionElement = document.querySelector("#description");
        let humidityElement = document.querySelector("#humidity");
        let windSpeedElement = document.querySelector("#wind-speed");
        let timeElement = document.querySelector("#time");
        let iconElement = document.querySelector("#icon");

        // Log which elements are missing
        if (!temperatureElement) console.error("Missing #temperature");
        if (!cityElement) console.error("Missing #city");
        if (!descriptionElement) console.error("Missing #description");
        if (!humidityElement) console.error("Missing #humidity");
        if (!windSpeedElement) console.error("Missing #wind-speed");
        if (!timeElement) console.error("Missing #time");
        if (!iconElement) console.error("Missing #icon");

        // Exit the function if any element is missing
        if (!temperatureElement || !cityElement || !descriptionElement || !humidityElement || !windSpeedElement || !timeElement || !iconElement) {
            return;
        }

        // Convert Unix timestamp to date object
        let date = new Date(response.time * 1000);

        // Update the city, description, humidity, and time
        cityElement.innerHTML = response.city;
        descriptionElement.innerHTML = response.condition.description;
        humidityElement.innerHTML = `${response.temperature.humidity}%`;

        // Update wind speed and temperature based on the selected units
        if (units === "metric") {
            windSpeedElement.innerHTML = `${Math.round(response.wind.speed)} km/h`;
            temperatureElement.innerHTML = `${Math.round(response.temperature.current)} °C`;
        } else {
            windSpeedElement.innerHTML = `${Math.round(response.wind.speed / 1.609)} mph`;
            temperatureElement.innerHTML = `${Math.round(response.temperature.current)} °F`;
        }

        // Update time and icon
        timeElement.innerHTML = formatDate(date);
        iconElement.innerHTML = `<img src="${response.condition.icon_url}" alt="Weather Icon" />`;
    }

    // Function to format the date and time into a readable format
    function formatDate(date) {
        let minutes = date.getMinutes();
        let hours = date.getHours();
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let day = days[date.getDay()];

        // Add leading zero to minutes if needed
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        return `${day} ${hours}:${minutes}`;
    }

    // Function to search for the city's weather using the SheCodes API
    function searchCity(city, units = "imperial") {
        let apiKey = "b2a5adcct04b33178913oc335f405433"; // Your SheCodes API key
        let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`; // API URL

        // Fetch weather data using axios and call refreshWeather with the response data
        axios.get(apiUrl).then((response) => {
            console.log(response.data); // Log API response to check if data is coming in as expected
            refreshWeather(response.data, units);
        }).catch(error => {
            console.error("Error fetching weather data:", error);
        });
    }

    // Handle form submission, extract the city and selected units, and search for weather data
    function handleSearchSubmit(event) {
        event.preventDefault(); // Prevent form from submitting and reloading the page

        let searchInput = document.querySelector("#search-form-input"); // Get the input field for city
        let unitSelect = document.querySelector("#units"); // Get the dropdown for unit selection
        let selectedUnits = unitSelect.value; // Get the selected units (imperial or metric)

        searchCity(searchInput.value, selectedUnits); // Call searchCity with the city and selected units
    }

    // Add event listener to the form to handle search submission
    let searchFormElement = document.querySelector("#search-form");
    searchFormElement.addEventListener("submit", handleSearchSubmit);

    // Perform an initial search for a default city, e.g., Tampa
    searchCity("Tampa");
});
