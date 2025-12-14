const Purchase = require('../models/purchaseSchema');

// Create a new purchase
exports.createPurchase = async (req, res) => {
    const { company_name, barcode, type, price, amount, name, quantity } = req.body;

    try {
        const newPurchase = new Purchase({
            company_name,
            barcode,
            type,
            price,
            amount,
            name,
            quantity
        });

        const savedPurchase = await newPurchase.save();
        res.status(201).json(savedPurchase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all purchases
exports.getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find();
        res.status(200).json(purchases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single purchase by ID
exports.getPurchaseById = async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }
        res.status(200).json(purchase);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a purchase by ID
exports.updatePurchase = async (req, res) => {
    try {
        const updatedPurchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedPurchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }
        res.status(200).json(updatedPurchase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a purchase by ID
exports.deletePurchase = async (req, res) => {
    try {
        const purchase = await Purchase.findByIdAndDelete(req.params.id);
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }
        res.status(200).json({ message: 'Purchase deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
