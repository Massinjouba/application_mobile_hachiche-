const express = require('express');
const login = require('../authentification/login');
const verifierToken = require('../authentification/verifierToken');

const router = express.Router();

// Route de login
router.post('/', login);


module.exports = router;
