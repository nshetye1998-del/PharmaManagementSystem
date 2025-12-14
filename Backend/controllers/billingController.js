const Item = require('../models/billingSchema');

// Get all items
const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single item
const getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new item
const createItem = async (req, res) => {
    const {
        barcode,
        itemName,
        sell_price,
        unit,
        quantity,
        totalAmount,
        payable,
        received
        // Add more fields here as needed
    } = req.body;

    const newItem = new Item({
        barcode,
        itemName,
        sell_price,
        unit,
        quantity,
        totalAmount,
        payable,
        received
        // Add more fields here as needed
    });

    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update an existing item
const updateItem = async (req, res) => {
    const { id } = req.params;
    const {
        barcode,
        itemName,
        sell_price,
        unit,
        quantity,
        totalAmount,
        payable,
        received
        // Add more fields here as needed
    } = req.body;

    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        item.barcode = barcode;
        item.itemName = itemName;
        item.sell_price = sell_price;
        item.unit = unit;
        item.quantity = quantity;
        item.totalAmount = totalAmount;
        item.payable = payable;
        item.received = received;
        // Update more fields as needed

        const updatedItem = await item.save();
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an item
const deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        await item.remove();
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};
