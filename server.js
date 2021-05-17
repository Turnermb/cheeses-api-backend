//////////
// DEPENDENCIES
//////////
// Get .env variables
require('dotenv').config()
// Pull PORT from .env
const {PORT = 8080, MONGODBURI} = process.env
// Import express
const express = require('express')
// Create application project
const app = express()
// Import mongoose
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODBURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection events
mongoose.connection
    .on("open", () => console.log('You are now connected to mongoose'))
    .on('close', () => console.log('You are no longer connected to mongoose'))
    .on('error', (error) => console.log(error))

//////////
// MODELS
//////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheese = mongoose.model('Cheese', CheeseSchema)

//////////
// MIDDLEWARE
//////////
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

//////////
// ROUTES
//////////
// Create a test route
app.get('/', (req, res) => {
    res.send("Hello, is it me you're looking for?")
})

// Cheeses index route
app.get('/cheeses', async (req, res) => {
    try {
        // Send all cheeses
        res.json(await Cheese.find({}))
    } catch (error){
        // Send error
        res.status(400).json(error)
    }
})

// Cheeses create route
app.post('/cheeses', async (req, res) => {
    try {
        //Send all cheeses
        res.json(await Cheese.create(req.body))
    } catch (error) {
        // Send error
        res.status(400).json(error)
    }
})

// Cheeses update route
app.put('/cheeses/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Cheeses delete route
app.delete('/cheeses/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})
//////////
// LISTENER
//////////
app.listen(PORT, () => console.log(`Port ${PORT} is clear for takeoff.`))
