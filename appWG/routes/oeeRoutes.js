
const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const oeeController = require('../controllers/oeeController')
const auth = require('../middlewares/auth')

// Rotas Oee Controller
router.get('/:equipmentId',  oeeController.getOeeByEquip);

module.exports = router;
