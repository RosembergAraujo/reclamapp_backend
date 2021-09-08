const mongoose = require('../../database/mongoose')

const PostSchema = new mongoose.Schema({
    
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    address: {
        latitude: {
            type: mongoose.Schema.Types.Number,
            require: false
        },
        longitude: {
            type: mongoose.Schema.Types.Number,
            require: false
        }
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    }],
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachments'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Post = mongoose.model('Posts', PostSchema)

module.exports = Post;