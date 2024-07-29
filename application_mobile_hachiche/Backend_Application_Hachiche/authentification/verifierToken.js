const jwt = require('jsonwebtoken');
const secretKey = 'votre_cle_secrete';

const verifierToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token requis.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.employerId = decoded.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token invalide.' });
  }
};

module.exports = verifierToken;
