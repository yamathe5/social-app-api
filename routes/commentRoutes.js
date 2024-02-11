const express = require('express');
const commentController = require('../controllers/commentController');
const router = express.Router();

// Obtener todos los comentarios de una publicación
router.get('/posts/:postId/comments', commentController.getCommentsByPostId);

// Añadir un nuevo comentario a una publicación
router.post('/posts/:postId/comments', commentController.addCommentToPost);

// Actualizar un comentario específico
router.put('/comments/:commentId', commentController.updateComment);

// Eliminar un comentario específico
router.delete('/comments/:commentId', commentController.deleteComment);

// Rutas adicionales relacionadas con los comentarios, si las necesitas

module.exports = router;
