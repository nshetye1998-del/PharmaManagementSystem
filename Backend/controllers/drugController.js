const Drug = require('../models/drugSchema');

exports.getAllDrugs = async (req, res) => {
    try {
        const drugs = await Drug.find();
        res.json(drugs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single drug by barcode
exports.getDrugByBarcode = async (req, res) => {
    try {
        const drug = await Drug.findOne({ barcode: req.params.barcode });
        if (!drug) return res.status(404).json({ message: 'Drug not found' });
        res.json(drug);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new drug
exports.createDrug = async (req, res) => {
    const drug = new Drug({
        name: req.body.name,
        type: req.body.type,
        barcode: req.body.barcode,
        dose: req.body.dose,
        cost_price: req.body.cost_price,
        sell_price: req.body.sell_price,
        expiry: req.body.expiry,
        company_name: req.body.company_name,
        production_date: req.body.production_date,
        expiration_date: req.body.expiration_date,
        place: req.body.place,
        quantity: req.body.quantity
    });
    try {
        const newDrug = await drug.save();
        res.status(201).json(newDrug);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a drug by barcode
exports.updateDrugByBarcode = async (req, res) => {
    try {
        const drug = await Drug.findOne({ barcode: req.params.barcode });
        if (!drug) return res.status(404).json({ message: 'Drug not found' });

        drug.name = req.body.name || drug.name;
        drug.type = req.body.type || drug.type;
        drug.barcode = req.body.barcode || drug.barcode;
        drug.dose = req.body.dose || drug.dose;
        drug.cost_price = req.body.cost_price || drug.cost_price;
        drug.sell_price = req.body.sell_price || drug.sell_price;
        drug.expiry = req.body.expiry || drug.expiry;
        drug.company_name = req.body.company_name || drug.company_name;
        drug.production_date = req.body.production_date || drug.production_date;
        drug.expiration_date = req.body.expiration_date || drug.expiration_date;
        drug.place = req.body.place || drug.place;
        drug.quantity = req.body.quantity || drug.quantity;

        const updatedDrug = await drug.save();
        res.json(updatedDrug);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Partially update a drug by barcode
exports.patchDrugByBarcode = async (req, res) => {
    try {
        const drug = await Drug.findOne({ barcode: req.params.barcode });
        if (!drug) return res.status(404).json({ message: 'Drug not found' });

        Object.keys(req.body).forEach(key => {
            drug[key] = req.body[key];
        });

        const updatedDrug = await drug.save();
        res.json(updatedDrug);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a drug by barcode
exports.deleteDrugByBarcode = async (req, res) => {
    try {
        const drug = await Drug.findOneAndDelete({ barcode: req.params.barcode });
        if (!drug) return res.status(404).json({ message: 'Drug not found' });

        res.json({ message: 'Drug deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Decrease product quantity based on purchase
exports.purchaseProduct = async (req, res) => {
    try {
        const { barcode, quantity } = req.body;

        // Find the drug by barcode
        const drug = await Drug.findOne({ barcode });
        if (!drug) {
            return res.status(404).send('Drug not found');
        }

        // Check if there is enough stock
        if (drug.quantity < quantity) {
            return res.status(400).send('Insufficient stock');
        }

        // Decrease the quantity
        drug.quantity -= quantity;
        await drug.save();

        res.status(200).send(drug);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Increase product quantity based on new stock
exports.addStock = async (req, res) => {
    try {
        const { barcode, quantity } = req.body;

        // Find the drug by barcode
        const drug = await Drug.findOne({ barcode });
        if (!drug) {
            return res.status(404).send('Drug not found');
        }

        // Increase the quantity
        drug.quantity += quantity;
        await drug.save();

        res.status(200).send(drug);
    } catch (error) {
        res.status(400).send(error);
    }
};
