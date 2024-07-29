const express = require('express');
const Plantule = require('../models/Plantule');
const QRCodeService = require('../services/QRCodeService');
const sequelize = require('../config/database');
const QRCode = require('../models/QRCode');
const Modification = require('../models/Modification');

const router = express.Router();
const qrCodeService = new QRCodeService('chemin_vers_ta_base_de_donnees.sqlite');

// Créer une nouvelle plantule
router.post('/', async (req, res) => {
  try {
    const plantule = await Plantule.create(req.body);
    await qrCodeService.generateQRCodeForPlantule(plantule.id);
    res.status(201).json(plantule);
  } catch (error) {
    console.error('Error creating plantule:', error);
    res.status(400).json({ error: error.message });
  }
});

// Obtenir toutes les plantules avec leur code QR
router.get('/', async (req, res) => {
  try {
    const plantules = await Plantule.findAll();
    console.log('Plantules fetched:', plantules.length);
    const plantulesWithQR = await Promise.all(
      plantules.map(async (plantule) => {
        console.log('Fetching QR code for plantule ID:', plantule.id);
        const qrCode = await qrCodeService.getQRCodeForPlantule(plantule.id);
        return {
          ...plantule.toJSON(),
          qrCode: qrCode ? qrCode.toString('base64') : null
        };
      })
    );
    res.json(plantulesWithQR);
  } catch (error) {
    console.error('Error fetching plantules:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtenir une plantule par ID avec le code QR
router.get('/:id', async (req, res) => {
  try {
    const plantule = await Plantule.findByPk(req.params.id);
    if (!plantule) {
      return res.status(404).json({ error: 'Plantule not found' });
    }

    const qrCode = await qrCodeService.getQRCodeForPlantule(plantule.id);
    const plantuleWithQR = {
      ...plantule.toJSON(),
      qrCode: qrCode ? qrCode.toString('base64') : null
    };

    res.json(plantuleWithQR);
  } catch (error) {
    console.error('Error fetching plantule by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une plantule par ID
router.put('/:id', async (req, res) => {
  try {
    const plantule = await Plantule.findByPk(req.params.id);
    if (!plantule) {
      return res.status(404).json({ error: 'Plantule not found' });
    }
    
    await plantule.update(req.body);
    res.json(plantule);
  } catch (error) {
    console.error('Error updating plantule:', error);
    res.status(400).json({ error: error.message });
  }
});

// Supprimer une plantule par ID
router.delete('/:id', async (req, res) => {
  const plantuleId = req.params.id;
  
  try {
    await sequelize.transaction(async (t) => {
      await QRCode.destroy({ where: { plantule_id: plantuleId }, transaction: t });
      await Modification.destroy({ where: { plantule_id: plantuleId }, transaction: t });
      await Plantule.destroy({ where: { id: plantuleId }, transaction: t });
    });
    
    res.status(200).json({ message: 'Plantule supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la plantule:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la plantule', error: error.message });
  }
});

module.exports = router;
