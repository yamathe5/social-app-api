const Post = require('../models/postModel'); // Asegúrate de tener este modelo definido

const postController = {
  // Obtener todos los posts
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los posts', error });
    }
  },

  // Obtener un post específico por su ID
  getPostById: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ message: 'Post no encontrado' });
      }

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el post', error });
    }
  },

  // Obtener todos los posts de un usuario específico
  getPostsByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const posts = await Post.find({ user: userId });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los posts del usuario', error });
    }
  },

  // Obtener un post específico de un usuario
  getPostByUserId: async (req, res) => {
    try {
      const { userId, postId } = req.params;
      const post = await Post.findOne({ _id: postId, user: userId });

      if (!post) {
        return res.status(404).json({ message: 'Post no encontrado' });
      }

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el post del usuario', error });
    }
  },

  // Crear un nuevo post
  createPost: async (req, res) => {
    try {
      const { title, content, user } = req.body; // Asumiendo que estos campos existen en tu modelo

      const newPost = new Post({
        title,
        content,
        user, // ID del usuario
        // Añade aquí más campos según tu modelo
      });

      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el post', error });
    }
  },

  // Actualizar un post por su ID
  updatePostById: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body; // Asumiendo que quieres permitir actualizar estos campos

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { title, content },
        { new: true } // Para devolver el documento modificado
      );

      if (!updatedPost) {
        return res.status(404).json({ message: 'Post no encontrado' });
      }

      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el post', error });
    }
  },

  // Borrar un post por su ID
  deletePostById: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPost = await Post.findByIdAndDelete(id);

      if (!deletedPost) {
        return res.status(404).json({ message: 'Post no encontrado' });
      }

      res.status(200).json({ message: 'Post eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el post', error });
    }
  },
};

module.exports = postController;
