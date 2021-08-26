const mongoose = require('../../database/mongoose')

const TaskSchema = new mongoose.Schema({
    
    title: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        require: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    completed: {
        type: Boolean,
        require: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Task = mongoose.model('Tasks', TaskSchema)

module.exports = Task;