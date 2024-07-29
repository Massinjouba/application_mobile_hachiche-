const sequelize = require('../config/database');
const Plantule = require('./Plantule');
const Entreposage = require('./Entreposage');
const ResponsableDecontamination = require('./ResponsableDecontamination');
const Modification = require('./Modification');
const Historique = require('./Historique'); // Ajouter Historique
const QRCode = require('./QRCode');

// Setting up associations
Entreposage.hasMany(Plantule, { foreignKey: 'entreposage_id', onDelete: 'CASCADE' });
Plantule.belongsTo(Entreposage, { foreignKey: 'entreposage_id' });

ResponsableDecontamination.hasMany(Plantule, { foreignKey: 'responsable_decontamination_id', onDelete: 'CASCADE' });
Plantule.belongsTo(ResponsableDecontamination, { foreignKey: 'responsable_decontamination_id' });

Plantule.hasMany(Modification, { foreignKey: 'plantule_id', onDelete: 'CASCADE' });
Modification.belongsTo(Plantule, { foreignKey: 'plantule_id' });

Plantule.hasMany(Historique, { foreignKey: 'plantule_id', onDelete: 'CASCADE' });
Historique.belongsTo(Plantule, { foreignKey: 'plantule_id' });

Plantule.hasOne(QRCode, { foreignKey: 'plantule_id', onDelete: 'CASCADE' });
QRCode.belongsTo(Plantule, { foreignKey: 'plantule_id' });

module.exports = {
  sequelize,
  Plantule,
  Entreposage,
  ResponsableDecontamination,
  Modification,
  Historique,
  QRCode
};
