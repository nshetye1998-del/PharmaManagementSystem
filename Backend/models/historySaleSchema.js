const mongoose = require('mongoose');

const historySaleSchema = new mongoose.Schema({
    user_name: { type: String, required: true },
    barcode: { type: String, required: true },
    dose: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HistorySale', historySaleSchema);
