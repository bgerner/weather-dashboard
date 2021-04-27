// if u have time - clean up repetitive code in both for loops in displayButtons/ 'search history button' section of getWeather
// fix repeating city names in cityHistoryEl
// icons don't work locally - Cross-Origin Read Blocking


var inputEl = document.getElementById('city-name');
var searchButtonEl = document.getElementById('search');
var cityHistoryEl = document.getElementById('previous-searches');
var currentWeather = document.getElementById('current-weather');
var cityHeader = document.getElementById('cityHeader');
var forecast = document.getElementById('forecast');

var forecastTitle = document.getElementById('5day');

var day1 = document.getElementById('day1');
var day2 = document.getElementById('day2');
var day3 = document.getElementById('day3');
var day4 = document.getElementById('day4');
var day5 = document.getElementById('day5');

var specificDay = [
    day1,
    day2,
    day3,
    day4,
    day5
];

var searchesArr = [];

var cities = JSON.parse(localStorage.getItem("city"));

var displayButtons = function () {
    if (cities === null) {
        return;
    }
    if (cities.length < 10) {
        for (let i = 0; i < cities.length; i++) {
            var { recentSearch, recentSearchBtn } = makeHistory(i);

        }
    }
    else {
        for (let i = cities.length - 10; i < cities.length; i++) {
            var { recentSearch, recentSearchBtn } = makeHistory(i);
        }
    }
}

var apiKey = "bf5febefea936c9144ec3f7829565d5f"

var searchFunc = function (event) {
    event.preventDefault();
    var cityName = inputEl.value;
    getWeather(cityName);
};

var prevSearch = function (event) {
    getWeather(event.target.textContent);
}


var getWeather = function (cityName) {
    var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    fetch(currentUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var lon = data.coord.lon;
                var lat = data.coord.lat;
                var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey
                fetch(oneCallUrl).then(function (response2) {
                    response2.json().then(function (weatherdata) {
                        console.log(weatherdata);

                        currentWeather.textContent = "";

                        forecast.textContent = "";

                        // search history button
                        var recentSearch = document.createElement('li');
                        var recentSearchBtn = document.createElement('button')
                        recentSearchBtn.textContent = cityName;
                        recentSearchBtn.classList = "btn btn-outline-dark";                        
                        recentSearch.appendChild(recentSearchBtn);
                        recentSearch.classList = "list-group-item recent-search";
                        cityHistoryEl.prepend(recentSearch);
                        recentSearchBtn.addEventListener("click", prevSearch);
                        searchesArr.push(cityName);
                        localStorage.setItem("city", JSON.stringify(searchesArr));

                        // current weather
                        var icon = weatherdata.current.weather[0].icon;

                        // var cityHeader = document.createElement('h2');
                        cityHeader.textContent = cityName + " (" + moment(weatherdata.current.dt * 1000).tz(weatherdata.timezone).format('MM/DD/YYYY') + ") ";
                        iconImgEl = document.createElement('img');
                        iconImgEl.setAttribute("src", "http://openweather.org/img/wn/" + icon + "@2x.png");
                        cityHeader.appendChild(iconImgEl);
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
                        uv.textContent = "UV Index: " + weatherdata.current.uvi;
                        currentWeather.appendChild(uv);

                        // 5 day forecast
                        forecastTitle.textContent = "5-Day Forecast:"
                        forecast.appendChild(forecastTitle);

                        for (let i = 1; i < 6; i++) {
                            specificDay[i - 1].textContent = "";

                            const selectDay = weatherdata.daily[i];

                            var forecastDate = document.createElement('h3');
                            forecastDate.textContent = "(" + moment(selectDay.dt * 1000).tz(weatherdata.timezone).format('MM/DD/YYYY') + ")";
                            console.log(forecastDate);
                            specificDay[i - 1].appendChild(forecastDate);

                            var forecastIcon = selectDay.weather[0].icon
                            var forecastIconImgEl = document.createElement('img');
                            forecastIconImgEl.setAttribute("src", "http://openweather.org/img/wn/" + forecastIconImgEl + "@2x.png");
                            specificDay[i - 1].appendChild(forecastIconImgEl);

                            var forecastTemp = document.createElement('p');
                            forecastTemp.textContent = "Temp: " + selectDay.temp.day;
                            specificDay[i - 1].appendChild(forecastTemp);

                            var forecastWind = document.createElement('p')
                            forecastWind.textContent = "Wind: " + selectDay.wind_speed + "MPH";
                            specificDay[i - 1].appendChild(forecastWind);

                            var forecastHumidity = document.createElement('p');
                            forecastHumidity.textContent = "Humidity: " + selectDay.humidity + "%";
                            specificDay[i - 1].appendChild(forecastHumidity);

                            forecast.appendChild(specificDay[i - 1]);
                        }
                    })
                });
            })
        }
        else {
            alert("Could not find a city by that name!");
            return
        }
    });
}

function makeHistory(i) {
    var recentSearch = document.createElement('li');
    var recentSearchBtn = document.createElement('button');
    recentSearchBtn.textContent = cities[i];
    recentSearchBtn.classList = "btn btn-outline-dark";
    recentSearch.appendChild(recentSearchBtn);
    recentSearch.classList = "list-group-item recent-search";
    cityHistoryEl.prepend(recentSearch);
    recentSearchBtn.addEventListener("click", prevSearch);
    searchesArr.push(cities[i]);
    localStorage.setItem("city", JSON.stringify(searchesArr));
    return { recentSearch, recentSearchBtn };
}

displayButtons();

searchButtonEl.addEventListener("click", searchFunc);
