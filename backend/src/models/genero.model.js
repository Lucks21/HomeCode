"use strict";
import mongoose from "mongoose";

const generoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del género es obligatorio"],
      unique: true,
      enum: ["Fantasía", "Ciencia Ficción", "Misterio", "Romance", "Terror"], // Lista predefinida de géneros
    },
  },
  {
    timestamps: false, // Agrega campos createdAt y updatedAt automáticamente
    versionKey: false,
  }
);

const Genero = mongoose.model("Genero", generoSchema);

export default Genero;
