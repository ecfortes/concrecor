// controllers/productionlineController.js

const { ProductionLine } = require('../../models'); // Importe o modelo Factory
const baseController = require('../apiController');

// Exporte funções do controller usando o controller genérico
//CRUD
exports.getAll = baseController.getAll(ProductionLine);
exports.getById = baseController.getById(ProductionLine);
exports.create = baseController.create(ProductionLine);
exports.update = baseController.update(ProductionLine);
exports.delete = baseController.delete(ProductionLine);
