const express = require('express')
const app = express()
const port = process.env.Port || 3000


const path = require("path")


const publicDirectory = path.join(__dirname, '../public')
app.use(express.static(publicDirectory))
app.set('view engine', 'hbs');

const viewsDirectory = path.join(__dirname, "../template/views")

app.set("views", viewsDirectory)


var hbs = require('hbs')
const partialPath = path.join(__dirname, "../template/partials")
hbs.registerPartials(partialPath)


app.get('/', (req, res) =>
{
    res.render('index', {
        title: "HOME",
        desc: "this is home page",
        message:"WELCOME TO WEATHER APP"
    })
})





const geocode = require('./tools/geocode')
const forecast = require('./tools/forecastFile')

app.get('/weather', (req, res) =>


{

    if (!req.query.address)
    {
        return res.send({ error: " please enter address " })
    }
    geocode(req.query.address, (error, data) =>
    {
        if (error)
        {
            return res.send({ error })
        }
        forecast(data.latitude, data.longitude, (error, forcastData) =>
        {
            if (error)
            {
                return res.send({ error })
            }
            res.send({
                forecast: forcastData,
                location: req.query.address,
                latitude: data.latitude,
                longitude: data.longitude

            })
        })
    })
})











app.get('*', (req, res) =>
{
    res.send('404 page not found')
})


app.listen(port, () =>
{
    console.log(`running server on port ${port}`)
})
// 1- get data from API