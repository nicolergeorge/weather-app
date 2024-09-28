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

apiKey = "b5ff830c8o2f986ffadf3d6aab41t4c5"
apiURL = "https://api.shecodes.io/weather/v1/current?query={city}&key={apiKey}"