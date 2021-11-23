const asyncRequest = require("async-request");
const e = require("express");

const getWeather = async (location) => {
  const accessKey = "d85da693dc528e1aa60f97e5c79da162";

  const url = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${location}`;

  const res = await asyncRequest(url);

  const data = JSON.parse(res.body);

  try {
    const weather = {
      isSuccess: true,
      region: data.location.region,
      country: data.location.country,
      temperature: data.current.temperature,
      wind_speed: data.current.wind_speed,
      precip: data.current.precip,
      cloudcover: data.current.cloudcover,
    };
    console.log("weather: ", weather);
    return weather;
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      error,
    };
  }
};

// getWeather("BangKok");

const express = require("express");
const app = express();
const path = require("path");

const pathPublic = path.join(__dirname, "./public"); // __dirname là đường dẫn tuyệt đối dẫn đến file mình đang code (cụ thể là file app.js), kết hợp với ./public để đưa đường dẫn vào file public
app.use(express.static(pathPublic));

// https:localhost:7000/
app.get("/", async (req, res) => {
  const param = req.query;
  const location = param.address;
  const weather = await getWeather(location);
  console.log(weather);
  if (location) {
    res.render("weather", {
      status: true,
      region: weather.region,
      country: weather.country,
      temperature: weather.temperature,
      wind_speed: weather.wind_speed,
      precip: weather.precip,
      cloudcover: weather.cloudcover,
    });
  } else {
    res.render("weather", {
      status: false,
    });
  }
});

app.set("view engine", "hbs"); // ngoài hbs còn có pug

const port = 7000;

app.listen(port, () => {
  console.log(`app run on https:localhost:${port}/`);
}); // lắng nghe port -> chạy hàm call back
