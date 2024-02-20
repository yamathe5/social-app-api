const express = require("express");
const postController = require("../controllers/postController");
const { validarToken } = require("../middleware/webtokenvalidation");
const router = express.Router();
const multer = require("multer");

const { upload, uploadB2 } = require("../middleware/uploadFiles");

// Obtener todos los posts
router.get("/posts", validarToken, postController.getAllPosts);

// Obtener un post específico por su ID
router.get("/posts/:id", validarToken, postController.getPostById);

// Obtener todos los posts de un usuario específico
router.get("/user/:userId/posts", postController.getPostsByUserId);

// Obtener un post específico de un usuario
router.get("/user/:userId/posts/:postId", postController.getPostByUserId);

// Crear un nuevo post
router.post("/posts", upload.any(), uploadB2, postController.createPost);

// Actualizar un post por su ID
router.put("/posts/:id", postController.updatePostById);

// Borrar un post por su ID
router.delete("/posts/:id", postController.deletePostById);

// Dar "like" a una publicación
router.patch("/posts/:id/like", postController.likePost);

// Retirar "like" de una publicación
router.patch("/posts/:id/unlike", postController.unlikePost);

module.exports = router;
