require('dotenv/config')

const authMiddleware = require('../middlewares/auth')
const Post = require('../models/Post')
const Attachment = require('../models/Attachment')
const User = require('../models/User')


const express = require('express')
const router = express.Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate(['user', 'attachments'])
        res.send({ posts })
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error loading posts' })
    }
})

router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate(['user', 'attachments'])
        res.send({ post })
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error loading post' })
    }
})

router.post('/', async (req, res) => {
    try {

        const { tittle, description, attachments } = req.body

        const post = await Post.create({ tittle, description, user: req.userId })
        
        await Promise.all(attachments.map(async attachment => {
            const postAttachment = new Attachment({ 
                ...attachment, 
                assignedTo: post._id, 
                user: req.userId 
            })

            await postAttachment.save()
            
            post.attachments.push(postAttachment)
        }))

        await post.save()

        res.send({ post })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: 'Project creation fail' })
    }
})

router.put('/:postId', async (req, res) => {
    try {

        const { tittle, description, attachments } = req.body

        const post = await Post.findByIdAndUpdate(req.params.postId ,{ tittle, description}, { new: true })

        post.attachments = []

        await Attachment.deleteMany({ assignedTo: post._id })  
        
        await Promise.all(attachments.map(async attachment => {
            const postAttachment = new Attachment({ 
                ...attachment, 
                assignedTo: post._id, 
                user: req.userId 
            })

            await postAttachment.save()
            
            post.attachments.push(postAttachment)
        }))

        await post.save()

        res.send({ post })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: 'Project update fail' })
    }
})

router.delete('/:postId', async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.postId)
        return res.send()
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error, cant delete this post' })
    }
})

module.exports = app => app.use('/posts', router)