const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

router.get('/users', authMiddleware, checkRole(['admin']), UserController.getAllUsers);
router.get('/users/:id', authMiddleware, checkRole(['admin', 'user']), UserController.getUserById);
router.post('/users', UserController.createUser);
router.patch('/users/:id', authMiddleware, checkRole(['admin', 'user']), UserController.updateUser);
router.delete('/users/:id', authMiddleware, checkRole(['admin']), UserController.deleteUser);

module.exports = router;