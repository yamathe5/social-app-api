const express = require("express");
const followController = require("../controllers/followController");
const { validarToken } = require("../middleware/webtokenvalidation");

const router = express.Router();

// Seguir a un usuario
router.post("/:userId/follow", validarToken, followController.followUser);

// Dejar de seguir a un usuario
router.delete("/:userId/follow", validarToken, followController.unfollowUser);

// Obtener la lista de seguidores de un usuario
router.get("/:userId/followers", followController.getUserFollowers);

// Obtener la lista de usuarios seguidos por un usuario
router.get("/:userId/following", followController.getUserFollowing);

module.exports = router;
