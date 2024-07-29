const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Entreposage = require('./Entreposage');
const ResponsableDecontamination = require('./ResponsableDecontamination');
const Modification = require('./Modification');
const Historique = require('./Historique'); // Importer ici

const Plantule = sequelize.define('Plantule', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  identification: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  etat_sante: {
    type: DataTypes.ENUM('rouge', 'orange', 'jaune', 'vert'),
    allowNull: false,
  },
  date_arrivee: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  provenance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  stade: {
    type: DataTypes.ENUM('Initiation', 'Microdissection', 'Magenta', 'Double magenta', 'Hydroponie'),
    allowNull: false,
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  date_retrait: {
    type: DataTypes.DATEONLY,
  },
  item_retire: {
    type: DataTypes.STRING,
  },
  note: {
    type: DataTypes.TEXT,
  },
  entreposage_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Entreposage,
      key: 'id'
    }
  },
  responsable_decontamination_id: {
    type: DataTypes.INTEGER,
    references: {
      model: ResponsableDecontamination,
      key: 'id'
    }
  },
  archivee: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  timestamps: false,
  hooks: {
    afterUpdate: async (plantule, options) => {
      const changedFields = plantule.changed();
      for (const field of changedFields) {
        const ancienneValeur = plantule.previous(field);
        const nouvelleValeur = plantule[field];

        // Detailed logging
        console.log(`Field: ${field}`);
        console.log(`Ancienne Valeur for ${field}: ${ancienneValeur}`);
        console.log(`Nouvelle Valeur for ${field}: ${nouvelleValeur}`);

        if (ancienneValeur === undefined || ancienneValeur === null) {
          console.warn(`Skipping Historique entry creation for field '${field}' due to null ancienne_valeur`);
          continue;
        }

        if (nouvelleValeur === undefined || nouvelleValeur === null) {
          console.error(`Error: nouvelle_valeur for field '${field}' is null or undefined`);
          continue;
        }

        await Historique.create({
          plantule_id: plantule.id,
          champ_modifie: field,
          ancienne_valeur: ancienneValeur,
          nouvelle_valeur: nouvelleValeur
        }, { transaction: options.transaction });
      }
    }
  }
});

// Associer les modèles
Plantule.belongsTo(Entreposage, { foreignKey: 'entreposage_id', onDelete: 'CASCADE' });
Plantule.belongsTo(ResponsableDecontamination, { foreignKey: 'responsable_decontamination_id', onDelete: 'CASCADE' });
Plantule.hasMany(Modification, { foreignKey: 'plantule_id', onDelete: 'CASCADE' });
Plantule.hasMany(Historique, { foreignKey: 'plantule_id', onDelete: 'CASCADE' });

module.exports = Plantule;
