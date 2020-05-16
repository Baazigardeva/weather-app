const path = require('path');
const express = require('express');
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Default paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Devanand Sharma'  
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Devanand Sharma'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helptext: 'Some helpful text',
        title: 'About Me',
        name: 'Thomas Shelby'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide address!'
        })
    }
    geocode(req.query.address, (error, {latitude, longitde, location} = {}) => {
        if(error) {
            return res.send({error})
        }

        forecast(latitude, longitde, (error, forecastData) => {
            if(error) {
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search there'
        })
    }
    console.log(req.query.search);
    res.send({
        prodcuts: {}
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Thomas Shelby',
        errorMessage: 'Help article Not Found !!'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Thomas Shelby',
        errorMessage: 'Page Not Found !!'
    })
})
/*
// Sending HTML
app.get('', (req, res) => {
    res.send('<h1>Hello Express</h1>')
})

// Sending JSON
app.get('/help', (req, res) => {
    res.send({
        name: 'Jack',
        age: 29
    })
})

// Sending Simple text
app.get('/about', (req, res) => {
    res.send('ABOUT page')
})
*/

app.listen(port, () => {
    console.log('Server is running on port ' + port);
})