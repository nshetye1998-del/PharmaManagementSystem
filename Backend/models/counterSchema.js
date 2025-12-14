    const mongoose = require('mongoose');

    const counterSchema = new mongoose.Schema({
        id: { type: String, required: true, unique: true},
        password: { type: String, required: true }
    })

    module.exports = mongoose.model('CounterUser', counterSchema);
