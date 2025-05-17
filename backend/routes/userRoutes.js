const express = require('express')
const User = require('../models/User')
const clerk = require('@clerk/express')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    console.log("User Route Reached")
    //if user does'nt exist create else log that user already exists
    const find = await User.findByEmail(req.body.email);//probably this
    console.log(find);
    if( find == null){
      const user = await User.create(req.body)
      res.status(201).json(user)
      console.log("New user created:",user)
    }
    else{
      // User already exists → return existing ID not the
      console.log("User already exists:", find);
      res.status(200).json({ id: find.id });
    }
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.json(user)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

module.exports = router