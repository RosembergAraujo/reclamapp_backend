require('dotenv/config')
const express = require('express');
const app = express();
 
app.use(express.json());

app.get('/', (req, res) => {
    res.send('FDS')
})

require('./app/controllers/authController')(app)
require('./app/controllers/projectController')(app)


app.listen(process.env.PORT);