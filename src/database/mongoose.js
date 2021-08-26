require('dotenv/config')
const mongoose = require('mongoose')

const databaseName = 'React-Native'

const URI = `mongodb+srv://Mongo:${process.env.DB_PASS}@cluster0.rcaim.mongodb.net/${databaseName}?retryWrites=true&w=majority`

mongoose.connect(URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
})

mongoose.Promise = global.Promise

module.exports = mongoose

