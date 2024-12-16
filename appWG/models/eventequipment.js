'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventEquipment extends Model {
    static associate(models) {
      // define association here
      EventEquipment.belongsTo(models.Equipment);
      EventEquipment.belongsTo(models.EventType)
    }
  }
  EventEquipment.init({
    
    payload: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'EventEquipment',
    //timestamps: true
  });
  return EventEquipment;
};