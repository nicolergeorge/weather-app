//search city name function

function handleSearchSubmit(event) {
    event.preventDefault();
    let searchInput = document.querySelector("#search-form-input");
    let cityElement = document.querySelector("#city");
    cityElement.innerHTML = searchInput.value;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

//API Info

let apiKey = "b5ff830c8o2f986ffadf3d6aab41t4c5"
let apiURL = "https://api.shecodes.io/weather/v1/current?query={city}&key={apiKey}&units=imperial"
axios.get(apiURL).then(refreshWeather);

//refresh weather function

function refreshWeather(response) {
    let temperatureElement = document.querySelector("#temperature");
    let temperature = response.data.temperature.current;
    let cityElement = document.querySelector("#city")

    cityElement.innerHTML = response.data.city;
    temperature.Element.innerHTML - Math.round(temperature);
}