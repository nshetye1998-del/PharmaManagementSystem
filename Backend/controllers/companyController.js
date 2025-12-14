const Company = require('../models/companySchema');

// Get all companies
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single company by ID
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new company
exports.createCompany = async (req, res) => {
    const company = new Company({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    });
    try {
        const newCompany = await company.save();
        res.status(201).json(newCompany);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a company by ID
exports.updateCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        company.name = req.body.name || company.name;
        company.address = req.body.address || company.address;
        company.phone = req.body.phone || company.phone;

        const updatedCompany = await company.save();
        res.json(updatedCompany);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Partially update a company by ID
exports.patchCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        Object.keys(req.body).forEach(key => {
            company[key] = req.body[key];
        });

        const updatedCompany = await company.save();
        res.json(updatedCompany);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a company by ID
exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        await company.remove();
        res.json({ message: 'Company deleted' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
};
