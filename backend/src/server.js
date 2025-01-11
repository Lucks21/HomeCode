import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { setupDB } from './config/configDB.js'; 
import userRoutes from './routes/user.routes.js';

// Cargar variables de entorno
dotenv.config();

// Verificar variables de entorno obligatorias
if (!process.env.DB_URL || !process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  console.error('Faltan variables de entorno. Revisa tu archivo .env');
  process.exit(1);
}

// Conectar a MongoDB
setupDB();

const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/users', userRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
