const express = require('express');
const router = express.Router();
const counterController = require('../controllers/counterController');

// Get all counters
router.get('/all', counterController.getAllCounters);

// Get a single counter by ID
router.get('/get/:id', counterController.getCounterById);

// Create a new counter
router.post('/add', counterController.createCounter);

// Update an existing counter
router.put('/update/:id', counterController.updateCounter);

// Delete a counter
router.delete('/del/:id', counterController.deleteCounter);

// Login route
router.post('/login', counterController.login);

module.exports = router;
