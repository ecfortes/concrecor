// routes/indexRoutes.js

const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const oeeController = require('../controllers/oeeController')
const auth = require('../middlewares/auth')

 router.get('/', (req, res) => {
     const targetUrl = `/fabrica/1/linha/1/equipamento/1/eventos`;
     res.redirect(targetUrl);
   });

// Rotas index controller
router.get('/fabrica/:factoryId/linhas',  indexController.getLinesByFactory);
router.get('/fabrica/:factoryId/linha/:productionLineId/equipamentos', indexController.getEquipmentsByLine);
router.get('/fabrica/:factoryId/linha/:productionLineId/equipamento/:equipmentId/eventos', indexController.getEventsByEquipment);
router.get('/fabrica/:factoryId/linha/:productionLineId/equipamento/:equipmentId/oee', indexController.getOeeByEquipment);
router.get('/fabrica/:factoryId/usuarios', indexController.getUsersByFactory);

module.exports = router;
