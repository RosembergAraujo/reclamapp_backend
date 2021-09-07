const mongoose = require('../../database/mongoose')

const ImageStorageSchema = new mongoose.Schema({
    
    address: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ImageStorage = mongoose.model('ImageStorages', ImageStorageSchema)

module.exports = ImageStorage;