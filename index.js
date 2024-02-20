require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const followRoutes = require("./routes/followRoutes");

const app = express();
const port = 3000;
const cors = require('cors');

const connectDB = require('./config/db');

connectDB();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Ruta base
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use("/api", followRoutes); // Ajusta la ruta base según tu preferencia

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
