const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Modification = sequelize.define('Modification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  plantule_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Plantules',
      key: 'id',
    },
  },
  date_modification: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  champs_modifies: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Modification;
