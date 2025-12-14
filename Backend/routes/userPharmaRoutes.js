// routes/userPRoutes.js
const express = require('express');
const { register, login, getAllUsers, deleteUser, updatePassword } = require('../controllers/userPharmaController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/all', getAllUsers);
router.delete('/del/:id', deleteUser);
router.patch('/update/:id/password', updatePassword);

module.exports = router;
