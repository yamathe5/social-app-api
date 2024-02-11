const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
  res.send('Lista de usuarios');
});

router.post('/users', (req, res) => {
  res.send('Usuario creado');
});

module.exports = router;
