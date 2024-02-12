// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/socialapp', {
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
