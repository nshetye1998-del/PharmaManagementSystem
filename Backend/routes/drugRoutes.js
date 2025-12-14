const express = require('express');
const router = express.Router();
const drugController = require('../controllers/drugController');

router.get('/all', drugController.getAllDrugs);
router.get('/get/:barcode', drugController.getDrugByBarcode);
router.post('/add', drugController.createDrug);
router.put('/update/:barcode', drugController.updateDrugByBarcode);
router.patch('/edit/:barcode', drugController.patchDrugByBarcode);
router.delete('/del/:barcode', drugController.deleteDrugByBarcode);
router.patch('/edit/purchase', drugController.purchaseProduct);
router.patch('/edit/add-stock', drugController.addStock);

module.exports = router;
