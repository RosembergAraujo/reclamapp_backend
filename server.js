require('dotenv/config')
const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
const JSZip = require("jszip")
const path = require('path')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

/* ROUTES */
require('./src/app/controllers/index')(app)


app.get('/', async(req,res)=> {
    res.sendFile('./splash.png', { root: __dirname })
})

app.get('/zip', async (req, res)=> { //DOWLOAD ALL IMGS :) JUST COUSE I HAVE NO MONEY TO PAY AN STORAGE 
    const zip = new JSZip();

    fs.readdirSync(__dirname + `/src/resources/image`)
        .forEach(file => {
            zip.file(file, fs.readFileSync(`./src/resources/image/${file}`), { base64: true });
        })
    const content = await zip.generateAsync({ type: "nodebuffer" });

    fs.writeFileSync("images.zip", content)

    res.download('./images.zip')
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Listen on ${process.env.PORT}`)
})