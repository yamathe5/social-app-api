const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
  },
  content: {
    type: String,
    required: [true, 'El contenido es obligatorio'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio'],
  },
  // Considera añadir campos para manejar 'likes', comentarios, fecha de publicación, etc.
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
}, { timestamps: true }); // Añade marcas de tiempo para `createdAt` y `updatedAt`

// Crea el modelo Post con el esquema definido
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
