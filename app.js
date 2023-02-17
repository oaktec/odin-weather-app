async function getWeather(location) {
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location.toLowerCase()}&APPID=3958700c4aae1e50012ae6d3204ebd41`
    );
    let data = await response.json();

    return interpretWeather(data);
  } catch (error) {
    console.log(error);
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
function validateSearch() {
  if (cityInput.value === "") {
    alert("Please enter a city name");
    return false;
  }
  if (cityInput.value.length < 3) {
    alert("Please enter a valid city name");
    return false;
  }
  if (cityInput.value.length > 20) {
    alert("Please enter a valid city name");
    return false;
  }
  if (cityInput.value.match(/^[a-zA-Z]+$/)) return true;
  return false;
}

const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-btn");
searchButton.addEventListener("click", (e) => {
  if (!validateSearch()) {
    e.preventDefault();
    return;
  }
  getWeather(cityInput.value).then((data) => {
    console.log(data);
  });
  e.preventDefault();
});
