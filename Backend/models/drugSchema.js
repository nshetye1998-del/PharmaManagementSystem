const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    barcode: { type: String, required: true, unique: true },
    dose: { type: String, required: true },
    cost_price: { type: Number, required: true },
    sell_price: { type: Number, required: true },
    expiry: { type: String, required: true },
    company_name: { type: String, required: true },
    production_date: { type: String, required: true },
    expiration_date: { type: String, required: true },
    place: { type: String, required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Drug', drugSchema);
