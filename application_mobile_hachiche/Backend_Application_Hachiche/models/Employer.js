const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employer = sequelize.define('Employer', {
  ID_employer: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Date_naissance: {
    type: DataTypes.DATEONLY,
  },
  Adresse: {
    type: DataTypes.STRING,
  },
  Numero_telephone: {
    type: DataTypes.STRING,
  },
  Email: {
    type: DataTypes.STRING,
  },
  Mot_de_passe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Employer;
