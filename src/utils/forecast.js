require('dotenv').config();
const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.FORECAST_API_KEY}`;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services.', undefined);
        } else if (body.cod === '400') {
            callback('Unable to find location.', undefined);
        } else {
            callback(
                undefined,
                `It is currently ${body.main.temp} degrees out in ${body.name}. The minimum temperature is ${body.main.temp_min}. The maximum temperature is ${body.main.temp_max}. Humidity is ${body.main.humidity}%.`
            );
        }
    });
};

module.exports = forecast;
