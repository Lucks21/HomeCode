"use strict";

// Importa el módulo necesario para manejar rutas
import path from "path";
import { fileURLToPath } from "url";

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta al archivo .env
const envFilePath = path.resolve(__dirname, "../../.env");

// Carga las variables de entorno desde el archivo .env
import dotenv from "dotenv";
dotenv.config({ path: envFilePath });

// Exporta las variables de entorno
export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const DB_URL = process.env.DB_URL;
export const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
export const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
