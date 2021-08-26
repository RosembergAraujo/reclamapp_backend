require('dotenv/config')

const authMiddleware = require('../middlewares/auth')

const Project = require('../models/Project')
const Task = require('../models/Task')
const User = require('../models/User')


const express = require('express')
const router = express.Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks'])
        res.send({ projects })
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error loading projects' })
    }
})

router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks'])
        res.send({ project })
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error loading project' })
    }
})

router.post('/', async (req, res) => {
    try {

        const { tittle, description, tasks } = req.body

        const project = await Project.create({ tittle, description, user: req.userId })
        
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id })

            await projectTask.save()
            
            project.tasks.push(projectTask)
        }))

        await project.save()

        res.send({ project })
    } catch (error) {
        return res.status(400).send({ error: 'Project creation fail' })
    }
})

router.put('/:projectId', async (req, res) => {
    try {

        const { tittle, description, tasks } = req.body

        const project = await Project.findByIdAndUpdate(req.params.projectId,{ 
            tittle, 
            description}, { new: true })
        

        project.tasks = []
        await Task.deleteMany({ project: project._id })    

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id })

            await projectTask.save()
            
            project.tasks.push(projectTask)
        }))

        await project.save()

        res.send({ project })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: 'Project update fail' })
    }
})

router.delete('/:projectId', async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.projectId)
        return res.send()
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error, cant delete this project' })
    }
})

module.exports = app => app.use('/projects', router)