// models/Item.js
const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    sell_price: {
        type: Number,
        required: true
    },
    unit: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    payable: {
        type: Number,
        required: true
    },
    received: {
        type: Number,
        required: true
    },
    // Add more fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema);
