const jwt = require("jsonwebtoken");

exports.validarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado" });
  }

  try {
    // Verificar el token
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verificado;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token inválido" });
  }
};
