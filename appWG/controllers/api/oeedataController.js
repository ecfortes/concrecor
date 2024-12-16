// controllers/oeedata.js

const { OEEData } = require('../../models'); // Importe o modelo Factory
const baseController = require('../apiController');

// Exporte funções do controller usando o controller genérico
//CRUD
exports.getAll = baseController.getAll(OEEData);
exports.getById = baseController.getById(OEEData);
exports.create = baseController.create(OEEData);
exports.update = baseController.update(OEEData);
exports.delete = baseController.delete(OEEData);
