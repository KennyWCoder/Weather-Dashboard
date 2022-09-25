var apiKey = "239ac6aa66718510828fbf5808df1d1b";
var searchedCity = document.querySelector("#search-form");
var currentTemp = document.getElementById("current-temp");
var currentWind = document.getElementById("current-wind");
var currentHumid = document.getElementById("current-humidity");
var cityWeather = document.getElementById("city-weather");
var city = document.getElementById("selected-city");
var weatherPic = document.getElementById("weather-pic");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
var forecastWeather = document.querySelectorAll(".weather-forecast");
var clearHistory = document.getElementById("clear-history");
var showHistory = document.getElementById("search-history");

function searchFormSubmit(event) {
    event.preventDefault();

    var searchInput = document.querySelector('#search-input').value;

    if (!searchInput) {
        console.error('You need a search input value!');
        return;
    }

    getWeatherInfo(searchInput);
    searchHistory.push(searchInput);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
}

searchedCity.addEventListener('submit', searchFormSubmit);

clearHistory.addEventListener('click', function(){
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
})

//button doesn't carry the value to the getWeatherInfo function, used input instead. stored historyList into const because var can't pass the value
function renderSearchHistory() {
    showHistory.innerHTML = "";
    for (var i = 0; i < searchHistory.length; i++) {
        const historyList = document.createElement("input");
        historyList.setAttribute("type", "text");
        historyList.setAttribute("class", "btn btn-info btn-block");
        historyList.setAttribute("value", searchHistory[i]);
        historyList.setAttribute("readonly", true);
        historyList.addEventListener("click", function() {
            getWeatherInfo(historyList.value);
        })
        showHistory.append(historyList);
    }
}

renderSearchHistory();

//get current weather function
function getWeatherInfo(cityName) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            cityWeather.classList.remove("d-none");
            console.log(data);
            //using moment.js to get date because the data has dt which moment.js can convert
            var currentDate = new Date(data.dt * 1000);
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            city.innerHTML = data.name + " (" + month + "/" + day + "/" + year + ")";
            //math for getting F from Kelvin and wind mph from speed
            currentTemp.innerHTML = "Temp: " + (Math.round(((data.main.temp - 273.15) * 9 / 5 + 32) * 100) / 100) + "°F";
            weatherPic.setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
            currentWind.innerHTML = "Wind: " + (Math.round(2.23694 * data.wind.speed * 100) / 100) + " MPH";
            currentHumid.innerHTML = "Humidity: " + data.main.humidity + " %";
        })
    //request forecast api
    var requestForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
    fetch(requestForecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            for (i = 0; i < forecastWeather.length; i++) {
                forecastWeather[i].innerHTML = "";
                //because the open weather report show every 3 hours for the 5 days forecast, 3 * 8 = 24 + 4 last hours for the day
                var forecastList = i * 8 + 4;
                //create forecast Date's card
                var forecastDate = new Date(data.list[forecastList].dt * 1000);
                var forecastDay = forecastDate.getDate();
                var forecastMonth = forecastDate.getMonth() + 1;
                var forecastYear = forecastDate.getFullYear();
                var forecastInfo = document.createElement("h4");
                forecastInfo.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecastWeather[i].append(forecastInfo);

                //create img element to add weather icon
                var forecastWeatherIcon = document.createElement("img");
                forecastWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastList].weather[0].icon + "@2x.png");
                forecastWeather[i].append(forecastWeatherIcon);
                
                //create p to input forecast Tempurate
                var forecastTemp = document.createElement("p");
                forecastTemp.innerHTML = "Temp: " + (Math.round(((data.list[forecastList].main.temp - 273.15) * 9 / 5 + 32) * 100) / 100) + "°F";
                forecastWeather[i].append(forecastTemp);
                
                //create a p element to input forecast wind
                var forecastWind = document.createElement("p");
                forecastWind.innerHTML = "Wind: " + (Math.round(2.23694 * data.list[forecastList].wind.speed * 100) / 100) + " MPH";
                forecastWeather[i].append(forecastWind);

                var forecastHumid = document.createElement("p");
                forecastHumid.innerHTML = "Humidity: " + data.list[forecastList].main.humidity + " %";
                forecastWeather[i].append(forecastHumid);
            }
        })
}

