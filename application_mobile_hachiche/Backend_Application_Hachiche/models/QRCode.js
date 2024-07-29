const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QRCode = sequelize.define('QRCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plantule_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'Plantules', 
        key: 'id'
    }
  },
  qr_code: {
    type: DataTypes.BLOB,
    allowNull: false
  }
});

module.exports = QRCode;
