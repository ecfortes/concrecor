'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryEquipment extends Model {
    static associate(models) {
      // define association here
      CategoryEquipment.hasMany(models.Equipment)
    }
  }
  CategoryEquipment.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CategoryEquipment',
    //timestamps: true
  });
  return CategoryEquipment;
};