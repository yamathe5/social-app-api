const express = require('express');
const router = express.Router();

router.get('/comments', (req, res) => {
  res.send('Lista de comments');
});

router.post('/comments', (req, res) => {
  res.send('Cometario creado');
});

module.exports = router;
