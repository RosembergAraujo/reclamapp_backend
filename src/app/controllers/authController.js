require('dotenv/config')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const crypto = require('crypto')
const router = express.Router()
const mailer = require('../modules/mailer')


const generateToken = (param = {}) => {
    return jwt.sign(param , process.env.AUTH_HASH, {
        expiresIn: 86400
    })
}

router.post('/register', async (req, res) => {
    const { email } = req.body
    try{
        if(await User.findOne({ email }))
            return res.status(400).send({error: 'User already exists'})

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

    if (!user) 
        return res.status(400).send({ error: 'User not found' })

    if(!await bcrypt.compare(password, user.password)) 
        return res.status(400).send({ error: 'Wrong password' })

    user.password = undefined
    
    res.send({ 
        user, 
        token: generateToken({ id: user.id }) 
    })
})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {
        
        const user = await User.findOne({ email })

        if (!user) 
            return res.status(400).send({ error: 'User not found' })

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        mailer.sendMail({
            to: email,
            from: 'bergaoDoPiggas@gmail.com',
            template: 'auth/forgot',
            context: { token }
        }), (err) => {
            if(err) 
                return res.status(400).send({ error: 'Cannot send email' })

        }
            
        return res.send() //CASE YOU LIKE TO SEND A MESSAGE TO USER, WILL BE HERE
    } catch (error) {
        res.status(400).send({ erro: 'Error on forgot password' })
    }
})

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body
    try {

        const now = new Date()

        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')

        if (!user) 
            return res.status(400).send({ error: 'User not found' })

        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Invalid Token' })
        

        if(now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Expired Token' })

        user.password = password
        user.passwordResetToken = crypto.randomBytes(20).toString('hex')

        await user.save()

        res.send()

    } catch (error) {
        if(err) 
            return res.status(400).send({ error: 'Cannot reset password' })
    }
})

module.exports = app => app.use('/auth', router)