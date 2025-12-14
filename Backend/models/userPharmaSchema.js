const mongoose = require('mongoose');

const userPharmaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    normalpass: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'medical'] },
    pharmacy: {
        name: { type: String },
        address: {
            line1: { type: String },
            line2: { type: String },
            city: { type: String }
        },
        contact: {
            phone: { type: String },
            email: { type: String }
        },
        gstin: { type: String },
        di: { type: String }
    }
});

// Conditionally require pharmacy fields based on role
userPharmaSchema.pre('save', function (next) {
    if (this.role === 'medical') {
        if (!this.pharmacy || !this.pharmacy.name || !this.pharmacy.address || !this.pharmacy.contact) {
            return next(new Error('Medical role requires pharmacy information.'));
        }
    }
    next();
});

module.exports = mongoose.model('UserPharma', userPharmaSchema);
