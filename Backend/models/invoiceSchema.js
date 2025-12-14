const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Counter Schema
const counterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Invoice Schema
const invoiceSchema = new Schema({
    invoiceNumber: { type: Number, unique: true },
    customername: { type: String, required: true },
    paymentMode: {
        type: String,
        enum: ['Online', 'Offline'],
        required: true
    },
    email: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    items: [
        {
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
            cost_price: {
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
            totalcostamount: {
                type: Number,
                required: true
            }
        }
    ]
});

// Pre-save hook to auto-increment invoiceNumber
invoiceSchema.pre('save', async function (next) {
    const doc = this;
    try {
        if (!doc.invoiceNumber) {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'invoiceId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            ).exec();
            doc.invoiceNumber = counter.seq;
        }
        next();
    } catch (err) {
        next(err);
    }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
