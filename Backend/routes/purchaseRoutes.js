const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Create a new purchase
router.post('/add', purchaseController.createPurchase);

// Get all purchases
router.get('/all', purchaseController.getAllPurchases);

// Get a single purchase by ID
router.get('/get/:id', purchaseController.getPurchaseById);

// Update a purchase by ID
router.put('/update/:id', purchaseController.updatePurchase);

// Delete a purchase by ID
router.delete('/del/:id', purchaseController.deletePurchase);

module.exports = router;
