const { Op, Sequelize, where } = require("sequelize");
const { sequelize } = require("../models"); // Importa o objeto sequelize do arquivo models/index.js
const insumos = require('../config/insumos'); // Caminho relativo ao arquivo
//const screens = require('../config/screens')
const handleAsync = require("../utils/handleAsync"); // Função utilitária para lidar com funções assíncronas
const {
  ProductionLine,
  Equipment,
  Factory,
  EventEquipment,
  OEEData,
  User,
} = require("../models"); // Importe o modelo ProductionLine

// Função para listar linhas de produção por fábrica
exports.getLinesByFactory = handleAsync(async (req, res) => {
  const { factoryId } = req.params;
  try {
    const productionLines = await ProductionLine.findAll({
      where: { FactoryId: factoryId },
      attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclui as colunas createdAt e updatedAt
    });

    res.json(productionLines);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar linhas de produção da fábrica." });
  }
});

//router.get('/fabrica/factoryId/linha/ProductionLineId/equipamentos', indexController.getEquipmentsByLine);
// Função para listar equipamentos por linha de produção
exports.getEquipmentsByLine = handleAsync(async (req, res) => {
  const { factoryId, productionLineId } = req.params;
  try {
    const equipments = await Equipment.findAll({
      include: [
        {
          model: ProductionLine,
          where: { id: productionLineId },
          include: [
            {
              model: Factory,
              attributes: [], // Exclui as colunas createdAt e updatedAt
              where: { id: factoryId },
            },
          ],
          attributes: [], // Exclui as colunas createdAt e updatedAt
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclui as colunas createdAt e updatedAt
    });
    res.json(equipments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar equipamentos da linha de produção." });
  }
});

// Função para listar eventos por equipamento dentro de uma linha de produção específica e fábrica
exports.getEventsByEquipment = handleAsync(async (req, res) => {
  const { factoryId, productionLineId, equipmentId } = req.params;
  const { pagesize, page, startDate, endDate, recipe } = req.query;

  let startDateFilter = startDate ? new Date(startDate) : null;
  let endDateFilter = endDate ? new Date(endDate) : null;

  if (endDateFilter) {
    endDateFilter.setDate(endDateFilter.getDate() + 1);
  }

  //console.log(endDateFilter);

  try {
    let whereClause = {};
    whereClause.EquipmentId = equipmentId;

    if (recipe) {
      whereClause["payload.receita"] = recipe;
    }

    if (startDateFilter && endDateFilter) {
      whereClause["payload.timestamp"] = {
        [Op.between]: [startDateFilter, endDateFilter], // Adicionando a condição para um intervalo de datas usando Op.between
      };
    } else if (startDateFilter) {
      whereClause["payload.timestamp"] = {
        [Op.gt]: startDateFilter, // Adicionando a condição para startDateFilter usando Op.gt
      };
    } else if (endDateFilter) {
      whereClause["payload.timestamp"] = {
        [Op.lt]: endDateFilter, // Adicionando a condição para endDateFilter usando Op.lt
      };
    }

    //console.log(whereClause);

    const totalItems = await EventEquipment.count({
      where: { EquipmentId: equipmentId },
    });

    const [recipes, metadata] = await sequelize.query(
      `
      SELECT DISTINCT "payload"->>'receita' AS "receitas"
      FROM "EventEquipments" AS "EventEquipment"
      WHERE "EventEquipment"."EquipmentId" = '${equipmentId}'
      ORDER BY "receitas";
    `
    );

    const events = await EventEquipment.findAll({
      include: [
        {
          model: Equipment,
          attributes: [],
          where: { id: equipmentId },
          include: [
            {
              model: ProductionLine,
              attributes: [],
              where: { id: productionLineId },
              include: [
                {
                  model: Factory,
                  attributes: [],
                  where: { id: factoryId },
                },
              ],
            },
          ],
        },
      ],
      where: whereClause,
      order: [["payload.timestamp", "DESC"]],
      limit: pagesize || 20, // Limite padrão de 20, ou o limite especificado na query
      offset: (page - 1) * pagesize || 0,
      //attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclui as colunas createdAt e updatedAt
    });


  



    //payload_headers = Object.keys(events[0].payload);

    const acceptHeader = req.headers["accept"];

    if (acceptHeader.includes("text/html")) {
      res.render("eventos", {
        events: JSON.stringify(events, null, 2),
        page: page || 1,
        totalItems,
        pagesize: pagesize || 20,
        startDateFilter,
        endDateFilter,
        recipes,
        insumos        
      });
    } else if (acceptHeader.includes("application/json")) {
      res.json(events);
    } else {
      res.status(406).send("Formato não suportado");
    }

    //res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar eventos do equipamento." });
  }
});

// Função para obter dados de OEE por equipamento dentro de uma linha de produção específica e fábrica
exports.getOeeByEquipment = handleAsync(async (req, res) => {
  const { factoryId, productionLineId, equipmentId } = req.params;
  try {
    const oeeData = await OEEData.findAll({
      where: {
        EquipmentId: equipmentId,
      },
      include: [
        {
          model: Equipment,
          attributes: [],
          where: { id: equipmentId },
          include: [
            {
              model: ProductionLine,
              attributes: [],
              where: { id: productionLineId },
              include: [
                {
                  model: Factory,
                  attributes: [],
                  where: { id: factoryId },
                },
              ],
            },
          ],
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclui as colunas createdAt e updatedAt
    });
    res.json(oeeData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar dados de OEE do equipamento." });
  }
});

//Busca de usuarios por fabrica
exports.getUsersByFactory = async (req, res) => {
  const { factoryId } = req.params;

  try {
    // Lógica para buscar usuários por factoryId
    const users = await User.findAll({
      where: { FactoryId: factoryId },
      attributes: ["id", "name", "email"], // Exemplo de atributos que você deseja retornar
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar usuários da fábrica." });
  }
};
