'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associações aqui, se necessário
      User.belongsTo(models.Factory);
    }
  }
  
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Garante que o email seja único
      validate: {
        isEmail: true, // Valida que o valor inserido é um endereço de e-mail válido
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
    //timestamps: true
  });
  return User;
};
