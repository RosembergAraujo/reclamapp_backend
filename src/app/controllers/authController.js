require('dotenv/config')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()



const generateToken = (param = {}) => {
    return jwt.sign(param , process.env.AUTH_HASH, {
        expiresIn: 86400
    })
}

router.post('/register', async (req, res) => {
    const { email } = req.body
    try{

        if(await User.findOne({ email })){ return res.status(400).send({error: 'User already exists'}) }

        const user = await User.create(req.body)

        user.password = undefined;
        
        res.send({ 
            user, 
            token: generateToken({ id: user.id }) 
        })

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Registration Fail' })
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body


    const user = await User.findOne({ email }).select('+password')

    if (!user) return res.status(400).send({ error: 'User not found' })

    if(!await bcrypt.compare(password, user.password)) 
        return res.status(400).send({ error: 'Wrong password' })

    user.password = undefined
    
    res.send({ 
        user, 
        token: generateToken({ id: user.id }) 
    })
})


module.exports = app => app.use('/auth', router)