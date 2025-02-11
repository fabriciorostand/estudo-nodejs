const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');
const upload = require('../upload');  // Importar o multer configurado

// Rotas de administração (Apenas admin)
router.get('/users', authMiddleware, checkRole(['admin']), UserController.getAllUsers);
router.get('/users/:id', authMiddleware, checkRole(['admin', 'user']), UserController.getUserById);

// Rota pública para criar usuário
router.post('/users', UserController.createUser);

// Rota de upload de foto de perfil (usuário autenticado)
router.post('/users/profile-pic', authMiddleware, upload.single('profilePic'), UserController.uploadProfilePic);

// Rotas de usuário autenticado (admin ou user)
router.patch('/users/:id', authMiddleware, UserController.updateUser);
router.delete('/users/:id', authMiddleware, UserController.deleteUser);

module.exports = router;