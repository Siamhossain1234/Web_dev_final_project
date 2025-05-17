const express = require('express')
const Ticket = require('../models/Ticket.js')

const router = express.Router()

// Create a new ticket
router.post('/', async (req, res) => {
  try {
    console.log("Received ticket data:", req.body);
    const ticket = await Ticket.create(req.body)
    console.log("Created ticket:", ticket);
    res.status(201).json(ticket)
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(400).json({ error: error.message })
  }
})

// Get ticket by ID
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
    res.json(ticket)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

// Get all tickets for a project
router.get('/:projectId/project', async (req, res) => {
  try {
    const tickets = await Ticket.findByProject(req.params.projectId)
    res.json(tickets)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

// Update ticket status
router.patch('/:id/status', async (req, res) => {
  try {
    const ticket = await Ticket.updateStatus(req.params.id, req.body.status)
    res.json(ticket)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update ticket assignee
router.patch('/:id/assignee', async (req, res) => {
  try {
    const ticket = await Ticket.updateAssignee(req.params.id, req.body.assignee_id)
    res.json(ticket)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router