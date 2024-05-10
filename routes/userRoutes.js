const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const { validarToken } = require("../middleware/webtokenvalidation");
//
router.get("/users",  userController.getAllUsers);
// Registrarse como nuevo usuario
router.post("/signup", userController.userSignup);

// Iniciar sesión
router.post("/login", userController.userLogin);

// Ver perfil de usuario por ID
router.get("/user/:userId", validarToken, userController.getUserProfile);

// Actualizar perfil de usuario
router.patch("/user/:userId", validarToken, userController.updateUserProfile);

// Eliminar un usuario
router.delete("/user/:userId", validarToken, userController.deleteUser);

// Rutas adicionales relacionadas con usuarios, si las necesitas

module.exports = router;
