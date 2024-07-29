const express = require('express');
const Modification = require('../models/Modification');

const router = express.Router();

// Créer une nouvelle modification
router.post('/', async (req, res) => {
  try {
    const modification = await Modification.create(req.body);
    res.status(201).json(modification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtenir toutes les modifications
router.get('/', async (req, res) => {
  try {
    const modifications = await Modification.findAll();
    res.json(modifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir une modification par ID
router.get('/:id', async (req, res) => {
  try {
    const modification = await Modification.findByPk(req.params.id);
    if (!modification) {
      return res.status(404).json({ error: 'Modification not found' });
    }
    res.json(modification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une modification par ID
router.put('/:id', async (req, res) => {
  try {
    const modification = await Modification.findByPk(req.params.id);
    if (!modification) {
      return res.status(404).json({ error: 'Modification not found' });
    }
    await modification.update(req.body);
    res.json(modification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Supprimer une modification par ID
router.delete('/:id', async (req, res) => {
  try {
    const modification = await Modification.findByPk(req.params.id);
    if (!modification) {
      return res.status(404).json({ error: 'Modification not found' });
    }
    await modification.destroy();
    res.status(204).json({ message: 'Modification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
