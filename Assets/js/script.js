var searchBtn = document.getElementById('search-button');
var inputVal = document.getElementById('input-value');
var searchForm = document.getElementById('search-form');
var dayValue = moment().format("dddd, MMMM Do YYYY");

// variables for current forecast div
var cityName = document.getElementById('city-name');
var currentDay = document.getElementById('current-day');
var currentTemp = document.getElementById('current-temp');
var currentWind = document.getElementById('current-wind');
var currentHumidity = document.getElementById('current-humidity');
var currentDesc = document.getElementById('current-description');
var currentUV = document.getElementById('current-UV-index');
var weatherIcon = document.getElementById('weather-icon');


//function for getting api response on entering a city and clicking the search button

function fetchWeather(event) {

    // allows to get form value
    event.preventDefault();

    var city = inputVal.value;
    var apiKey = '70d1e3c2d628a089504054baafe32a45';

    // getting api response for whatever the user enters in the input form
    // back tick for api urls to include a variable in it
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            var nameValue = data['name'];
            var tempValue = data['main']['temp'];
            var windValue = data['wind']['speed'];
            var humidityValue = data['main']['humidity'];
            var descValue = data['weather'][0]['description'];

            // code for the icon to appear to screen
            var iconValue = 'http://openweathermap.org/img/w/' + data['weather'][0]['icon'] + '.png';
            console.log(iconValue);
            weatherIcon.setAttribute('src', iconValue);

            // putting these values to their designated id's in the html for the current div
            cityName.innerHTML = nameValue;
            currentDay.innerHTML = dayValue;
            currentTemp.innerHTML = 'Temp: ' + tempValue;
            currentWind.innerHTML = 'Wind Speed: ' + windValue;
            currentHumidity.innerHTML = 'Humidity: ' + humidityValue;
            currentDesc.innerHTML = 'Description: ' + descValue;

            // code for icon
            weatherIcon.innerHTML = weatherIcon.setAttribute('src', iconValue);

            // getting coordinate values from previous api call 
            // use dot notation, unless dealing with variables or special characters
            var latValue = data.coord.lat;
            var lonValue = data.coord.lon;

            // getting coordinatee values from previous api call
            // the lat,lon below are parameters, just placeholders, everything inside the function needs to match the param
            function fetchUV(lat, lon) {
                event.preventDefault();

                var getCoord = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

                // new api call with the lat/lon value
                fetch(getCoord)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        uvValue = data.current.uvi;

                        // conditionals for uvi color to change
                        if (uvValue < 2) {
                            currentUV.innerHTML = 'UV Index: ' + uvValue;
                            currentUV.setAttribute('class', 'low');
                            console.log(currentUV.setAttribute('class', 'low'));
                        } else if (uvValue > 2 && uvValue < 6) {
                            currentUV.innerHTML = 'UV Index: ' + uvValue;
                            currentUV.setAttribute('class', 'moderate');
                            console.log(currentUV.setAttribute('class', 'moderate'))
                        } else {
                            currentUV.innerHTML = 'UV Index: ' + uvValue;
                            currentUV.setAttribute('class', 'high');
                        }

                    })
            }
            // inside the function is the arguments --> the values 
            fetchUV(latValue, lonValue);

            // function for five day forecast
            function fiveDayWeather(city) {

                event.preventDefault();

                // access image in browser
                // how are we adding image to the dom

                var getFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`

                fetch(getFiveDay)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);

                        // for loop to get data for just 5 days
                        for (var i = 0; i < 5; i++) {
                            // when indexing i need to put it under thee loop where it is being called
                            var fiveDayIcon = 'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png';
                            document.getElementById('day' + (i + 1)).innerHTML = 'Current Day: ' + data.list[i].dt_txt;
                            document.getElementById('temp' + (i + 1)).innerHTML = 'Temp: ' + data.list[i].main.temp;
                            document.getElementById('wind' + (i + 1)).innerHTML = 'Wind Speed: ' + data.list[i].wind.speed;
                            document.getElementById('humidity' + (i + 1)).innerHTML = 'Humidity: ' + data.list[i].main.humidity;
                            document.getElementById('weather' + (i + 1)).innerHTML = document.getElementById('weather' + (i + 1)).setAttribute('src', fiveDayIcon);

                        }

                    })
            }
            fiveDayWeather(city);

        })

    //  a catch error allows the code to run even with an error, not good for debugging
    // .catch(err => {
    //     console.log(err)
    //     alert('Enter a valid city name.')
    // });

};


function addCity(city) {
    var searchHistory = localStorage.getItem('search-history') || [];

    console.log(searchHistory);

    var cityIndex = searchHistory.indexOf(city);

    if (cityIndex < 0) {

        // want to add to history array
        searchHistory.push(city);

        console.log(searchHistory);

        // set the whole search history to local storage
        localStorage.setItem('search-history', searchHistory);

        // another function to show search history
        showCity();


    }
};

function showCity() {
    // get the search history, we get the search history by the key
    var storedValue = localStorage.getItem('search-history');

    // loop over the search history, use a backwards loop

    // want to start from the end
    for (var i = storedValue.length - 1; i >= 0; i--) {

        // create a button for each item in the search
        var cityButton = document.createElement('button');

        // adding class --> use bootstrap
        // cityButton.addClass('')

        // assign value to the button by setting data attribute
        cityButton.setAttribute('data-city', storedValue[i]);

        // set the text content
        cityButton.textContent = storedValue[i]

        // getting the div we want to append to
        var cityHistory = document.getElementById('city-history');

        // append each button to the div
        cityHistory.append(cityButton);

    }
};



// need to add event listener to form
searchForm.addEventListener('submit', fetchWeather);

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city





