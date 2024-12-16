// controllers/eventtypeController.js

const { EventType } = require('../../models'); // Importe o modelo Factory
const baseController = require('../apiController');

// Exporte funções do controller usando o controller genérico
//CRUD
exports.getAll = baseController.getAll(EventType);
exports.getById = baseController.getById(EventType);
exports.create = baseController.create(EventType);
exports.update = baseController.update(EventType);
exports.delete = baseController.delete(EventType);
