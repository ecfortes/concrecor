const { Op, Sequelize, where } = require("sequelize");
const { sequelize } = require("../models"); // Importa o objeto sequelize do arquivo models/index.js

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
exports.getOeeByEquip = handleAsync(async (req, res) => {
  const { equipmentId } = req.params;
  //console.log(equipmentId)
  try {
    const results = await OEEData.findAll({
      attributes: [
        [sequelize.literal("(payload->>'state')::int"), "state"],
        [sequelize.literal("COUNT(*)"), "count"],
        [sequelize.literal("SUM((payload->>'duration')::numeric)"),"total_time"],
        [sequelize.literal("AVG((payload->>'duration')::numeric)"), "average"],
        [sequelize.literal("MAX((payload->>'duration')::numeric)"), "max"],
        [sequelize.literal("MIN((payload->>'duration')::numeric)"), "min"],
      ],
      where: {EquipmentId: equipmentId},
      group: [sequelize.literal("(payload->>'state')::int")],
      order: [sequelize.literal("state")],
    });

    const oeeDatas = await OEEData.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclui as colunas createdAt e updatedAt
      where: { EquipmentId: equipmentId },
    });

    res.json({oeeDatas} );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar equipamentos da linha de produção." });
  }
});


// res.json(oeeDatas);
