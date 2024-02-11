const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Asegúrate de que la ruta sea correcta
const postRoutes = require('./routes/postRoutes'); // Asegúrate de que la ruta sea correcta
const commentRoutes = require('./routes/commentRoutes'); // Asegúrate de que la ruta sea correcta
const app = express();
const port = 3000;
const connectDB = require('./config/db'); // Asegúrate de que la ruta sea correcta

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Ruta base
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
