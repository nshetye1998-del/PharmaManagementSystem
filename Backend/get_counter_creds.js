const mongoose = require('mongoose');
const CounterUser = require('./models/counterSchema');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pharmacy')
    .then(async () => {
        const user = await CounterUser.findOne({});
        console.log('Counter User:', user);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
