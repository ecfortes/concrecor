// routes/baseRoutes.js

const express = require('express');
const router = express.Router();
const factoryController = require('../controllers/api/factoryController');
const userController = require('../controllers/api/userController');
const categoryequipmentController = require('../controllers/api/categoryequipmentController')
const equipmentController = require('../controllers/api/equipmentController')
const eventequipmentController = require('../controllers/api/eventequipmentController')
const eventtypeController = require('../controllers/api/eventtypeController')
const oeedataController = require('../controllers/api/oeedataController')
const productionlineController = require('../controllers/api/productionlineController')
const auth = require('../middlewares/auth')

// Rotas para fábricas
router.get('/factory',  factoryController.getAll);
router.get('/factory/:id', factoryController.getById);
router.post('/factory', factoryController.create);
router.put('/factory/:id', factoryController.update);
router.delete('/factory/:id', factoryController.delete);

// Rotas para usuários
router.get('/user', userController.getAll);
router.get('/user/:id', userController.getById);
router.post('/user', userController.create);
router.put('/user/:id', userController.update);
router.delete('/user/:id', userController.delete);

//Rotas para Category Equipment
router.get('/categoryequipment', categoryequipmentController.getAll);
router.get('/categoryequipment/:id', categoryequipmentController.getById);
router.post('/categoryequipment', categoryequipmentController.create);
router.put('/categoryequipment/:id', categoryequipmentController.update);
router.delete('/categoryequipment/:id', categoryequipmentController.delete);

//Rotas para Equipment
router.get('/equipment', equipmentController.getAll);
router.get('/equipment/:id', equipmentController.getById);
router.post('/equipment', equipmentController.create);
router.put('/equipment/:id', equipmentController.update);
router.delete('/equipment/:id', equipmentController.delete);

//Rotas para Event Equipment
router.get('/eventequipment', eventequipmentController.getAll);  //GET /eventequipment?factoryID=1
router.get('/eventequipment/:id', eventequipmentController.getById);
router.post('/eventequipment', eventequipmentController.create);
router.put('/eventequipment/:id', eventequipmentController.update);
router.delete('/eventequipment/:id', eventequipmentController.delete);

router.get('/eventequipment/select/?id', eventequipmentController.getAllWithSelectedColumns); //somente colunas selecionadas


//Rotas para Event Type
router.get('/eventtype', eventtypeController.getAll);
router.get('/eventtype/:id', eventtypeController.getById);
router.post('/eventtype', eventtypeController.create);
router.put('/eventtype/:id', eventtypeController.update);
router.delete('/eventtype/:id', eventtypeController.delete);

//Rotas para OEE Data
router.get('/oeedata', oeedataController.getAll);
router.get('/oeedata/:id', oeedataController.getById);
router.post('/oeedata', oeedataController.create);
router.put('/oeedata/:id', oeedataController.update);
router.delete('/oeedata/:id', oeedataController.delete);

//Rotas para Production Lines
router.get('/productionline', productionlineController.getAll);
router.get('/productionline/:id', productionlineController.getById);
router.post('/productionline', productionlineController.create);
router.put('/productionline/:id', productionlineController.update);
router.delete('/productionline/:id', productionlineController.delete);

module.exports = router;