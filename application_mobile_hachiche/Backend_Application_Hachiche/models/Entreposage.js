const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Entreposage = sequelize.define('Entreposage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Entreposage;
