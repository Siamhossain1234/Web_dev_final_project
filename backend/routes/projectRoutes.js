const express = require('express')
const Project = require('../models/project')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    console.log("Reached Route")
    const project = await Project.create(req.body)
    res.status(201).json(project)
    console.log(`project ${req.body.name} created, join code: ${req.body.join_code}`);
    console.log("Result is",project)
  } catch (error) {
    console.log("Error is",error)
    res.status(400).json({ error: error.message })
  }
})

router.get('/code', async (req,res) => {
  try {
    console.log("reached route");
    const code = req.query.code
    console.log("Searching for project with code:", code);
    const project = await Project.findByCode(code);
    res.status(201).json(project)
    console.log("Project found",project);
  } catch (error) {
    console.log("Error is",error)
    res.status(400).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    res.json(project)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

//Find project from owner_id
router.get('/:id/owner', async (req, res) => {
  try {
    console.log("Reached Owner Route");
    const project = await Project.findByOwnerId(req.params.id);
    console.log("Owner of the project is", project);
    res.json(project)
  } catch (error) {
    console.log("Finding Owner failed because", error);
    res.status(404).json({ error: error.message })
  }
})

router.post('/:id/users', async (req, res) => {
  try {
    const result = await Project.addUser(req.params.id, req.body.userId)
    res.status(201).json(result)
    console.log("Added User: ",result);
  } catch (error) {
    res.status(400).json({ error: error.message })
    console.log("User cant be added because: ",error)
  }
})

//Get projects joined
router.get('/:id/joined', async (req,res) => {
  try {
    const result = await Project.getUserProjects(req.params.id);
    res.status(201).json(result)
    console.log("User projects are: ",result)
  } catch (error) {
    res.status(400).json({ error: error.message })
    console.log("Projects can't be found because: ",error)
  }
})

// Get project users
router.get('/:id/users', async (req, res) => {
  try {
    const users = await Project.getProjectUsers(req.params.id);
    res.json(users);
    console.log("Users in project are: ", users);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router