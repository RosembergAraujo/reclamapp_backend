require('dotenv/config')

const express = require('express')
const multer = require('multer')
const authMiddleware = require('../middlewares/auth')
const multerConfig = require('../middlewares/multer')
const ImageStorage = require('../models/ImageStorage')
const path = require('path')
const router = express.Router()

router.use(authMiddleware)

router.post('/', multer(multerConfig).single("file"), async (req, res) => {
    try {
        const fileInfo = req.file
        const storage = await ImageStorage.create({ "address": fileInfo.filename, "user": req.userId })

        res.send({ storage })
    } catch (error) {
        console.log(error)
        res.status(400).send({ "error": "Error while send this file" })
    }
})

router.get('/:imgId', async (req, res) => {
    try {
        res.sendFile(path.resolve(__dirname, '..', '..', 'resources', 'image') + `/${req.params.imgId}`) //OR res.dowload, test with frontend
    } catch (error) {
        console.log(error)
        res.status(404).send({ "error": "Cant find this img" })
    }
})

module.exports = app => app.use('/storage', router)
