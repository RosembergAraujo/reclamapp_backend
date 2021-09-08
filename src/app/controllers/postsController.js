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
        if(posts.length > 0) 
            res.send({ posts })
        else 
            res.status(404).send({ error: 'There is no posts yet' })
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error loading posts' })
    }
})

router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate(['user', 'attachments'])
        
        if(post !== null) 
            res.send({ post })
        else 
            res.status(404).send({ error: 'Cant find this post' })

        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error loading post' })
    }
})

router.post('/', async (req, res) => {
    try {

        const { tittle, description, attachments, address } = req.body

        const post = await Post.create({ tittle, description, address, user: req.userId })
        
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
        const post = await Post.findById(req.params.postId)
        
        if(post.user.toString() !== req.userId)
            return res.status(400).send({ error: 'Error, you are not owner of this post' })
        else {
            await Promise.all(post.attachments.map(async attachmentId => {
                await Attachment.findByIdAndRemove(attachmentId)
            }))
        
            await Post.findByIdAndRemove(req.params.postId)

            return res.send()
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error, cant delete this post' })
    }
})

router.put('/like/:postId', async (req, res) => {
    try {

        const post = await Post.findById(req.params.postId)
        
        const userId = req.userId
        
        const likeFound = post.likes.filter(likes => likes.toString() === req.userId )
        
        if(likeFound.length === 0) { //User hasn't liked this post yet
            post.likes.push(req.userId)
        }else {
            post.likes = post.likes.filter(likes => likes != userId)
        }

        await post.save()

        res.send({ post })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: 'Project update fail' })
    }
})

module.exports = app => app.use('/posts', router)