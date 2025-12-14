// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
// const itemController = require('../../controllers/Pharmacy/billingController');
const itemController = require('../controllers/billingController');

// GET all items
router.get('/all', itemController.getItems);

// GET a single item by ID
router.get('/get/:id', itemController.getItemById);

// POST create a new item
router.post('/add', itemController.createItem);

// PUT update an existing item
router.put('/update/:id', itemController.updateItem);

// DELETE an item by ID
router.delete('/del/:id', itemController.deleteItem);

module.exports = router;
