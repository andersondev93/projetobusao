const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Rotas públicas
router.get('/', UsuarioController.index);
router.get('/:id', UsuarioController.show);

// Rotas protegidas
router.put('/:id', authMiddleware, UsuarioController.update);
router.delete('/:id', authMiddleware, UsuarioController.destroy);

module.exports = router; 