const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/configDB');

// Cargar variables de entorno
dotenv.config();

if (!process.env.DB_URL || !process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  console.error('Faltan variables de entorno. Revisa tu archivo .env');
  process.exit(1);
}

// Conectar a MongoDB
connectDB();

const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/users', require('./routes/user.routes'));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});