const express = require('express');
const router = express.Router();
const {validarToken} = require('../middleware/webtokenvalidation');
const friendshipsController = require('../controllers/friendshipsController');

// Listar todos los amigos de un usuario
router.get('/friends', validarToken, friendshipsController.listFriends);

// Eliminar un amigo
router.delete('/friends/:friendId', validarToken, friendshipsController.removeFriend);

module.exports = router;
