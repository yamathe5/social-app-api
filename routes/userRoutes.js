const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Registrarse como nuevo usuario
router.post('/signup', userController.userSignup);

// Iniciar sesión
router.post('/login', userController.userLogin);

// Ver perfil de usuario por ID
router.get('/user/:userId', userController.getUserProfile);

// Actualizar perfil de usuario
router.put('/user/:userId', userController.updateUserProfile);

// Eliminar un usuario
router.delete('/user/:userId', userController.deleteUser);

// Seguir a un usuario
router.post('/user/:userId/follow', userController.followUser);

// Dejar de seguir a un usuario
router.delete('/user/:userId/follow', userController.unfollowUser);

// Obtener la lista de seguidores de un usuario
router.get('/user/:userId/followers', userController.getUserFollowers);

// Obtener la lista de usuarios seguidos por un usuario
router.get('/user/:userId/following', userController.getUserFollowing);

// Rutas adicionales relacionadas con usuarios, si las necesitas

module.exports = router;
