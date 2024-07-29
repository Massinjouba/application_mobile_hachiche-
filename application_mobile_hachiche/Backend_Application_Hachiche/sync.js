const sequelize = require('./config/database');
const Plantule = require('./models/Plantule');
const Entreposage = require('./models/Entreposage');
const ResponsableDecontamination = require('./models/ResponsableDecontamination');
const Modification = require('./models/Modification');
const QRCode = require('./models/QRCode');
const Employer = require('./models/Employer');
const Historique = require('./models/Historique');

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
