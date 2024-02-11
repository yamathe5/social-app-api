const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();



// Obtener todos los posts
router.get('/posts', postController.getAllPosts);

// Obtener un post específico por su ID
router.get('/posts/:id', postController.getPostById);

// Obtener todos los posts de un usuario específico
router.get('/user/:userId/posts', postController.getPostsByUserId);

// Obtener un post específico de un usuario
router.get('/user/:userId/posts/:postId', postController.getPostByUserId);

// Crear un nuevo post
router.post('/posts', postController.createPost);

// Actualizar un post por su ID
router.put('/posts/:id', postController.updatePostById);

// Borrar un post por su ID
router.delete('/posts/:id', postController.deletePostById);




module.exports = router;
