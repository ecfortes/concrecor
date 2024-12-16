// controllers/factoryController.js

const { Factory } = require('../../models'); // Importe o modelo Factory
const baseController = require('../apiController');

// Exporte funções do controller usando o controller genérico
//CRUD
exports.getAll = baseController.getAll(Factory);
exports.getById = baseController.getById(Factory);
exports.create = baseController.create(Factory);
exports.update = baseController.update(Factory);
exports.delete = baseController.delete(Factory);
