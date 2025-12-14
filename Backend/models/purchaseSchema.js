const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    barcode: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
