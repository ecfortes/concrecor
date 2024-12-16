// controllers/eventequipmentController.js

const { EventEquipment } = require('../../models'); // Importe o modelo Factory
const baseController = require('../apiController');

// Exporte funções do controller usando o controller genérico
//CRUD
exports.getAll = baseController.getAll(EventEquipment);
exports.getById = baseController.getById(EventEquipment);
exports.create = baseController.create(EventEquipment);
exports.update = baseController.update(EventEquipment);
exports.delete = baseController.delete(EventEquipment);

// Função para listar todos os itens de CategoryEquipment com colunas selecionadas dinamicamente
exports.getAllWithSelectedColumns = baseController.getAllWithSelectedColumns(EventEquipment);