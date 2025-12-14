const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');


router.get('/all', companyController.getAllCompanies);

router.get('/get/:id', companyController.getCompanyById);

router.post('/add', companyController.createCompany);

router.put('/update/:id', companyController.updateCompany);

router.patch('/edit/:id', companyController.patchCompany);

router.delete('/del/:id', companyController.deleteCompany);

module.exports = router;
