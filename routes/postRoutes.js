const express = require('express');
const router = express.Router();

router.get('/posts', (req, res) => {
  res.send('Lista de posts');
});

router.post('/posts', (req, res) => {
  res.send('Post creado');
});

module.exports = router;
