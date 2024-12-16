'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductionLine extends Model {
    static associate(models) {
      // Definindo a associações aqui
      ProductionLine.belongsTo(models.Factory);
      ProductionLine.hasMany(models.Equipment);
    }
  }
  
  ProductionLine.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ProductionLine',
    //timestamps: true
  });

  return ProductionLine;
};
