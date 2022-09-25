var apiKey = "239ac6aa66718510828fbf5808df1d1b";
var searchedCity = document.querySelector("#search-form");
var currentTemp = document.getElementById("current-temp");
var currentWind = document.getElementById("current-wind");
var currentHumid = document.getElementById("current-humidity");
var cityWeather = document.getElementById("city-weather");

function searchFormSubmit(event) {
    event.preventDefault();
  
    var searchInput = document.querySelector('#search-input').value;

    if (!searchInput) {
      console.error('You need a search input value!');
      return;
    }
  
    getCurrentApi(searchInput);
  }
  
  searchedCity.addEventListener('submit', searchFormSubmit);

function getCurrentApi(cityName) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    fetch(requestUrl)
        .then(function (response) {
            cityWeather.classList.remove("d-none");
        })
}

