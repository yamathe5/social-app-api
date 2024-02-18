const User = require("../models/userModel");
const Follow = require("../models/followModel"); // Asegúrate de haber creado este modelo

// Seguir a un usuario
exports.followUser = async (req, res) => {
  const { userId } = req.params; // ID del usuario a seguir
  const followerId = req.user.id; // ID del usuario que sigue (debes obtenerlo del token de autenticación)
  try {
    // Verificar que el usuario no se siga a sí mismo
    if (userId === followerId.toString()) {
      return res.status(400).send("No puedes seguirte a ti mismo.");
    }
    console.log(userId);
    // Verificar si el seguimiento ya existe
    const existingFollow = await Follow.findOne({
      followerId,
      followingId: userId,
    });
    if (existingFollow) {
      return res.status(400).send("Ya sigues a este usuario.");
    }

    // Crear el seguimiento
    const follow = new Follow({ followerId, followingId: userId });
    console.log(follow, "follow");
    const resp = await follow.save();
    console.log(res, "resp");
    res.status(201).send("Usuario seguido con éxito.");
  } catch (error) {
    console.error(error.message); // Cambiado para obtener detalles específicos del error

    res.status(500).send("Error al seguir al usuario.");
  }
};

// Dejar de seguir a un usuario
exports.unfollowUser = async (req, res) => {
  const { userId } = req.params; // ID del usuario a dejar de seguir
  const followerId = req.user.id; // ID del usuario que deja de seguir

  try {
    const follow = await Follow.findOneAndDelete({
      followerId,
      followingId: userId,
    });
    if (!follow) {
      return res.status(404).send("No estás siguiendo a este usuario.");
    }

    res.send("Has dejado de seguir al usuario.");
  } catch (error) {
    res.status(500).send("Error al dejar de seguir al usuario.");
  }
};

// Obtener la lista de seguidores de un usuario
exports.getUserFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await Follow.find({ followingId: userId }).populate(
      "followerId",
      "username"
    );
    res.json(followers);
  } catch (error) {
    res.status(500).send("Error al obtener seguidores.");
  }
};

// Obtener la lista de usuarios seguidos por un usuario
exports.getUserFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await Follow.find({ followerId: userId }).populate(
      "followingId",
      "username"
    );
    res.json(following);
  } catch (error) {
    res.status(500).send("Error al obtener usuarios seguidos.");
  }
};
