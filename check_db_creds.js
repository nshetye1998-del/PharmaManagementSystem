const mongoose = require('mongoose');
const UserPharma = require('./Backend/models/userPharmaSchema');
const CounterUser = require('./Backend/models/counterSchema');
require('dotenv').config({ path: './Backend/.env' });

const URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pharmacy";

async function checkCreds() {
    try {
        await mongoose.connect(URL);
        console.log("Connected to DB");

        const users = await UserPharma.find({});
        console.log("\n--- Admin/Medical Users ---");
        if (users.length === 0) {
            console.log("No Admin users found.");
            // Create default admin
            const defaultAdmin = new UserPharma({
                name: "Admin User",
                email: "admin@example.com",
                contact: "1234567890",
                password: "password123", // In a real app this should be hashed, but let's see if the app expects plain text or handles hashing in the model hook (not seen in schema file) or controller.
                // Re-checking schema: no pre-save hash hook in schema file. 
                // Controller likely hashes it. 
                // But wait, there is a 'normalpass' field.
                normalpass: "password123",
                role: "admin"
            });
            // If the controller hashes, we might be in trouble inserting directly unless we hash it.
            // But let's check if the generic login uses bcrypt compare or simple compare. 
            // For now, I'll just report "Empty" and ask user if they want me to create one properly (which might involve looking at the controller).
        } else {
            users.forEach(u => {
                console.log(`Email: ${u.email}`);
                console.log(`Role: ${u.role}`);
                console.log(`NormalPass (Plain?): ${u.normalpass}`);
                console.log(`Password (Hash?): ${u.password.substring(0, 10)}...`);
                console.log("-------------------");
            });
        }

        const counters = await CounterUser.find({});
        console.log("\n--- Counter Users ---");
        if (counters.length === 0) {
            console.log("No Counter users found.");
        } else {
            counters.forEach(c => {
                console.log(`ID: ${c.id}`);
                console.log(`Password: ${c.password}`);
                console.log("-------------------");
            });
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.connection.close();
    }
}

checkCreds();
