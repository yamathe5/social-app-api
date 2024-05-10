const User = require("../models/userModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userController = {
  //Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
  },

  // Registro de usuario
  userSignup: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({
        username,
        email,
        password,
      });

      const savedUser = await newUser.save();

      res.status(201).json({
        message: "Usuario creado exitosamente",
        user: {
          _id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          bio: savedUser.bio,
          profilePicture: savedUser.profilePicture,
          posts: savedUser.posts,
          token: jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          }),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el usuario", error });
    }
  },

  // Iniciar sesión
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        posts: user.posts,
        token: token,
      });
    } catch (error) {
      res.status(500).json({ message: "Error al iniciar sesión", error });
    }
  },

  // Ver perfil de usuario
  getUserProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const { password } = user;
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el perfil", error });
    }
  },

  // Actualizar perfil de usuario
  updateUserProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, email, bio, password, profilePicture } = req.body;

      // Verificar la identidad del usuario aquí
      if (req.user.id !== userId) {
        return res
          .status(403)
          .json({ message: "No autorizado para actualizar este perfil" });
      }

      // Crear un objeto para las actualizaciones
      let update = {};

      // Si se proporcionaron campos, actualizarlos
      if (username) update.username = username;
      if (email) update.email = email;
      if (bio) update.bio = bio;
      if (profilePicture) update.profilePicture = profilePicture;
      if (password) {
        // Si se proporcionó una contraseña, hashea y actualiza la contraseña
        update.password = await bcrypt.hash(password, 12);
      }

      // Actualizar el usuario en la base de datos
      const user = await User.findByIdAndUpdate(userId, update, {
        new: true,
        runValidators: true,
        // Configurar context 'query' para que las validaciones de 'unique' funcionen
        context: "query",
      }).select("-password");

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json({ message: "Usuario actualziado", user });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el perfil", error });
    }
  },

  // Eliminar usuario
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      await User.findByIdAndDelete(userId);

      res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el usuario", error });
    }
  },
};
module.exports = userController;
