"use strict";
import mongoose from "mongoose";

const libroSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
    },
    autor: {
      type: String,
      required: [true, "El autor es obligatorio"],
    },
    editorial: {
      type: String,
      required: [true, "La editorial es obligatoria"],
    },
    paginas: {
      type: Number,
      required: [true, "El número de páginas es obligatorio"],
      min: [1, "El libro debe tener al menos una página"],
    },
    genero: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genero",
      required: [true, "El género es obligatorio"],
    },
    isbn: {
      type: String,
      unique: true,
      required: [true, "El ISBN es obligatorio"],
    },
    saga: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Saga", 
      default: null,
    },
    formato: {
      type: String,
      enum: ["Digital", "Físico"],
      required: [true, "El formato es obligatorio"],
    },
    idioma: {
      type: String,
      required: [true, "El idioma es obligatorio"],
    },
    tipo: {
      type: String,
      enum: ["Libro", "Cómic", "Novela gráfica"],
      required: [true, "El tipo de publicación es obligatorio"],
    },
    tags: {
      type: [String],
      default: [],
    },
    portada: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const Libro = mongoose.model("Libro", libroSchema);

export default Libro;
