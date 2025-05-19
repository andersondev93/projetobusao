const express = require('express');
const authRoutes = require('./auth.routes');
const linhaRoutes = require('./linha.routes');
const pontoRoutes = require('./ponto.routes');
const usuarioRoutes = require('./usuario.routes');

const router = express.Router();

// Rota de teste básica
router.get('/status', (req, res) => {
    res.json({
        status: 'ok',
        mensagem: 'API funcionando corretamente',
        timestamp: new Date().toISOString()
    });
});

router.use('/auth', authRoutes);
router.use('/linhas', linhaRoutes);
router.use('/pontos', pontoRoutes);
router.use('/usuarios', usuarioRoutes);

module.exports = router; 