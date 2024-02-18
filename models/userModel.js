const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Asegúrate de que esto coincida exactamente con cómo definiste el modelo de usuario
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Igual aquí
  },
  
}, { timestamps: true });

// Middleware para cifrar la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
