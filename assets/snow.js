var inputEl = document.getElementById('city-name');
var buttonEl = document.getElementById('search');
var cityHistoryEl = document.getElementById('previous-searches');
var currentWeather = document.getElementById('current-weather');
var forecast = document.getElementById('forecast');

var apiKey = "bf5febefea936c9144ec3f7829565d5f"

var searchFunc = function(event) {
    event.preventDefault();
    var city = inputEl.value;
    getWeather(city);
};

var getWeather = function(cityName) {
    var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    fetch(currentUrl).then(function(response) {
        response.json().then(function(data) {
            var lon = data.coord.lon;
            var lat = data.coord.lat;
            var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey
            fetch(oneCallUrl).then(function(response2) {
                response2.json().then(function(weatherdata) {
                    console.log(weatherdata);


                    var recentSearch = document.createElement('li');
                    var recentSearchBtn = document.createElement('button')
                    recentSearchBtn.textContent = cityName;
                    recentSearchBtn.classList = "btn btn-outline-dark"
                    recentSearch.appendChild(recentSearchBtn);
                    recentSearch.classList = "list-group-item recent-search";
                    cityHistoryEl.prepend(recentSearch);

                    var cityHeader = document.createElement('h2');
                    cityHeader.textContent = cityName // + current date based on city + weather-indicative icon
                    currentWeather.appendChild(cityHeader);
                    var temp = document.createElement('p');
                    temp.textContent = "Temp: " + weatherdata.current.temp + "°F";
                    currentWeather.appendChild(temp);
                    var wind = document.createElement('p')
                    wind.textContent = "Wind: " + weatherdata.current.wind_speed + "MPH";
                    currentWeather.appendChild(wind);
                    var humidity = document.createElement('p');
                    humidity.textContent = "Humidity: " + weatherdata.current.humidity + "%";
                    currentWeather.appendChild(humidity);
                    var uv = document.createElement('p');
                    uv.textContent = "UV Index: " + weatherdata.current.uvi
                    currentWeather.appendChild(uv);
                })
            });
        })
    });
}

buttonEl.addEventListener("click", searchFunc)