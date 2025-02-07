const express = require('express');
const router = express.Router();
const { login } = require('../controllers/login.controller');

// Adicionando Log na Rota de Login
router.post('/', (req, res, next) => {
    console.log('Login route accessed');
    next();
}, login);

module.exports = router;
