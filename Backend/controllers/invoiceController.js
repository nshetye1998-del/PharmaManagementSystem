const Invoice = require('../models/invoiceSchema');
const EmailService = require('../services/emailService');
const Drug = require('../models/drugSchema');
const mongoose = require('mongoose');
// Create a new invoice
exports.createInvoice = async (req, res, next) => {
    try {
        const newInvoice = new Invoice(req.body);
        console.log(req.body);

        // Decrement drug quantities
        for (const item of req.body.items) {
            const drug = await Drug.findOne({ barcode: item.barcode });
            if (!drug) {
                throw new Error(`Drug with barcode ${item.barcode} not found`);
            }

            if (drug.quantity < item.quantity) {
                throw new Error(`Insufficient stock for drug ${item.itemName}`);
            }

            drug.quantity -= item.quantity;
            await drug.save();
        }

        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (err) {
        next(err);
    }
};


// Get a specific invoice by ID
exports.getInvoiceById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (err) {
        next(err);
    }
};

// Get all invoices
exports.getAllInvoices = async (req, res, next) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (err) {
        next(err);
    }
};

// Update an existing invoice
exports.updateInvoice = async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(updatedInvoice);
    } catch (err) {
        next(err);
    }
};

// Delete an existing invoice
exports.deleteInvoice = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(id);
        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json({ message: 'Invoice deleted successfully' });
    } catch (err) {
        next(err);
    }
};
