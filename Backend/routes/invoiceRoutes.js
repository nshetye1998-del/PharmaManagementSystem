const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// POST request to create a new invoice
router.post('/add', invoiceController.createInvoice);

// GET request to fetch all invoices
router.get('/get/all', invoiceController.getAllInvoices);

// GET request to fetch a specific invoice by ID
router.get('/get/:id', invoiceController.getInvoiceById);

// PUT request to update an existing invoice by ID
router.put('/update/:id', invoiceController.updateInvoice);

// DELETE request to delete an existing invoice by ID
router.delete('/del/:id', invoiceController.deleteInvoice);

module.exports = router;
