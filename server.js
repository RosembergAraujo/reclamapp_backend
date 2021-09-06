require('dotenv/config')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

/* ROUTES */
require('./src/app/controllers/index')(app)


app.get('/', async(req,res)=> {
    res.sendFile('./splash.png')
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Listen on ${process.env.PORT}`)
})