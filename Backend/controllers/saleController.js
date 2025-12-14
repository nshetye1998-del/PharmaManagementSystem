const Sale = require('../models/saleSchema');

// Create a new sale
exports.createSale = async (req, res) => {
    const { barcode, dose, type, price, amount, name, quantity, date } = req.body;

    try {
        const newSale = new Sale({
            barcode,
            dose,
            type,
            price,
            amount,
            name,
            quantity,
            date
        });

        const savedSale = await newSale.save();
        res.status(201).json(savedSale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all sales
exports.getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find();
        res.status(200).json(sales);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single sale by ID
exports.getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(200).json(sale);
    } catch (err) {
        res.status500.json({ message: err.message });
    }
};

// Update a sale by ID
exports.updateSale = async (req, res) => {
    try {
        const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(200).json(updatedSale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a sale by ID
exports.deleteSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndDelete(req.params.id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(200).json({ message: 'Sale deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
