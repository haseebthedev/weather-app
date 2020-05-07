const path = require("path");
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const request = require('request');

const app = express();

// Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("/", (req, res) => {
  res.render("index", {
    createdBy: "Haseeb Ahmed",
  });
});

app.post("/",  async (req, res) => {
  if (!req.body.location || req.body.location === "") {
    return res.render("index", {
      coordinates: "Please enter any location to search !",
      createdBy: "Haseeb Ahmed"
    });
  } 
  else {
    let apiKey = '990e8f0e1a45a79fb030d76a99ad7a93';
    let city = req.body.location;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${apiKey}`

    await request(url, function (err, response, body) {
      let weather = JSON.parse(body);
      if(weather.cod === "404"){
        return res.render("index", {
          coordinates: "Unable to find location.Try another search.",
          createdBy: "Haseeb Ahmed"
        });
      } 
      else {
        let country = `${weather.name}, ${weather.sys.country}.`;
        let coordinates = `Coordinates: ${weather.coord.lat}° N, ${weather.coord.lon}° E.`;
        let message = `It is currently ${Math.round(weather.main.temp)} degrees out. Min Temp: ${Math.round(weather.main.temp_min)}°C, Max Temp: ${Math.round(weather.main.temp_max)}°C, Humidity: ${weather.main.humidity}, Pressure: ${weather.main.pressure} Pa`;

        return res.render("index", {
          country: country,
          coordinates: coordinates,
          weather: 'Weather:',
          message: message,
          createdBy: "Haseeb Ahmed"
        });
      }
    });
  }
});

app.get("/about", (req, res) => {
  res.render("about", {
    createdBy: "Haseeb Ahmed"
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    createdBy: "Haseeb Ahmed"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});
