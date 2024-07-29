const express = require('express');
const bcrypt = require('bcrypt');
const  Employer  = require('../models/Employer');
const router = express.Router();

// Route pour l'inscription d'un nouvel employeur
router.post('/', async (req, res) => {
    const { nom, prenom, dateNaissance, adresse, numeroTelephone, email, motDePasse } = req.body;

    try {
        // Validation des données
        if (!nom || !prenom || !motDePasse) {
            return res.status(400).json({ error: 'Nom, prénom, et mot de passe sont requis' });
        }

        // Vérification si l'employeur existe déjà
        const existingEmployer = await Employer.findOne({ where: { Email: email } });
        if (existingEmployer) {
            return res.status(400).json({ error: 'Un employeur avec cet email existe déjà' });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        // Création de l'employeur
        const newEmployer = await Employer.create({
            Nom: nom,
            Prenom: prenom,
            Date_naissance: dateNaissance,
            Adresse: adresse,
            Numero_telephone: numeroTelephone,
            Email: email,
            Mot_de_passe: hashedPassword
        });

        res.status(201).json({ message: 'Employeur enregistré avec succès', employerId: newEmployer.ID_employer });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
});

module.exports = router;
