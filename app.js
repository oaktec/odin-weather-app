async function getWeather(location) {
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location.toLowerCase()}&APPID=3958700c4aae1e50012ae6d3204ebd41`
    );
    let data = await response.json();

    return {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      description: data.weather[0].description,
    };
  } catch (error) {
    console.log(error);
  }
}

let weather = getWeather("london").then((weather) => {
  console.log(weather);
});
