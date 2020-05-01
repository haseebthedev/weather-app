let request = require('request');

let apiKey = '990e8f0e1a45a79fb030d76a99ad7a93';
let city = 'rawalpindi';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${apiKey}`

request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body)
    let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
    console.log(message);
  }
});