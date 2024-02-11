// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Aquí puedes tener más opciones de configuración
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    // Detener la aplicación si no se puede conectar a la base de datos
    process.exit(1);
  }
};

module.exports = connectDB;
