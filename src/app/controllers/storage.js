require('dotenv/config')

const express = require('express')
const multer = require('multer')
const multerConfig = require('../middlewares/multer')
const path = require('path')
const router = express.Router()

router.post('/',multer(multerConfig).single("file"), async (req, res) => {
    const fileInfo = req.file
    return res.send({ "fileInfo": fileInfo })
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