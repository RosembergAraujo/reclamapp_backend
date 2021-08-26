const mongoose = require('../../database/mongoose')

const ProjectSchema = new mongoose.Schema({
    
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
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Project = mongoose.model('Projects', ProjectSchema)

module.exports = Project;