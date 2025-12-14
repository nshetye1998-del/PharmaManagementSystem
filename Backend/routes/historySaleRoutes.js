const express = require('express');
const router = express.Router();
const historySaleController = require('../controllers/historySaleController');

// Get all history sales
router.get('/all', historySaleController.getAllHistorySales);

// Get a single history sale by ID
router.get('/get/:id', historySaleController.getHistorySaleById);

// Create a new history sale
router.post('/add', historySaleController.createHistorySale);

// Update a history sale by ID
router.put('/update/:id', historySaleController.updateHistorySale);

// Partially update a history sale by ID
router.patch('/edit/:id', historySaleController.patchHistorySale);

// Delete a history sale by ID
router.delete('/del/:id', historySaleController.deleteHistorySale);

module.exports = router;
