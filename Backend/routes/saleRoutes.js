const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

// Create a new sale
router.post('/add', saleController.createSale);

// Get all sales
router.get('/all', saleController.getAllSales);

// Get a single sale by ID
router.get('/get/:id', saleController.getSaleById);

// Update a sale by ID
router.put('/update/:id', saleController.updateSale);

// Delete a sale by ID
router.delete('/del/:id', saleController.deleteSale);

module.exports = router;
