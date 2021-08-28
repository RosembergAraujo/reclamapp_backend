const mongoose = require('../../database/mongoose')

const AttachmentSchema = new mongoose.Schema({
    
    title: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Attachment = mongoose.model('Attachments', AttachmentSchema)

module.exports = Attachment;