
// ==============================
// CURRENT DATE & TIME
// ==============================

function updateDateTime() {

    const now = new Date();

    const date = now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const element = document.getElementById("dateTime");

    if (element) {
        element.innerHTML = `
            📅 ${date}<br>
            🕒 ${time}
        `;
    }
}

setInterval(updateDateTime, 1000);

updateDateTime();


// ==============================
// GET WEATHER BY CITY
// ==============================

async function getWeather() {

    const city = document.getElementById("city").value.trim();

    const result = document.getElementById("result");


    if (city === "") {

        alert("Please enter a city name!");

        return;
    }


    result.innerHTML = `
        <div class="loading">
            ⏳ Loading weather...
        </div>
    `;


    try {

        // Current Weather API

        const weatherUrl =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;


        const weatherResponse = await fetch(weatherUrl);


        if (!weatherResponse.ok) {

            throw new Error("City not found");

        }


        const weatherData = await weatherResponse.json();


        // Forecast API

        const forecastUrl =
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;


        const forecastResponse = await fetch(forecastUrl);


        if (!forecastResponse.ok) {

            throw new Error("Forecast not found");

        }


        const forecastData = await forecastResponse.json();


        // ==============================
        // CURRENT WEATHER
        // ==============================

        let resultHTML = `

            <h2>
                ${weatherData.name}, ${weatherData.sys.country}
            </h2>

            <img
                src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"
                alt="Weather Icon"
            >

            <h3 class="weather-condition">
    ${weatherData.weather[0].main}
</h3>

<div class="main-temperature">
    ${weatherData.main.temp.toFixed(1)}°C
</div>

             <div class="weather-details">

    <div class="detail-card">
        <div class="icon">🤗</div>
        <div class="label">Feels Like</div>
        <div class="value">
            ${weatherData.main.feels_like.toFixed(1)}°C
        </div>
    </div>

    <div class="detail-card">
        <div class="icon">💧</div>
        <div class="label">Humidity</div>
        <div class="value">
            ${weatherData.main.humidity}%
        </div>
    </div>

    <div class="detail-card">
        <div class="icon">💨</div>
        <div class="label">Wind</div>
        <div class="value">
            ${weatherData.wind.speed} m/s
        </div>
    </div>

</div>

            <p>
                🌅 Sunrise:
                ${new Date(
                    weatherData.sys.sunrise * 1000
                ).toLocaleTimeString()}
            </p>

            <p>
                🌇 Sunset:
                ${new Date(
                    weatherData.sys.sunset * 1000
                ).toLocaleTimeString()}
            </p>

            <hr>

            <h2>🕒 Next 24 Hours</h2>

            <div class="hourly-forecast">
        `;


        // ==============================
        // NEXT 24 HOURS
        // ==============================

        for (
            let i = 0;
            i < 8 && i < forecastData.list.length;
            i++
        ) {

            const item = forecastData.list[i];


            const date = new Date(item.dt * 1000);


            const time = date.toLocaleTimeString(
                "en-IN",
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );


            resultHTML += `

                <div class="hour-card">

                    <p class="hour-time">
                        ${time}
                    </p>

                    <img
                        src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"
                        alt="${item.weather[0].main}"
                    >

                    <p>
                        ${item.weather[0].main}
                    </p>

                    <h3>
                        ${item.main.temp.toFixed(1)} °C
                    </h3>

                </div>

            `;
        }


        resultHTML += `

            </div>

            <hr>

            <h2>📅 5-Day Forecast</h2>

            <div class="forecast">

        `;


        // ==============================
        // 5-DAY FORECAST
        // ==============================

        const dailyForecast = [];


        for (const item of forecastData.list) {

            const date = new Date(item.dt * 1000);


            const hour = date.getHours();


            const day = date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "short"
                }
            );


            // Choose forecast around midday

            if (hour >= 11 && hour <= 14) {

                if (
                    !dailyForecast.some(
                        f => f.day === day
                    )
                ) {

                    dailyForecast.push({

                        day: day,

                        temp: item.main.temp,

                        weather:
                            item.weather[0].main,

                        icon:
                            item.weather[0].icon

                    });

                }

            }

        }


        // Display forecast cards

        dailyForecast
            .slice(0, 5)
            .forEach(item => {

                resultHTML += `

                    <div class="forecast-card">

                        <h3>
                            ${item.day}
                        </h3>

                        <img
                            src="https://openweathermap.org/img/wn/${item.icon}@2x.png"
                            alt="${item.weather}"
                        >

                        <p>
                            ${item.weather}
                        </p>

                        <p>
                            🌡️ ${item.temp.toFixed(1)} °C
                        </p>

                    </div>

                `;

            });


        resultHTML += `

            </div>

        `;


        result.innerHTML = resultHTML;


    } catch (error) {

        console.log(error);


        result.innerHTML = `

            <h3>❌ City Not Found</h3>

            <p>
                Please enter a valid city name.
            </p>

        `;

    }

}


// ==============================
// USE MY LOCATION
// ==============================

function getLocation() {

    const result =
        document.getElementById("result");


    if (!navigator.geolocation) {

        result.innerHTML = `
            <h3>❌ Location not supported.</h3>
        `;

        return;
    }


    result.innerHTML = `

        <div class="loading">
            📍 Getting your location...
        </div>

    `;


    navigator.geolocation.getCurrentPosition(

        async function(position) {

            const lat =
                position.coords.latitude;

            const lon =
                position.coords.longitude;


            try {

                const url =
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;


                const response =
                    await fetch(url);


                if (!response.ok) {

                    throw new Error(
                        "Weather unavailable"
                    );

                }


                const data =
                    await response.json();


                document.getElementById("city").value =
                    data.name;


                getWeather();


            } catch (error) {

                console.log(error);


                result.innerHTML = `

                    <h3>
                        ❌ Unable to get weather.
                    </h3>

                `;

            }

        },


        function(error) {

            result.innerHTML = `

                <h3>
                    ❌ Location permission denied.
                </h3>

                <p>
                    Please allow location access
                    and try again.
                </p>

            `;

        }

    );

}


// ==============================
// PRESS ENTER TO SEARCH
// ==============================

document
    .getElementById("city")
    .addEventListener(
        "keypress",
        function(e) {

            if (e.key === "Enter") {

                getWeather();

            }

        }
    );
// Refresh current city weather
function refreshWeather() {

    const city = document.getElementById("city").value.trim();

    if (city === "") {
        alert("Search for a city first!");
        return;
    }

    getWeather();
}