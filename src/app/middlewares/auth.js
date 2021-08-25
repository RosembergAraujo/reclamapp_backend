require('dotenv/config')
const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization //IF RIGHT RETURN "Bearer ${TOKEN}"

    if(!authHeader)
        return res.status(401).send({ error: 'No token provided' })
    
    const parts = authHeader.split(' ')

    if(!parts.length === 2)
        return res.status(401).send({ error: 'Token error' })
    
    const [ scheme, token ] = parts

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token malformatted' })

    jwt.verify(token, process.env.AUTH_HASH, (err, decoded) => {
        if(err) return res.status(401).send({ error: 'Invalid token' })

        req.userId = decoded.id
        return next()
    })

}