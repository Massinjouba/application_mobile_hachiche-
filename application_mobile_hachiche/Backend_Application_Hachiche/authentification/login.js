const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Employer = require('../models/Employer');
const secretKey = 'votre_cle_secrete';

const login = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    // Trouver l'employé par email
    const employer = await Employer.findOne({ where: { Email: email } });

    if (!employer) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Comparer les mots de passe
    const validPassword = await bcrypt.compare(motDePasse, employer.Mot_de_passe);

    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: employer.ID_employer }, secretKey, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = login;
