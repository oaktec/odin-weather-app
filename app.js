async function getWeather(location) {
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location.toLowerCase()}&APPID=3958700c4aae1e50012ae6d3204ebd41`
    );
    let data = await response.json();
    if (data.cod === "404") {
      alert(`Could not find city: ${location}`);
      return Promise.reject("Could not find city");
    }
    return interpretWeather(data);
  } catch (error) {
    console.log("shizer", error);
  }
}
async function getGif(description) {
  try {
    let response = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=AJJRfT5nQ3pUksOJEeUgMONW3EiGMUBl&s=${description}`
    );
    let data = await response.json();
    return {
      src: data.data.images.original.url,
      ratio: data.data.images.original.width / data.data.images.original.height,
    };
  } catch (err) {
    console.log(err);
  }
}
function interpretWeather(data) {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    description: data.weather[0].description,
  };
}
function validateSearch(city) {
  if (city === "") {
    alert("Please enter a city name");
    return false;
  }
  if (city.length < 3) {
    alert("Please enter a valid city name");
    return false;
  }
  if (city.length > 20) {
    alert("Please enter a valid city name");
    return false;
  }
  if (city.match(/^[a-zA-Z ]+$/)) return true;
  alert("Please enter a valid city name");
  return false;
}
function presentWeather(weather, stringifyTempFn) {
  const cityName = document.querySelector("#city-name");
  const weatherDescription = document.querySelector("#weather-description");
  const temperature = document.querySelector("#temp");
  const weatherGif = document.querySelector("#weather-gif");
  const gifLoading = document.querySelector("#gif-loading");

  cityName.textContent = `${weather.city}, ${weather.country}`;
  weatherDescription.textContent = weather.description;
  temperature.textContent = stringifyTempFn(weather.temperature);

  gifLoading.textContent = "Loading relevant gif...";
  getGif(weather.description).then((data) => {
    weatherGif.src = data.src;
    weatherGif.style.width = `min(50vw, 50vh * ${data.ratio})`;
    weatherGif.style.height = `min(50vh, 50vw / ${data.ratio})`;
    weatherGif.style.display = "block";
  });
  gifLoading.textContent = "";
}
function renderLoading() {
  const cityName = document.querySelector("#city-name");
  const weatherDescription = document.querySelector("#weather-description");
  const temperature = document.querySelector("#temp");
  const weatherGif = document.querySelector("#weather-gif");

  cityName.textContent = "";
  weatherDescription.textContent = "Loading...";
  temperature.textContent = "";
  weatherGif.src = "";
  weatherGif.style.display = "none";
}
function kelvinToFahrenheit(kelvin) {
  return (kelvin - 273.15) * (9 / 5) + 32;
}
function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}
function stringifyFahrenheitFromKelvin(kelvin) {
  return `${kelvinToFahrenheit(kelvin).toFixed(2)}°F`;
}
function stringifyCelsiusFromKelvin(kelvin) {
  return `${kelvinToCelsius(kelvin).toFixed(2)}°C`;
}

(function () {
  const cityInput = document.querySelector("#city-input");
  const searchButton = document.querySelector("#search-btn");
  let stringifyTempFn = stringifyCelsiusFromKelvin;
  searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    let city = cityInput.value;
    if (!validateSearch(city)) return;
    renderLoading();
    getWeather(cityInput.value)
      .then((data) => {
        presentWeather(data, stringifyTempFn);
      })
      .catch((err) => {
        document.querySelector("#weather-description").textContent = "";
        console.log(err);
      });
  });
  const unitToggle = document.querySelector("#unit-toggle-input");
  unitToggle.addEventListener("change", (e) => {
    // true = fahrenheit, false = celsius
    stringifyTempFn = e.target.checked
      ? stringifyFahrenheitFromKelvin
      : stringifyCelsiusFromKelvin;
    getWeather(cityInput.value)
      .then((data) => {
        presentWeather(data, stringifyTempFn);
      })
      .catch((err) => console.log(err));
  });
})();
