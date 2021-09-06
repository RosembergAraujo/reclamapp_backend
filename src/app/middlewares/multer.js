const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'resources', 'image'),
    storage: multer. diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'resources', 'image'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(8, (err, hash) => {
                if(err) cb(err)

                const fileName = `${hash.toString('hex')}_${file.originalname}`

                cb(null, fileName)
            })
        }
    }),
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpg',
            'image/jpeg',
            'image/pjpeg',
            'image/png',
        ]
        if(allowedMimes.includes(file.mimetype)){
            cb(null, true)
        }else {
            cb(new Error('Invalid file extension'))
        }
    }
}  