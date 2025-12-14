const CounterUser = require('../models/counterSchema');

// Get all counters
exports.getAllCounters = async (req, res) => {
    try {
        const counters = await CounterUser.find();
        res.status(200).json(counters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single counter by ID
exports.getCounterById = async (req, res) => {
    try {
        const counter = await CounterUser.findById(req.params.id);
        if (!counter) {
            return res.status(404).json({ message: 'Counter not found' });
        }
        res.status(200).json(counter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new counter
exports.createCounter = async (req, res) => {
    const { id, password } = req.body;

    const counter = new CounterUser({
        id,
        password
    });

    try {
        const newCounter = await counter.save();
        res.status(201).json(newCounter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing counter
exports.updateCounter = async (req, res) => {
    const id = req.params.id;
    try {
        const counter = await CounterUser.findOne({ id });
        if (!counter) {
            return res.status(404).json({ message: 'Counter not found' });
        }

        const { password } = req.body;
        if (password) counter.password = password;

        const updatedCounter = await counter.save();
        res.status(200).json(updatedCounter);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a counter
exports.deleteCounter = async (req, res) => {
    try {
        const counter = await CounterUser.findByIdAndDelete(req.params.id);
        if (!counter) {
            return res.status(404).json({ message: 'Counter not found' });
        }
        res.status(200).json({ message: 'Counter deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};

// Login controller
exports.login = async (req, res) => {
    const { id, password } = req.body;

    try {
        // Check if the user exists
        const user = await CounterUser.findOne({ id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate password
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // If credentials are correct, return success
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
