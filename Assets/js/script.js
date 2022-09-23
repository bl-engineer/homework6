var key = "72579456c2145cddcdef6f3d9c3a30b9";
var city = "Atlanta";

var content = $('#content');
var main = $('#main');
var citySearch = $('input[name="city"]');
var searchBtn = $('#search');
var weatherPanel = $('<div>');
content.append(weatherPanel);

searchBtn.on('click', function() {
    var result = getWeather(citySearch.val());
});

main.on('click', function(event) {
    var clickedBtn = $(event.target);
    if (clickedBtn.hasClass('history-button')) {
        citySearch.val(clickedBtn.text());
        getWeather(citySearch.val());
    }
});

function getWeather(city) {
    var query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=imperial`;
    fetch(query)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (data.cod == 200) {
                var newQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,minutely&appid=${key}&units=imperial`; 
                fetch(newQuery)
                    .then(function (newRes) {
                        return newRes.json();
                    })
                    .then(function (newData) {
                        var m = moment();
                        content.addClass('border-left border-right border-top')
                        weatherPanel.empty();
                        var weatherPanelTitle = $('<div>');
                        weatherPanelTitle.attr('class', 'my-2 text-black');
                        weatherPanelTitle.html(`<table><tr><td><h2>${data.name} - ${m.format("dddd, MMMM Do")}</h2></td><td><img src='https://openweathermap.org/img/wn/${data.weather[0].icon}.png'></td></tr></table>`);
                        weatherPanel.append(weatherPanelTitle);

                        var weatherPanelTemp = $('<div>');
                        weatherPanelTemp.attr('class', 'm-2 d-block');
                        weatherPanelTemp.html(`<h5>Temp: ${data.main.temp}&#176;F</h5>`);
                        weatherPanel.append(weatherPanelTemp);

                        var weatherPanelWind = $('<div>');
                        weatherPanelWind.attr('class', 'm-2 d-block');
                        weatherPanelWind.html(`<h5>Wind: ${data.wind.speed} MPH</h5>`);
                        weatherPanel.append(weatherPanelWind);

                        var weatherPanelHumidity = $('<div>');
                        weatherPanelHumidity.attr('class', 'm-2 d-block');
                        weatherPanelHumidity.html(`<h5>Humidity: ${data.main.humidity}%</h5>`);
                        weatherPanel.append(weatherPanelHumidity);

                        var weatherPanelUVI = $('<div>');
                        var uvi = newData.current.uvi;
                        weatherPanelUVI.attr('class', 'p-1 m-2 d-inline-block rounded');
                        if (uvi <= 2) {
                            weatherPanelUVI.addClass('bg-success');
                        }
                        else if (uvi <= 5){
                            weatherPanelUVI.addClass('bg-warning');
                        }
                        else {
                            weatherPanelUVI.addClass('bg-danger');
                        }

                        weatherPanelUVI.html(`<h5>UV Index: ${uvi}</h5>`);
                        weatherPanel.append(weatherPanelUVI);

                        var history = $('#history');
                        if (history.length) {
                        } else {
                            history = $('<div>');
                            history.attr('class', 'w-25 p-2');
                            history.attr('id', 'history');
                            main.append(history);
                        }
                        var repeatSearch = false;
                        history.each(function() {
                            if($(this).text().match(data.name)){
                                repeatSearch = true;
                                return false;
                            }
                        })

                        if (!repeatSearch) {
                            var newBtn = $('<button>');
                            newBtn.attr('class', 'btn btn-block btn-secondary py-2 history-button');
                            newBtn.text(data.name);
                            history.prepend(newBtn);
                        } else {
                            var prevSearch = $(`#history button:contains(${data.name})`);
                            history.remove(prevSearch);
                            history.prepend(prevSearch);
                        }

                        var forecast = $('#forecast');
                        if (forecast.length) {
                            forecast.empty();
                        } else {
                            forecast = $('<div>');
                            forecast.attr('class', 'p-2 w-67 border-left border-right border-bottom');
                            forecast.attr('id', 'forecast');
                        }

                        
                        var forecastTable = $('<table>');
                        forecastTable.attr('class', 'w-100 table table-bordered table-dark mb-2');
                        var forecastTableRow = $('<tr>');

                        var day1 = $('<td>');
                        var day2 = $('<td>');
                        var day3 = $('<td>');
                        var day4 = $('<td>');
                        var day5 = $('<td>');
                        var days = [day1, day2, day3, day4, day5];
                        for (var i = 0; i < days.length; i++) {

                            var day = $('<h5>');
                            day.text(m.add(1,'days').format('M/D/YY'));
                            days[i].append(day);

                            var icon = $('<img>');
                            icon.attr('src', `https://openweathermap.org/img/wn/${newData.daily[i].weather[0].icon}.png`);
                            days[i].append(icon);

                            var temp = $('<p>');
                            temp.append('High: ' + newData.daily[i].temp.max + '&#176;F');
                            days[i].append(temp);

                            var wind = $('<p>');
                            wind.append('Wind: ' + newData.daily[i].wind_speed + ' MPH');
                            days[i].append(wind);

                            var humid = $('<p>');
                            humid.append('Humidity: ' + newData.daily[i].humidity + '%');
                            days[i].append(humid);

                            forecastTableRow.append(days[i]);
                        }
                        forecastTable.append(forecastTableRow);
                        forecast.append(forecastTable);
                        main.append(forecast);
                    })
            }
            return data;
        }
    );
}

