const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Définir le modèle Historique sans référence circulaire pour l'instant
const Historique = sequelize.define('Historique', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  plantule_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date_modification: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  champ_modifie: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ancienne_valeur: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  nouvelle_valeur: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
});

// Exporter le modèle sans associer pour éviter les erreurs circulaires
module.exports = Historique;
