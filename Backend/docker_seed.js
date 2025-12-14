const mongoose = require('mongoose');
const UserPharma = require('./models/userPharmaSchema');
const CounterUser = require('./models/counterSchema');
const Drug = require('./models/drugSchema');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pharmacy';

const seedData = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Database Connected for Seeding');

        // Create Admin
        // Note: AdminLogin.jsx uses hardcoded 'Pharma'/'pharma123' and does NOT check DB. 
        // But we create one in DB just in case future-proofing is needed.
        // We will create a Medical/Admin user if needed by backend logic.

        // Create Counter User (Used for POS Login)
        const counterId = 'counter1';
        const counterPass = '1234';
        // Check if exists
        let counter = await CounterUser.findOne({ id: counterId });
        if (!counter) {
            counter = new CounterUser({ id: counterId, password: counterPass });
            await counter.save();
            console.log('Counter User Created: counter1 / 1234');
        } else {
            console.log('Counter User already exists');
        }

        // Create Sample Drugs
        const drugs = [
            {
                name: 'Paracetamol',
                type: 'Tablet',
                barcode: '1001',
                dose: '500mg',
                cost_price: 20,
                sell_price: 25,
                expiry: '2026-12',
                company_name: 'PharmaCorp',
                production_date: '2023-01',
                expiration_date: '2026-12',
                place: 'Rack 1',
                quantity: 100
            },
            {
                name: 'Amoxicillin',
                type: 'Capsule',
                barcode: '1002',
                dose: '250mg',
                cost_price: 40,
                sell_price: 55,
                expiry: '2025-06', // Expired relative to 2025-12
                company_name: 'MediLife',
                production_date: '2023-01',
                expiration_date: '2025-06',
                place: 'Rack 2',
                quantity: 50
            },
            {
                name: 'Cough Syrup',
                type: 'Syrup',
                barcode: '1003',
                dose: '100ml',
                cost_price: 80,
                sell_price: 110,
                expiry: '2025-10', // Expired
                company_name: 'CureAll',
                production_date: '2023-05',
                expiration_date: '2025-10',
                place: 'Rack 3',
                quantity: 30
            },
            {
                name: 'Vitamin C',
                type: 'Tablet',
                barcode: '1004',
                dose: '500mg',
                cost_price: 15,
                sell_price: 25,
                expiry: '2027-01',
                company_name: 'NutriHealth',
                production_date: '2024-01',
                expiration_date: '2027-01',
                place: 'Rack 1',
                quantity: 200
            }
        ];

        for (const d of drugs) {
            const exists = await Drug.findOne({ barcode: d.barcode });
            if (!exists) {
                await new Drug(d).save();
                console.log(`Drug Added: ${d.name}`);
            } else {
                console.log(`Drug Exists: ${d.name}`);
            }
        }

        console.log('Seeding Completed Successfully');
        process.exit();
    } catch (err) {
        console.error('Seeding Failed:', err);
        process.exit(1);
    }
};

seedData();
