"use strict";

import mongoose from "mongoose";
import { DB_URL } from "./configEnv.js";
import { handleError } from "../utils/errorHandler.js";

export async function setupDB() {
  try {
    if (!DB_URL) {
      throw new Error("La URI de conexión a MongoDB (DB_URL) no está definida");
    }

    // Conectar a la base de datos (sin las opciones deprecated)
    await mongoose.connect(DB_URL);
    console.log("✅ => Conectado a la base de datos");
  } catch (error) {
    handleError(error, "configDB.js -> setupDB");
    console.error("❌ => Error al conectar a la base de datos:", error.message);
    process.exit(1);
  }
}
