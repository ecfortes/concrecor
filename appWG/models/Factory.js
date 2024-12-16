'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Factory extends Model {
    static associate(models) {
      // define association here
      Factory.hasMany(models.ProductionLine);
      Factory.hasMany(models.User)

    }
  }
  Factory.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Factory',
    //timestamps: true
  });
  return Factory;
};