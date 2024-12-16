// controllers/baseController.js

const { Op } = require("sequelize");
const handleAsync = require("../utils/handleAsync"); // Função utilitária para lidar com funções assíncronas

// Função para listar todos os itens de uma entidade com where opcional
//GET /categorequipment?name=Compressor&type=Heavy

exports.getAll = (Model) =>
  handleAsync(async (req, res) => {
    const where = {};
    
    // Itera sobre os parâmetros de consulta e adiciona-os ao objeto where
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        where[key] = req.query[key];
      }
      //console.log(where)
    }
    const items = await Model.findAll({
      include: [
        //{ all: true, nested: true }, // Inclui todas as associações automaticamente
      ],
      attributes: { exclude: ["password"] },
      where: Object.keys(where).length > 0 ? where : undefined,
    });
    res.json(items);
  });

// Função para obter um item de uma entidade pelo ID
exports.getById = (Model) =>
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const item = await Model.findByPk(id, {
      include: [
        { all: true, nested: true }, // Inclui todas as associações automaticamente
      ],
      attributes: { exclude: ["password"] },
    });

    if (!item) {
      return res
        .status(404)
        .json({ message: `${Model.name} não encontrado(a).` });
    }

    res.json(item);
  });

// Função para criar um novo item de uma entidade
exports.create = (Model) =>
  handleAsync(async (req, res) => {
    const newItem = await Model.create(req.body);
    //console.log(req.body)
    res.status(201).json(newItem);
  });

// Função para atualizar um item de uma entidade pelo ID
exports.update = (Model) =>
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const item = await Model.findByPk(id);
    if (!item) {
      return res
        .status(404)
        .json({ message: `${Model.name} não encontrado(a).` });
    }
    await item.update(req.body);
    res.json(item);
  });

// Função para excluir um item de uma entidade pelo ID
exports.delete = (Model) =>
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const item = await Model.findByPk(id);
    if (!item) {
      return res
        .status(404)
        .json({ message: `${Model.name} não encontrado(a).` });
    }
    await item.destroy();
    res.json({ message: `${Model.name} excluído(a) com sucesso.` });
  });

// Função para listar todos os itens de uma entidade com colunas selecionadas
exports.getAllWithSelectedColumns = (Model, columns) =>
  handleAsync(async (req, res) => {
    // Mapeia colunas JSONB para suas propriedades específicas
    const attributes = columns
      .map((column) => {
        if (typeof column === "object" && column.jsonb && column.properties) {
          // Retorna as propriedades específicas de JSONB usando Sequelize colunas literais
          return column.properties.map((prop) => [
            Sequelize.literal(`${column.jsonb}->>'${prop}'`),
            `${column.jsonb}_${prop}`,
          ]);
        }
        return column;
      })
      .flat();

    const items = await Model.findAll({
      include: [
        { all: true, nested: true }, // Inclui todas as associações automaticamente
      ],
      attributes: attributes,
    });
    res.json(items);
  });
