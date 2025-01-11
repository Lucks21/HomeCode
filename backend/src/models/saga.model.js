"use strict";
import mongoose from "mongoose";

const sagaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la saga es obligatorio"],
      unique: true,
    },
    libros: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Libro", // Referencia a los libros que forman parte de la saga
      },
    ],
  },
  {
    timestamps: false, // Agrega campos createdAt y updatedAt automáticamente
    versionKey: false,
  }
);

const Saga = mongoose.model("Saga", sagaSchema);

export default Saga;
