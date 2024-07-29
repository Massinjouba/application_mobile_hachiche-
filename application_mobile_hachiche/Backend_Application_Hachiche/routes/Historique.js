const express = require('express');
const Historique = require('../models/Historique');
const Plantule = require('../models/Plantule');
const router = express.Router();

// Obtenir l'historique de modifications d'une plantule par ID
router.get('/plantule/:plantuleId', async (req, res) => {
  try {
    const historique = await Historique.findAll({ where: { plantule_id: req.params.plantuleId } });
    if (!historique || historique.length === 0) {
      return res.status(404).json({ error: 'Historique not found for this plantule' });
    }
    res.json(historique);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ajouter une nouvelle entrée dans l'historique
router.post('/', async (req, res) => {
  try {
    const historique = await Historique.create(req.body);
    res.status(201).json(historique);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtenir toutes les entrées de l'historique
router.get('/', async (req, res) => {
  try {
    const historique = await Historique.findAll();
    res.json(historique);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir une entrée de l'historique par ID
router.get('/:id', async (req, res) => {
  try {
    const historique = await Historique.findByPk(req.params.id);
    if (!historique) {
      return res.status(404).json({ error: 'Historique not found' });
    }
    res.json(historique);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une entrée de l'historique par ID
router.put('/:id', async (req, res) => {
  try {
    const historique = await Historique.findByPk(req.params.id);
    if (!historique) {
      return res.status(404).json({ error: 'Historique not found' });
    }
    
    await historique.update(req.body);
    res.json(historique);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Supprimer une entrée de l'historique par ID
router.delete('/:id', async (req, res) => {
  try {
    const historique = await Historique.findByPk(req.params.id);
    if (!historique) {
      return res.status(404).json({ error: 'Historique not found' });
    }
    
    await historique.destroy();
    res.status(200).json({ message: 'Historique entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
