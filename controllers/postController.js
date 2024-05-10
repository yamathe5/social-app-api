const Post = require("../models/postModel");
const User = require("../models/userModel");
const generateSignedUrl = require("../utils/generateSignedUrl");

const postController = {
  // Obtener todos los posts
  getAllPosts: async (req, res) => {
    try {
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
        .sort({ createdAt: -1 }) // Ordena por fecha de creación en orden descendente
        .lean(); // Usa .lean() para obtener un objeto JavaScript plano

      const postsWithSignedUrlsAndLikeStatus = await Promise.all(
        posts.map(async (post) => {
          const hasLiked = post.likes.map(String).includes(userId);

          // Si el post tiene una imagen, genera una URL firmada
          let signedImageUrl;
          if (post.image) {
            signedImageUrl = await generateSignedUrl(post.image);
          }

          return {
            ...post,
            hasLiked: hasLiked,
            signedImageUrl: signedImageUrl || post.image, // Usa la URL firmada si está disponible
          };
        })
      );

      res.json(postsWithSignedUrlsAndLikeStatus);
    } catch (err) {
      res.status(500).json({ message: "Error al obtener los posts", err });
    }
  },

  // Obtener un post específico por su ID
  getPostById: async (req, res) => {
    try {
      const userId = req.user.id; // Asumiendo que tienes el ID del usuario disponible aquí
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
        // .populate("likes", "username")
        .lean(); // `lean` para obtener un objeto JavaScript simple

      if (!post) {
        return res.status(404).json({ message: "Post no encontrado" });
      }

      // Convertir el arreglo de likes a un arreglo de strings para facilitar la comparación
      const likesAsString = post.likes.map((like) => like._id.toString());

      // Verificar si el usuario ha dado "like" al post
      const hasLiked = likesAsString.includes(userId);

      let signedImageUrl;
      if (post.image) {
        signedImageUrl = await generateSignedUrl(post.image);
      }

      // Agregar la propiedad hasLiked al objeto post
      const postWithLikeStatus = {
        ...post,
        hasLiked,
        signedImageUrl: signedImageUrl || post.image,
      };

      res.status(200).json(postWithLikeStatus);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el post", error });
    }
  },

  // Obtener todos los posts de un usuario específico
  getPostsByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const posts = await Post.find({ user: userId })
        .populate("user", "username email")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "username",
          },
        })
        .sort({ createdAt: -1 }) // Ordena por fecha de creación en orden descendente
        .lean();

      const postsWithSignedUrlsAndLikeStatus = await Promise.all(
        posts.map(async (post) => {
          const hasLiked = post.likes.map(String).includes(userId);

          // Si el post tiene una imagen, genera una URL firmada
          let signedImageUrl;
          if (post.image) {
            signedImageUrl = await generateSignedUrl(post.image);
          }

          return {
            ...post,
            hasLiked: hasLiked,
            signedImageUrl: signedImageUrl || post.image, // Usa la URL firmada si está disponible
          };
        })
      );

      res.status(200).json(postsWithSignedUrlsAndLikeStatus);
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
      const { content, user: userId, image } = req.body;

      // Primero, validar y obtener información del usuario
      const user = await User.findById(userId).select("username email");
      if (!user) {
          return res.status(404).json({ message: "Usuario no encontrado" });
      }


      const newPost = new Post({
        content,
        user: userId,
        image: res.locals.url,
        likes: [],
        comments: [],
      });

    
      

      const savedPost = await newPost.save();
      // Convertir el documento a un objeto JavaScript plano
      let postResponse = savedPost.toObject();
      postResponse.user = {
        _id: user._id,
        username: user.username,
        email: user.email
    };
      // Si el post tiene una imagen, genera una URL firmada
      if (postResponse.image) {
        postResponse.signedImageUrl = ""; // O manejar de otra manera si no hay imagen
        const signedImageUrl = await generateSignedUrl(postResponse.image);
        postResponse.signedImageUrl = signedImageUrl;
      } else {
        postResponse.signedImageUrl = ""; // O manejar de otra manera si no hay imagen
      }


      postResponse.hasLiked = false;
      res.status(201).json(postResponse);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Error al crear el post", error });
  }
  },

  // Actualizar un post por su ID
  updatePostById: async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { content },
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
        const newPost = await post.updateOne({ $push: { likes: userId } });
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
