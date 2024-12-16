'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventType extends Model {
    static associate(models) {
      // define association here
      EventType.hasMany(models.EventEquipment)
    }
  }
  EventType.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'EventType',
    //timestamps: true
  });
  return EventType;
};