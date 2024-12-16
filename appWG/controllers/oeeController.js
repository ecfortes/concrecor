const { Op, Sequelize, where, json } = require("sequelize");
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
  const { pagesize, page, startDate, endDate, recipe } = req.query;

  let startDateFilter = startDate ? new Date(startDate) : null;
  let endDateFilter = endDate ? new Date(endDate) : null;

  //console.log(req.query);

  //http://127.0.0.1:3000/oee/1?startDateTime=2024-07-27T23:00&endDateTime=2024-07-28T00:00

  try {
    let whereClause = {};
    let whereClauseAnt = {};
    let whereClausePost = {};
    whereClause.EquipmentId = equipmentId;

    ///TODO - REFATORAR ESTE IF. ESTA REDUNDANTE
    if (startDateFilter && endDateFilter) {
      whereClause["payload.final"] = {
        [Op.gt]: startDateFilter, // Adicionando a condição para startDateFilter usando Op.gt
      };
      whereClauseAnt["payload.final"] = {
        [Op.lt]: startDateFilter, // Adicionando a condição para startDateFilter usando Op.gt
      };
      whereClause["payload.inicio"] = {
        [Op.lt]: endDateFilter, // Adicionando a condição para endDateFilter usando Op.lt
      };
      whereClausePost["payload.inicio"] = {
        [Op.gt]: endDateFilter, // Adicionando a condição para endDateFilter usando Op.lt
      };
    } else if (startDateFilter) {
      whereClause["payload.final"] = {
        [Op.gt]: startDateFilter, // Adicionando a condição para startDateFilter usando Op.gt
      };
      whereClauseAnt["payload.final"] = {
        [Op.lt]: startDateFilter, // Adicionando a condição para startDateFilter usando Op.gt
      };
    } else if (endDateFilter) {
      whereClause["payload.inicio"] = {
        [Op.lt]: endDateFilter, // Adicionando a condição para startDateFilter usando Op.gt
      };
      whereClausePost["payload.inicio"] = {
        [Op.gt]: endDateFilter, // Adicionando a condição para endDateFilter usando Op.lt
      };
    }

    //console.log(whereClause);

    //consulta do primeiro registro anterior

    const reganterior = await OEEData.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclui as colunas createdAt e updatedAt
      where: whereClauseAnt,
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    //consulta do primeiro registro posterior
    const regposterior = await OEEData.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclui as colunas createdAt e updatedAt
      where: whereClausePost,
      order: [["createdAt", "ASC"]],
    });

    const oeeDatas = await OEEData.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclui as colunas createdAt e updatedAt
      where: whereClause,
      order: [["createdAt", "ASC"]],
    });
    jsonData = JSON.parse(JSON.stringify(oeeDatas));

    if (jsonData.length == 0) {

      if (!endDateFilter) {
        endDateFilter = new Date()
      }

      if (!startDateFilter) {
        startDateFilter = new Date(0)
      }

      newData = {
        id: 0,
        payload: {
          final: new Date(endDateFilter),
          state: 9999,
          inicio: new Date(startDateFilter),
          duration: 0,
          strstate: "SEM REGISTRO",
        },
        EquipmentId: equipmentId,
      };

      jsonData.push(newData);
    }

    let arrayOeeData = [];

    //console.log(jsonData.length);

    jsonData[0].payload.inicio = new Date(jsonData[0].payload.inicio);
    jsonData[0].payload.final = new Date(jsonData[0].payload.final);

    arrayOeeData.push(jsonData[0]);
    for (let index = 1; index < jsonData.length; index++) {
      // console.log(jsonData[index-1].payload.final)
      // console.log(jsonData[index].payload.inicio)

      let intervalo =
        new Date(jsonData[index].payload.inicio) -
        new Date(jsonData[index - 1].payload.final);
      //console.log(intervalo);

      if (intervalo < 1000) {
        jsonData[index].payload.inicio = new Date(
          jsonData[index].payload.inicio
        );
        jsonData[index].payload.final = new Date(jsonData[index].payload.final);
        arrayOeeData.push(jsonData[index]);
      } else {
        newData = {
          id: 0,
          payload: {
            final: new Date(jsonData[index].payload.inicio),
            state: 9999,
            inicio: new Date(jsonData[index - 1].payload.final),
            duration: 0,
            strstate: "SEM REGISTRO",
          },
          EquipmentId: equipmentId,
        };
        newData.payload.duration =
          (newData.payload.final - newData.payload.inicio) / 60000;
        arrayOeeData.push(newData);
        jsonData[index].payload.inicio = new Date(
          jsonData[index].payload.inicio
        );
        jsonData[index].payload.final = new Date(jsonData[index].payload.final);
        arrayOeeData.push(jsonData[index]);
      }
    }

    // verifica se a data inicial esta contida no primeiro elemento do filtro
    // se estiver ajusta o primeiro elemento

    if (startDateFilter) {
      if (
        startDateFilter > arrayOeeData[0].payload.inicio &&
        startDateFilter < arrayOeeData[0].payload.final
      ) {
        //console.log("dentro do intervalo");
        if (startDateFilter && arrayOeeData.length > 0) {
          //console.log("ajuste primeiro elemento");
          //ajuste do primeiro elemento
          arrayOeeData[0].payload.inicio = new Date(startDateFilter);
          arrayOeeData[0].payload.duration =
            (new Date(arrayOeeData[0].payload.final) -
              arrayOeeData[0].payload.inicio) /
            60000;
        }
      } else {
        //console.log("fora do intervalo");
        const newRegister = {
          id: 0,
          payload: {
            final: new Date(arrayOeeData[0].payload.inicio),
            state: 9999,
            inicio: new Date(startDateFilter),
            duration:
              (new Date(arrayOeeData[0].payload.inicio) -
                new Date(startDateFilter)) /
              60000, // Calcula a duração em minutos
            strstate: "SEM REGISTRO",
          },
          EquipmentId: equipmentId,
        };
        arrayOeeData.unshift(newRegister);
      }
    }

    if (endDateFilter) {
      if (
        endDateFilter > arrayOeeData[arrayOeeData.length - 1].payload.inicio &&
        endDateFilter < arrayOeeData[arrayOeeData.length - 1].payload.final
      ) {
        //console.log("dentro do intervalo -fim");
        //TODO - Ajustar somente se existir periodo posterior
        if (endDateFilter && arrayOeeData.length > 0) {
          //console.log("ajuste ultimo elemento");
          //ajuste do ultimo elemento
          arrayOeeData[arrayOeeData.length - 1].payload.final = new Date(
            endDateFilter
          );
          arrayOeeData[arrayOeeData.length - 1].payload.duration =
            (arrayOeeData[arrayOeeData.length - 1].payload.final -
              new Date(arrayOeeData[arrayOeeData.length - 1].payload.inicio)) /
            60000;
        }
      } else {
        //console.log("fora do intervalo");
        const newRegister = {
          id: 0,
          payload: {
            final: new Date(endDateFilter),
            state: 9999,
            inicio: new Date(
              arrayOeeData[arrayOeeData.length - 1].payload.final
            ),
            duration:
              (new Date(endDateFilter) -
                new Date(arrayOeeData[arrayOeeData.length - 1].payload.final)) /
              60000, // Calcula a duração em minutos
            strstate: "SEM REGISTRO",
          },
          EquipmentId: equipmentId,
        };
        arrayOeeData.push(newRegister);
      }
    }

    // Calcula as estatísticas para cada estado
    const stateStats = arrayOeeData.reduce((acc, item) => {
      const { state, duration, strstate } = item.payload;
      const durationValue = parseFloat(duration);

      if (!acc[state]) {
        acc[state] = {
          name: strstate, // Adiciona o nome do estado
          count: 0,
          totalDuration: 0,
          maxDuration: -Infinity,
          minDuration: Infinity,
          averageDuration: 0,
        };
      }

      // Incrementar a contagem para este estado
      acc[state].count += 1;

      // Atualizar a soma total das durações
      acc[state].totalDuration += durationValue;

      // Atualizar a duração máxima
      if (durationValue > acc[state].maxDuration) {
        acc[state].maxDuration = durationValue;
      }

      // Atualizar a duração mínima
      if (durationValue < acc[state].minDuration) {
        acc[state].minDuration = durationValue;
      }

      return acc;
    }, {});

    // Calcular a média para cada estado
    for (const state in stateStats) {
      const stateData = stateStats[state];
      stateData.averageDuration = stateData.totalDuration / stateData.count;
    }

    //console.log({stateStats,oeeDatas});
    //console.log(jsonData[0]);

    // Função para calcular estatísticas gerais
    function calculateOverallStatistics(data) {
      let totalDuration = 0;
      let count = 0;
      let maxDuration = -Infinity;
      let minDuration = Infinity;

      data.forEach((item) => {
        const dur = parseFloat(item.payload.duration);
        totalDuration += dur;
        count += 1;
        maxDuration = Math.max(maxDuration, dur);
        minDuration = Math.min(minDuration, dur);
      });

      const averageDuration = totalDuration / count;

      return {
        total: totalDuration,
        count: count,
        max: maxDuration,
        min: minDuration,
        average: averageDuration,
      };
    }

    const overallStatistics = calculateOverallStatistics(arrayOeeData);

    //ordena os registros pelo estado
    let sortedData = arrayOeeData.sort(
      (a, b) => a.payload.state - b.payload.state
    );

    sortedData = arrayOeeData;

    //console.log(arrayOeeData);

    res.render("oee", {
      overallStatistics,
      stateStats,
      arrayOeeData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar equipamentos da linha de produção." });
  }
});

// res.json(oeeDatas);
