const Comment = require("../models/commentModel"); // Asegúrate de tener este modelo definido
const Post = require("../models/postModel");

const commentController = {
  // Obtener todos los comentarios de una publicación
  getCommentsByPostId: async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await Comment.find({ post: postId }).populate(
        "user",
        "username"
      );
      res.status(200).json(comments);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los comentarios", error });
    }
  },

  // Añadir un nuevo comentario a una publicación
  addCommentToPost: async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId, text } = req.body; // Asumiendo que envías el ID del usuario y el texto del comentario

      const newComment = new Comment({
        post: postId,
        user: userId,
        text: text,
        // Añade aquí más campos según tu modelo
      });
      const savedComment = await newComment.save();

      await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: savedComment._id } }, // Usas $push para añadir el ID del comentario al array de comments
        { new: true } // Opcional: retorna el documento actualizado
      );

      const populatedComment = await Comment.findById(
        savedComment._id
      ).populate("user", "_id username");

      res.status(201).json(populatedComment);
    } catch (error) {
      res.status(500).json({ message: "Error al añadir el comentario", error });
    }
  },

  // Actualizar un comentario específico
  updateComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { text } = req.body; // Asumiendo que solo permites actualizar el texto del comentario

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { text: text },
        { new: true } // Para devolver el documento modificado
      );

      if (!updatedComment) {
        return res.status(404).json({ message: "Comentario no encontrado" });
      }

      res.status(200).json(updatedComment);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al actualizar el comentario", error });
    }
  },

  // Eliminar un comentario específico
  deleteComment: async (req, res) => {
    try {
      const { commentId } = req.params;

      const deletedComment = await Comment.findByIdAndDelete(commentId);

      if (!deletedComment) {
        return res.status(404).json({ message: "Comentario no encontrado" });
      }

      res.status(200).json({ message: "Comentario eliminado" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar el comentario", error });
    }
  },
};

module.exports = commentController;
