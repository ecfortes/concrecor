// controllers/categoryequipmentController.js

const { CategoryEquipment } = require('../../models'); // Importe o modelo Factory
const baseController = require('../apiController');

// Exporte funções do controller usando o controller genérico
//CRUD
exports.getAll = baseController.getAll(CategoryEquipment);
exports.getById = baseController.getById(CategoryEquipment);
exports.create = baseController.create(CategoryEquipment);
exports.update = baseController.update(CategoryEquipment);
exports.delete = baseController.delete(CategoryEquipment);


