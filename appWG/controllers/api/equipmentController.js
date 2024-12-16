// controllers/equipmentController.js

const { Equipment } = require('../../models'); // Importe o modelo Factory
const baseController = require('../apiController');

// Exporte funções do controller usando o controller genérico
//CRUD
exports.getAll = baseController.getAll(Equipment);
exports.getById = baseController.getById(Equipment);
exports.create = baseController.create(Equipment);
exports.update = baseController.update(Equipment);
exports.delete = baseController.delete(Equipment);
