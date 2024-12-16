// controllers/userController.js

const { User } = require('../../models'); // Importe o modelo User
const baseController = require('../apiController');

// Exporte funções do controller usando o controller genérico
exports.getAll = baseController.getAll(User);
exports.getById = baseController.getById(User);
exports.create = baseController.create(User);
exports.update = baseController.update(User);
exports.delete = baseController.delete(User);
