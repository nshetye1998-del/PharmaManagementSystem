const HistorySale = require('../models/historySaleSchema');

// Get all history sales
exports.getAllHistorySales = async (req, res) => {
    try {
        const historySales = await HistorySale.find();
        res.json(historySales);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single history sale by ID
exports.getHistorySaleById = async (req, res) => {
    try {
        const historySale = await HistorySale.findById(req.params.id);
        if (!historySale) return res.status(404).json({ message: 'History Sale not found' });
        res.json(historySale);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new history sale
exports.createHistorySale = async (req, res) => {
    const historySale = new HistorySale({
        user_name: req.body.user_name,
        barcode: req.body.barcode,
        dose: req.body.dose,
        type: req.body.type,
        price: req.body.price,
        amount: req.body.amount,
        name: req.body.name,
        quantity: req.body.quantity
    });
    try {
        const newHistorySale = await historySale.save();
        res.status(201).json(newHistorySale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a history sale by ID
exports.updateHistorySale = async (req, res) => {
    try {
        const historySale = await HistorySale.findById(req.params.id);
        if (!historySale) return res.status(404).json({ message: 'History Sale not found' });

        historySale.user_name = req.body.user_name || historySale.user_name;
        historySale.barcode = req.body.barcode || historySale.barcode;
        historySale.dose = req.body.dose || historySale.dose;
        historySale.type = req.body.type || historySale.type;
        historySale.price = req.body.price || historySale.price;
        historySale.amount = req.body.amount || historySale.amount;
        historySale.name = req.body.name || historySale.name;
        historySale.quantity = req.body.quantity || historySale.quantity;

        const updatedHistorySale = await historySale.save();
        res.json(updatedHistorySale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Partially update a history sale by ID
exports.patchHistorySale = async (req, res) => {
    try {
        const historySale = await HistorySale.findById(req.params.id);
        if (!historySale) return res.status(404).json({ message: 'History Sale not found' });

        Object.keys(req.body).forEach(key => {
            historySale[key] = req.body[key];
        });

        const updatedHistorySale = await historySale.save();
        res.json(updatedHistorySale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a history sale by ID
exports.deleteHistorySale = async (req, res) => {
    try {
        const historySale = await HistorySale.findByIdAndDelete(req.params.id);
        if (!historySale) return res.status(404).json({ message: 'History Sale not found' });

        await historySale.remove();
        res.json({ message: 'History Sale deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
