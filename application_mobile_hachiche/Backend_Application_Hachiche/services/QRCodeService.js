const QRCode = require('qrcode');
const fs = require('fs');
const Plantule = require('../models/Plantule');
const QRCodeModel = require('../models/QRCode');

class QRCodeService {
  async generateQRCodeForPlantule(plantuleId) {
    try {
      const plantule = await Plantule.findByPk(plantuleId);
      if (!plantule) {
        throw new Error('Plantule not found');
      }

      // Générer le contenu JSON de la plantule
      const content = JSON.stringify({
        id: plantule.id,
        identification: plantule.identification,
        etat_sante: plantule.etat_sante,
        date_arrivee: plantule.date_arrivee,
        provenance: plantule.provenance,
        description: plantule.description,
        stade: plantule.stade,
        actif: plantule.actif,
        date_retrait: plantule.date_retrait,
        item_retire: plantule.item_retire,
        note: plantule.note,
      }, null, 2);

      const jsonFilePath = `plantule_${plantuleId}.json`;
      fs.writeFileSync(jsonFilePath, content);

      // Générer le code QR pour le contenu JSON
      const filePath = `temp_qr_code_${plantuleId}.png`;
      await QRCode.toFile(filePath, jsonFilePath);

      const qrCodeData = fs.readFileSync(filePath);
      await QRCodeModel.create({ plantule_id: plantuleId, qr_code: qrCodeData });

      fs.unlinkSync(filePath);
      fs.unlinkSync(jsonFilePath);
      console.log(`QR code generated and stored for plantule with ID ${plantuleId}`);
    } catch (error) {
      console.error('Error generating QR code for plantule:', error);
    }
  }

  async getQRCodeForPlantule(plantuleId) {
    try {
      const qrCodeEntry = await QRCodeModel.findOne({ where: { plantule_id: plantuleId } });
      if (!qrCodeEntry) {
        return null;
      }
      return qrCodeEntry.qr_code;
    } catch (error) {
      console.error('Error retrieving QR code for plantule:', error);
      return null;
    }
  }
}

module.exports = QRCodeService;
