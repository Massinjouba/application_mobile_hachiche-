const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const Plantule = require('../models/Plantule');
const Entreposage = require('../models/Entreposage');
const ResponsableDecontamination = require('../models/ResponsableDecontamination');
const QRCodeService = require('../services/QRCodeService');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const qrCodeService = new QRCodeService('chemin_vers_ta_base_de_donnees.sqlite');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    console.log('File:', req.file);  // Ajouter un log pour vérifier le fichier
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    for (const row of data) {
      let entreposageId = null;
      let responsableId = null;

      // Gestion de l'Entreposage
      if (row.entreposage_id) {
        let entreposage = await Entreposage.findByPk(row.entreposage_id);
        if (!entreposage) {
          entreposage = await Entreposage.create({
            id: row.entreposage_id,
            nom: `Entreposage ${row.entreposage_id}`,
          });
          console.log(`Nouvel entreposage créé avec l'ID ${entreposage.id}`);
        }
        entreposageId = entreposage.id;
      }

      // Gestion du Responsable de décontamination
      if (row.responsable_decontamination_id) {
        let responsable = await ResponsableDecontamination.findByPk(row.responsable_decontamination_id);
        if (!responsable) {
          responsable = await ResponsableDecontamination.create({
            id: row.responsable_decontamination_id,
            nom: `Responsable ${row.responsable_decontamination_id}`,
          });
          console.log(`Nouveau responsable de décontamination créé avec l'ID ${responsable.id}`);
        }
        responsableId = responsable.id;
      }

      // Créer la plantule
      const plantule = await Plantule.create({
        identification: row.identification,
        etat_sante: row.etat_sante,
        date_arrivee: new Date(row.date_arrivee),
        provenance: row.provenance,
        description: row.description,
        stade: row.stade,
        actif: row.actif === 'true',
        date_retrait: row.date_retrait ? new Date(row.date_retrait) : null,
        item_retire: row.item_retire,
        note: row.note,
        entreposage_id: entreposageId,
        responsable_decontamination_id: responsableId,
      });

      // Générer le QR code pour la nouvelle plantule
      await qrCodeService.generateQRCodeForPlantule(plantule.id);
      console.log(`QR code généré pour la plantule avec l'ID ${plantule.id}`);
    }

    res.send('Données insérées avec succès et QR codes générés');
  } catch (error) {
    console.error('Erreur serveur:', error);  // Log détaillé de l'erreur
    res.status(500).send("Erreur lors de l'insertion des données ou de la génération des QR codes");
  }
});

module.exports = router;
