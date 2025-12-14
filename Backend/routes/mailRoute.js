const express = require('express');
const { sendInvoiceEmail } = require('../controllers/sendMailController');

const router = express.Router();

// Endpoint to send invoice email
router.post('/send-invoice-email', sendInvoiceEmail);

module.exports = router;
