'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Equipment extends Model {
    static associate(models) {
      // define association here
      Equipment.belongsTo(models.ProductionLine);
      Equipment.hasMany(models.EventEquipment);
      Equipment.hasMany(models.OEEData)
    }
  }
  Equipment.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Equipment',
    //timestamps: true
  });
  return Equipment;
};