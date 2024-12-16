'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OEEData extends Model {
    static associate(models) {
      // define association here
      OEEData.belongsTo(models.Equipment)
    }
  }
  OEEData.init({
    payload: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'OEEData',
    //timestamps: true
  });
  return OEEData;
};