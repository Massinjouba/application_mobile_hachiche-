const express = require('express');
const ResponsableDecontamination = require('../models/ResponsableDecontamination');
const sequelize = require('../config/database');

const router = express.Router();

// Créer un nouveau responsable de décontamination
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const responsable = await ResponsableDecontamination.create(req.body, { transaction });
    await transaction.commit();
    res.status(201).json(responsable);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
});

// Obtenir tous les responsables de décontamination
router.get('/', async (req, res) => {
  try {
    const responsables = await ResponsableDecontamination.findAll();
    res.json(responsables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir un responsable de décontamination par ID
router.get('/:id', async (req, res) => {
  try {
    const responsable = await ResponsableDecontamination.findByPk(req.params.id);
    if (!responsable) {
      return res.status(404).json({ error: 'Responsable de décontamination not found' });
    }
    res.json(responsable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un responsable de décontamination par ID
router.put('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const responsable = await ResponsableDecontamination.findByPk(req.params.id);
    if (!responsable) {
      return res.status(404).json({ error: 'Responsable de décontamination not found' });
    }

    await responsable.update(req.body, { transaction });
    await transaction.commit();
    res.json(responsable);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
});

// Supprimer un responsable de décontamination par ID
router.delete('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const responsable = await ResponsableDecontamination.findByPk(req.params.id);
    if (!responsable) {
      return res.status(404).json({ error: 'Responsable de décontamination not found' });
    }
    await responsable.destroy({ transaction });
    await transaction.commit();
    res.status(204).json({ message: 'Responsable de décontamination deleted' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
