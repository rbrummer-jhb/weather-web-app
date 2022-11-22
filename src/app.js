const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const port = process.env.PORT || 5500;

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Sherlock',
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Watson',
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Moriarty',
        helpText: 'This is some helpful text',
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address',
        });
    }
    const address = req.query.address;
    console.log({ address });

    geocode(address, (error, { latitude, longitude, location } = {}) => {
        console.log(error ? { error } : { latitude, longitude, location });

        if (error) return res.send({ error });

        forecast(latitude, longitude, (error, forecastData) => {
            console.log(error ? { error } : { forecastData });
            
            if (error) return res.send({ error });
            
            res.send({
                location,
                forecast: forecastData,
                address
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({ error: 'You must provide a search term' });
    }

    console.log(req.query.search);
    res.send({
        products: [],
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        error: 'Help article not found',
        name: 'Alpha',
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        error: 'Page not found',
        name: 'Bravo',
    });
});

// const address = process.argv[2];

// if (!address) {
//     console.log('Please provide an address.');
// } else {
//     geocode(address, (error, { latitude, longitude, location } = {}) => {
//         console.log(error ? { error } : { latitude, longitude, location });

//         forecast(latitude, longitude, (error, forecastData) => {
//             console.log(error ? { error } : { forecastData });
//         });
//     });
// }
