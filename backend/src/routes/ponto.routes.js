const express = require('express');
const PontoController = require('../controllers/PontoController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Rotas públicas
router.get('/', PontoController.index);
router.get('/:id', PontoController.show);

// Rotas protegidas
router.post('/', authMiddleware, PontoController.store);
router.put('/:id', authMiddleware, PontoController.update);
router.delete('/:id', authMiddleware, PontoController.destroy);

module.exports = router; 