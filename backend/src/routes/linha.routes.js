const express = require('express');
const LinhaController = require('../controllers/LinhaController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Rotas públicas
router.get('/', LinhaController.index);
router.get('/:id', LinhaController.show);

// Rotas protegidas
router.post('/', authMiddleware, LinhaController.store);
router.put('/:id', authMiddleware, LinhaController.update);
router.delete('/:id', authMiddleware, LinhaController.destroy);

module.exports = router; 