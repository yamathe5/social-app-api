const Post = require("../models/postModel"); // Asegúrate de tener este modelo definido

const postController = {
  // Obtener todos los posts
  getAllPosts: async (req, res) => {
    try {
      // console.log(req.user.id)
      const userId = req.user.id; // Asumiendo que tienes el ID del usuario disponible aquí
      const posts = await Post.find()
        .populate("user", "username email")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "username",
          },
        })
        .lean(); // Usa .lean() para obtener un objeto JavaScript plano
      // .populate("likes", "username")

      const postsWithLikeStatus = posts.map((post) => {
        const likesAsString = post.likes.map((like) => like.toString());

        const hasLiked = likesAsString.includes(userId);
        // console.log(likesAsString, userId, hasLiked);

        return { ...post, hasLiked: hasLiked };
      });

      res.json(postsWithLikeStatus);
    } catch (err) {
      res.status(500).json({ message: "Error al obtener los posts", err });
    }
  },

  // Obtener un post específico por su ID
  getPostById: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id)
        .populate("user", "username email")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "username",
          },
        })
        .populate("likes", "username");

      if (!post) {
        return res.status(404).json({ message: "Post no encontrado" });
      }

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el post", error });
    }
  },

  // Obtener todos los posts de un usuario específico
  getPostsByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const posts = await Post.find({ user: userId });
      res.status(200).json(posts);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los posts del usuario", error });
    }
  },

  // Obtener un post específico de un usuario
  getPostByUserId: async (req, res) => {
    try {
      const { userId, postId } = req.params;
      const post = await Post.findOne({ _id: postId, user: userId });

      if (!post) {
        return res.status(404).json({ message: "Post no encontrado" });
      }

      res.status(200).json(post);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener el post del usuario", error });
    }
  },

  // Crear un nuevo post
  createPost: async (req, res) => {
    try {
      const { title, content, user } = req.body;

      const newPost = new Post({
        title,
        content,
        user,
        likes: [],
        comments: [],
      });

      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el post", error });
    }
  },

  // Actualizar un post por su ID
  updatePostById: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { title, content },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ message: "Post no encontrado" });
      }

      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el post", error });
    }
  },

  // Borrar un post por su ID
  deletePostById: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPost = await Post.findByIdAndDelete(id);

      if (!deletedPost) {
        return res.status(404).json({ message: "Post no encontrado" });
      }

      res.status(200).json({ message: "Post eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el post", error });
    }
  },

  likePost: async (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId; // Asume que el ID del usuario se envía en el cuerpo de la solicitud

    try {
      const post = await Post.findById(postId);

      if (!post.likes.includes(userId)) {
        await post.updateOne({ $push: { likes: userId } });
        res.status(200).json({ message: "El post ha sido likeado" });
      } else {
        res.status(400).json({ message: "Ya has dado like a este post" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al dar like al post", error });
    }
  },

  unlikePost: async (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId; // Asume que el ID del usuario se envía en el cuerpo de la solicitud

    try {
      const post = await Post.findById(postId);

      if (post.likes.includes(userId)) {
        await post.updateOne({ $pull: { likes: userId } });
        res.status(200).json({ message: "El like ha sido retirado" });
      } else {
        res.status(400).json({ message: "No has dado like a este post" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al retirar el like del post", error });
    }
  },
};

module.exports = postController;
