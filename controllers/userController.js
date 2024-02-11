const User = require("../models/userModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userController = {
  // Registro de usuario
  userSignup: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      res.status(201).json(savedUser);
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

      const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });

      res.status(200).json({ token, userId: user._id });
    } catch (error) {
      res.status(500).json({ message: "Error al iniciar sesión", error });
    }
  },

  // Ver perfil de usuario
  getUserProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el perfil", error });
    }
  },

  // Actualizar perfil de usuario
  updateUserProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, email, bio } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        {
          username,
          email,
          bio,
        },
        { new: true }
      );

      res.status(200).json(user);
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

  // Seguir a un usuario
  followUser: async (req, res) => {
    try {
      const { userId } = req.params; // ID del usuario al que quieres seguir
      const { currentUserId } = req.body; // Supongamos que obtienes el ID del usuario actual desde el cuerpo de la petición

      const user = await User.findById(userId);
      const currentUser = await User.findById(currentUserId);

      if (!user.followers.includes(currentUserId)) {
        await user.updateOne({ $push: { followers: currentUserId } });
        await currentUser.updateOne({ $push: { following: userId } });
        res.status(200).json({ message: "Usuario seguido" });
      } else {
        res.status(403).json({ message: "Ya sigues a este usuario" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al seguir al usuario", error });
    }
  },

  // Dejar de seguir a un usuario
  unfollowUser: async (req, res) => {
    try {
      const { userId } = req.params; // ID del usuario al que quieres dejar de seguir
      const { currentUserId } = req.body; // ID del usuario actual

      const user = await User.findById(userId);
      const currentUser = await User.findById(currentUserId);

      if (user.followers.includes(currentUserId)) {
        await user.updateOne({ $pull: { followers: currentUserId } });
        await currentUser.updateOne({ $pull: { following: userId } });
        res.status(200).json({ message: "Has dejado de seguir al usuario" });
      } else {
        res.status(403).json({ message: "No sigues a este usuario" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al dejar de seguir al usuario", error });
    }
  },
  // Obtener la lista de seguidores de un usuario
  getUserFollowers: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate('followers');
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({ followers: user.followers });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los seguidores', error });
    }
  },

  // Obtener la lista de usuarios seguidos por un usuario
  getUserFollowing: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate('following');
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({ following: user.following });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los usuarios seguidos', error });
    }
  },
}
module.exports = userController;


