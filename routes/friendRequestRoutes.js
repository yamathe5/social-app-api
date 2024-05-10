const express = require('express');
const router = express.Router();
const {validarToken} = require('../middleware/webtokenvalidation');

const friendRequestController = require('../controllers/friendRequestController');

// Enviar solicitud de amistad
router.post('/friend-requests', validarToken, friendRequestController.sendFriendRequest);

// Ver solicitudes de amistad enviadas
router.get('/friend-requests/sent', validarToken, friendRequestController.viewSentRequests);

// Ver solicitudes de amistad recibidas
router.get('/friend-requests/received', validarToken, friendRequestController.viewReceivedRequests);

// Aceptar una solicitud de amistad
router.put('/friend-requests/accept/:requestId', validarToken, friendRequestController.acceptFriendRequest);

// Cancelar una solicitud de amistad enviada o recibida
router.delete('/friend-requests/cancel/:requestId', validarToken, friendRequestController.cancelFriendRequest);

module.exports = router;
